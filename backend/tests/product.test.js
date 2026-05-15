const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/User')
const Product = require('../src/models/Product')
const generateToken = require('../src/utils/generateToken')

describe('Product Endpoints', () => {
  let token
  let userId

  beforeAll(async () => {
    const testDbUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/ecommerce_test'
    await mongoose.connect(testDbUri)
  })

  beforeEach(async () => {
    // Create a test user and get token
    const user = await User.create({
      email: 'testuser@example.com',
      password: 'hashed_password',
    })
    userId = user._id
    token = generateToken(userId)
  })

  afterEach(async () => {
    await User.deleteMany({})
    await Product.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET /api/products', () => {
    it('should get all products (public endpoint)', async () => {
      // Create test products
      await Product.create({
        name: 'iPhone 15',
        description: 'Latest Apple smartphone',
        price: 120000,
        category: 'electronics',
        stock: 10,
        createdBy: userId,
      })

      const res = await request(app)
        .get('/api/products')

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.products.length).toBe(1)
      expect(res.body.data.total).toBe(1)
    })

    it('should search products by name', async () => {
      await Product.create({
        name: 'iPhone 15',
        description: 'Latest Apple smartphone',
        price: 120000,
        category: 'electronics',
        stock: 10,
        createdBy: userId,
      })

      await Product.create({
        name: 'MacBook Pro',
        description: 'Apple laptop',
        price: 180000,
        category: 'electronics',
        stock: 5,
        createdBy: userId,
      })

      const res = await request(app)
        .get('/api/products')
        .query({ search: 'iPhone' })

      expect(res.statusCode).toBe(200)
      expect(res.body.data.products.length).toBe(1)
      expect(res.body.data.products[0].name).toBe('iPhone 15')
    })

    it('should support pagination', async () => {
      // Create 15 products
      for (let i = 1; i <= 15; i++) {
        await Product.create({
          name: `Product ${i}`,
          description: `Description ${i}`,
          price: 1000 * i,
          category: 'electronics',
          stock: 10,
          createdBy: userId,
        })
      }

      const res = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 10 })

      expect(res.statusCode).toBe(200)
      expect(res.body.data.products.length).toBe(10)
      expect(res.body.data.total).toBe(15)
      expect(res.body.data.page).toBe(1)
      expect(res.body.data.pages).toBe(2)
    })
  })

  describe('GET /api/products/:id', () => {
    it('should get a single product', async () => {
      const product = await Product.create({
        name: 'iPhone 15',
        description: 'Latest Apple smartphone',
        price: 120000,
        category: 'electronics',
        stock: 10,
        createdBy: userId,
      })

      const res = await request(app)
        .get(`/api/products/${product._id}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('iPhone 15')
    })

    it('should return 404 if product not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const res = await request(app)
        .get(`/api/products/${fakeId}`)

      expect(res.statusCode).toBe(404)
    })

    it('should return 400 for invalid product ID', async () => {
      const res = await request(app)
        .get('/api/products/invalid-id')

      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /api/products', () => {
    it('should create a product when authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'iPhone 15',
          description: 'Latest Apple smartphone',
          price: 120000,
          category: 'electronics',
          stock: 10,
        })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('iPhone 15')
      expect(res.body.data.createdBy).toBe(userId.toString())
    })

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'iPhone 15',
          description: 'Latest Apple smartphone',
          price: 120000,
          category: 'electronics',
          stock: 10,
        })

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Latest Apple smartphone',
          category: 'electronics',
          stock: 10,
          // Missing name and price
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should validate price is positive', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'iPhone 15',
          description: 'Latest Apple smartphone',
          price: -100,
          category: 'electronics',
          stock: 10,
        })

      expect(res.statusCode).toBe(400)
    })
  })

  describe('PUT /api/products/:id', () => {
    let productId

    beforeEach(async () => {
      const product = await Product.create({
        name: 'iPhone 15',
        description: 'Latest Apple smartphone',
        price: 120000,
        category: 'electronics',
        stock: 10,
        createdBy: userId,
      })
      productId = product._id
    })

    it('should update a product when authenticated', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'iPhone 15 Pro',
          price: 150000,
        })

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.name).toBe('iPhone 15 Pro')
      expect(res.body.data.price).toBe(150000)
    })

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({
          name: 'iPhone 15 Pro',
        })

      expect(res.statusCode).toBe(401)
    })

    it('should return 404 if product not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const res = await request(app)
        .put(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'iPhone 15 Pro',
        })

      expect(res.statusCode).toBe(404)
    })
  })

  describe('DELETE /api/products/:id', () => {
    let productId

    beforeEach(async () => {
      const product = await Product.create({
        name: 'iPhone 15',
        description: 'Latest Apple smartphone',
        price: 120000,
        category: 'electronics',
        stock: 10,
        createdBy: userId,
      })
      productId = product._id
    })

    it('should delete a product when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)

      // Verify product was deleted
      const product = await Product.findById(productId)
      expect(product).toBeNull()
    })

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)

      expect(res.statusCode).toBe(401)
    })

    it('should return 404 if product not found', async () => {
      const fakeId = new mongoose.Types.ObjectId()

      const res = await request(app)
        .delete(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(404)
    })
  })
})
