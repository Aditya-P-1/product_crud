# ProductHub API

A scalable and production-ready RESTful API for managing products in an online store.

Built with:

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Docker
* Zod Validation

---

# Features

## Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes
* Password Hashing with bcryptjs

---

## Product Management

* Create Product
* Get All Products
* Get Single Product
* Update Product
* Delete Product
* Search Products
* Pagination Support

---

## Scalability & Security

* Modular Architecture
* Request Validation using Zod
* Centralized Error Handling
* Standardized API Responses
* Rate Limiting
* Helmet Security Middleware
* MongoDB Indexing
* Request Logging with Morgan

---

# Project Structure

```txt
src/
 ├── config/
 ├── controllers/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── utils/
 ├── validations/
 └── app.js
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Aditya-P-1/product_crud.git ecommerce
```

---

## Navigate to Backend

```bash
cd ecommerce/backend
```

---

# Environment Variables

Create a `.env` file:

```env
PORT=5000

MONGO_URI=mongodb://mongo:27017/product

JWT_SECRET=mysecretkey
```

---

# Running with Docker

## Start Containers

```bash
docker compose up --build
```

---

# Running Without Docker

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

---

# API Base URL

```txt
http://localhost:5000/api
```

---

# Authentication APIs

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "email": "admin@test.com"
    }
  }
}
```

---

# Product APIs

## Get Products

### Endpoint

```http
GET /api/products?page=1&limit=10&search=iphone
```

Query parameters are validated (numeric `page` / `limit`, optional `search`). Pagination is applied server-side: results are sorted by `createdAt` descending, with `skip` / `limit` and a total count for the current filter.

### Success Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [],
    "total": 0,
    "page": 1,
    "pages": 1
  }
}
```

- **`products`**: array of product documents for the requested page.
- **`total`**: total number of products matching the search filter (all pages).
- **`page`**: current page number.
- **`pages`**: total number of pages (`ceil(total / limit)`).

The React dashboard consumes these fields to render a **paginated product list** with proper loading, success, and error handling on the client.

---

## Get Single Product

### Endpoint

```http
GET /api/products/:id
```

---

## Create Product

### Endpoint

```http
POST /api/products
```

### Headers

```http
Authorization: Bearer YOUR_TOKEN
```

### Request Body

```json
{
  "name": "iPhone 15",
  "description": "Apple smartphone",
  "price": 1200,
  "category": "Electronics",
  "stock": 10
}
```

---

## Update Product

### Endpoint

```http
PUT /api/products/:id
```

---

## Delete Product

### Endpoint

```http
DELETE /api/products/:id
```

---

# Validation

The API uses Zod validation for:

* Authentication payloads
* Product payloads
* Query parameters
* Route parameters

Example validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than 0"
    }
  ]
}
```

---

# Authentication Flow

1. Register a user
2. Login using credentials
3. Receive JWT token
4. Pass token in Authorization header
5. Access protected routes

Example:

```http
Authorization: Bearer jwt_token
```

---

# Scalability Considerations

The application was designed with scalability and maintainability in mind.

Implemented improvements:

* Modular folder structure
* Centralized validation middleware
* Centralized error handling
* MongoDB indexing for faster search
* Pagination support
* Rate limiting to prevent abuse
* Helmet security middleware
* Consistent API response structure

---

# Security Features

* JWT Authentication
* Password Hashing with bcryptjs
* Helmet Middleware
* Rate Limiting
* Protected Routes
* Payload Validation

---

# Database

MongoDB was selected because:

* Flexible schema design
* Fast CRUD operations
* Easy scalability
* Excellent Node.js integration
* Efficient product search capabilities

Indexes were added for optimized search performance.

---

# Testing

Automated API tests run with Jest and Supertest (see `npm test` in this folder). Set `MONGO_TEST_URI` or use the default `mongodb://localhost:27017/ecommerce_test`.

You can also exercise the API manually with:
* Postman


---

# Future Improvements

* Refresh Token Authentication
* Redis Caching
* Role-based Authorization
* CI/CD Pipeline
