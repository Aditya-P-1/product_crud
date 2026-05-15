# Product Dashboard (Frontend)

React + Vite client for the ProductHub-style ecommerce API. It provides authentication, a product dashboard, and CRUD flows backed by the Express/MongoDB service.

## Clone repository

Clone the repository, then enter the frontend directory:

```bash
git clone https://github.com/Aditya-P-1/product_crud.git ecommerce
cd ecommerce/frontend
```

If your layout differs, `cd` into this app’s root (the folder that contains `package.json` and `vite.config.js`).

## Features

- **Authentication-aware UI**: Dashboard is always reachable. Login and Register are shown for guests; Logout and product mutations (add / edit / delete) appear only when authenticated.
- **Paginated product list**: Products load in pages from the API (`page`, `limit`, `search`). The UI shows **Previous / Next**, current page, and a **“Showing X–Y of Z products”** summary.
- **Debounced search**: Search input is debounced (400ms) before calling `GET /products` so typing does not spam the server.
- **Loading, success, and error states**:
  - **Initial load**: Skeleton grid while the first page is fetched; search/filter controls are disabled until that completes.
  - **Refetch** (page change, search, or after mutations): Semi-transparent overlay with a spinner and “Updating products…”.
  - **Success**: Short-lived green status banner after a successful list load (and dismissible green/red banners for create/update/delete).
  - **Errors**: Dismissible error banner for list failures with **Retry** and **Dismiss**; failed requests do not clear the prior list until a successful load replaces it.

## Tech stack

- React 19, React Router 7
- Vite 8, Tailwind CSS 4
- Axios (JWT on requests, 401 handling)
- Vitest + Testing Library

## Environment

Copy `.env.example` to `.env.local` (or configure your env) and set:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is omitted, the client defaults to `http://localhost:5000/api`.

## Scripts

```bash
npm install
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Vitest
npm run lint     # ESLint
```

## Project structure (high level)

```txt
src/
  api/           # Axios instance + auth/product clients
  components/    # Navbar, SearchFilter, cards, modals, pagination, skeletons
  context/       # AuthProvider / useAuth
  hooks/         # e.g. useDebouncedValue
  pages/         # Dashboard, Login, Signup
  routes/        # ProtectedRoute (available for future routes)
  tests/         # Vitest specs
```

## Pagination & API contract

The dashboard requests:

```http
GET /products?page=<n>&limit=9&search=<optional>
```

The API returns `data.products`, `data.total`, `data.page`, and `data.pages`. The UI maps those into the grid and `PaginationBar`.

## Testing

```bash
npm test -- --run
```

Tests mock network modules where needed and run in `happy-dom`.

## Related

See `../backend/README.md` for API details, environment variables, Docker, and integration testing with Jest/Supertest.
