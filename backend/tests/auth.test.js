const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/User')

describe('Auth Endpoints', () => {
  // Connect to test database before running tests
  beforeAll(async () => {
    // If you're using a test database URL from env, use it
    const testDbUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/ecommerce_test'
    await mongoose.connect(testDbUri)
  })

  // Clean up database after each test
  afterEach(async () => {
    await User.deleteMany({})
  })

  // Disconnect from database after all tests
  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('User registered successfully')
      expect(res.body.data.token).toBeDefined()

      // Verify user was created in database
      const user = await User.findOne({ email: 'test@example.com' })
      expect(user).toBeDefined()
    })

    it('should return 400 if user already exists', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      // Second registration with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('User already exists')
    })

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('Validation failed')
    })

    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
    })

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toBe('Login successful')
      expect(res.body.data.token).toBeDefined()
    })

    it('should return 401 if email not found', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toBe('Invalid credentials')
    })

    it('should return 401 if password is incorrect', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })

      expect(res.statusCode).toBe(401)
    })

    it('should return 400 if email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })
})
