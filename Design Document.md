# Design Document — Product Ecommerce API & Dashboard

This document describes the architecture of the **backend** (Express + MongoDB) and **frontend** (React + Vite), how they integrate, and the contracts between them.

---

## 1. API structure and endpoints

**Base URL (local default):** `http://localhost:5000/api`

All JSON APIs are mounted under `/api`. The Express app also exposes `GET /` at the server root (non-prefixed) returning a simple health-style JSON message.

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create user; returns JWT |
| POST | `/api/auth/login` | No | Login; returns JWT |

### Products (`/api/products`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | No | List products (pagination + optional search) |
| GET | `/api/products/:id` | No | Single product by MongoDB ObjectId |
| POST | `/api/products` | Yes (Bearer JWT) | Create product |
| PUT | `/api/products/:id` | Yes | Update product |
| DELETE | `/api/products/:id` | Yes | Delete product |

**Query parameters (GET list):**

- `page` — optional string of digits (default `1` after coercion in controller)
- `limit` — optional string of digits (default `10`)
- `search` — optional string; applied as case-insensitive regex on `name`

**Rate limiting:** Global Express rate limiter applies to all routes (see `middleware/rateLimiter.js`).

---

## 2. Authentication mechanism

1. **Registration / login**  
   On success, the server issues a **JWT** signed with `JWT_SECRET`, payload `{ userId }`, expiry **7 days** (`utils/generateToken.js`).

2. **Protected product mutations**  
   Client sends:
   ```http
   Authorization: Bearer <jwt>
   ```
   Middleware `protect` (`auth.middleware.js`) verifies the token and attaches `req.user` (decoded payload, including `userId`).

3. **Frontend**  
   - Token and a minimal `user` object (email) are stored in `localStorage` after login/register.  
   - Axios request interceptor adds `Authorization` when a token exists (`api/axios.js`).  
   - On **401**, the client clears storage and dispatches `auth-logout` so React auth state resets.

4. **Public catalog**  
   `GET /api/products` and `GET /api/products/:id` do **not** require a token; the dashboard can be browsed without logging in. Create/update/delete require auth.

---

## 3. Request / response structure

### Success (most endpoints)

Uses `successResponse` from `utils/apiResponse.js`:

```json
{
  "success": true,
  "message": "<human-readable message>",
  "data": { }
}
```

`data` may be an object, array, or primitive depending on the endpoint (e.g. product document, `{ token }`, paginated `{ products, total, page, pages }`).

### Error (application errors)

Uses `errorResponse`:

```json
{
  "success": false,
  "message": "<summary message>",
  "errors": null
}
```

For **Zod validation failures**, `errors` is an array of `{ "field": "<name>", "message": "<detail>" }`.

### Auth edge case

Wrong password on login returns **401** with a body that may **only** include `{ "message": "Invalid credentials" }` (not the full `success: false` envelope). Clients should treat any 401 on login as a failed credential check.

### Unauthorized (missing/invalid JWT on protected routes)

```json
{ "message": "Unauthorized" }
```
or
```json
{ "message": "Invalid token" }
```

---

## 4. Data assumptions and validations

### User (`User` model)

- `email` — required, unique  
- `password` — stored **hashed** (bcrypt, cost factor 10)

**Zod (auth):**

- Register / login: valid **email** string; **password** min length **6** (see `validations/auth.validation.js`).

### Product (`Product` model)

- `name` — required string, trimmed  
- `price` — required number, `min: 0`  
- `description` — optional, default `""`  
- `category` — optional string, default `"General"`  
- `stock` — number, default `0`, `min: 0`  
- `createdBy` — ObjectId ref to `User` (set server-side on create)

**Zod (products):** `validations/product.validation.js` — stricter rules on create/update (e.g. name length, positive price for create). **Query** validation for list: numeric string `page` / `limit`, optional `search`. **Params:** `:id` must be a 24-char hex MongoDB ObjectId.

**Search behavior:** List handler builds `name: { $regex: search, $options: "i" }`. An empty `search` still matches all names (empty regex).

---

## 5. Example usage scenarios (cURL)

Replace `BASE=http://localhost:5000/api`, `TOKEN=...`, and IDs as needed.

**Register**

```bash
curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret12"}'
```

**Login**

```bash
curl -s -X POST "$BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret12"}'
```

**List products (page 1, limit 9, search)**

```bash
curl -s "$BASE/products?page=1&limit=9&search=phone"
```

**Create product**

```bash
curl -s -X POST "$BASE/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Phone X","description":"Flagship","price":999,"category":"electronics","stock":5}'
```

**Update product**

```bash
curl -s -X PUT "$BASE/products/PRODUCT_OBJECT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Phone X Pro","price":1099}'
```

**Delete product**

```bash
curl -s -X DELETE "$BASE/products/PRODUCT_OBJECT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Postman:** Create an environment with `baseUrl`, `token`; use `{{baseUrl}}/auth/login` and save the token from `data.token` into the environment for the `Authorization` header on product mutations.

---

## 6. Trade-offs and assumptions

| Topic | Decision | Trade-off |
|-------|-----------|-----------|
| **JWT in localStorage** | Simple SPA integration | XSS could exfiltrate tokens; mitigations would be httpOnly cookies + CSRF or stricter CSP (not implemented here). |
| **No refresh tokens** | Single access JWT, 7d TTL | Long-lived token if stolen; simpler server, no refresh endpoint. |
| **Public product list** | GET products open | Good for browse-only UX; abuse mitigated partly by rate limiting, not by auth. |
| **Search** | Regex on `name` only | Fast to implement; heavy wildcard patterns could stress DB; no full-text scoring. |
| **Category filter (frontend)** | Client-side filter on current page | Categories not sent to API for list; filtering only applies to loaded page slice. |
| **App bootstrap** | `app.js` connects DB only when run as main module | Allows Jest to import the app without starting Mongo or listening. |
| **Login error shape** | Inconsistent envelope on one 401 path | Frontend tolerates `message` at top level or under `response.data`. |

---

## 7. Unit / integration tests

### Backend (`backend/tests/`)

- **Runner:** Jest, `supertest`, MongoDB.  
- **Command:** `cd backend && npm test`  
- **Database:** `MONGO_TEST_URI` or default `mongodb://localhost:27017/ecommerce_test`.  
- **Files:**  
  - `auth.test.js` — register, duplicate user, validation, login success/failure.  
  - `product.test.js` — public list/search/pagination, single product, CRUD with auth, 401/404/400 paths.

### Frontend (`frontend/src/tests/`)

- **Runner:** Vitest + Testing Library (`happy-dom`).  
- **Command:** `cd frontend && npm test -- --run`  
- **Files:**  
  - `AuthContext.test.jsx` — auth state, login/logout/error with mocked `authApi`.  
  - `Login.test.jsx` — form validation, API integration mocks, loading, link to signup.  
  - `ProtectedRoute.test.jsx` — gated content vs redirect behavior with router + auth mocks.

Tests are integration-style for the API (real HTTP + DB) and component-level for the UI (mocked HTTP).

---