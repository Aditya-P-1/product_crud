const express = require("express")
const cors = require("cors")
require("dotenv").config()
const helmet = require("helmet")
const morgan = require("morgan")

const connectDB = require("./config/db")
const productRoutes = require("./routes/product.routes")
const authRoutes = require("./routes/auth.routes")
const limiter = require("./middleware/rateLimiter")
const errorHandler = require("./middleware/error.middleware")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan("dev"))
app.use(limiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "API running"
  })
})

// Error handling middleware (should be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (require.main === module) {
  connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
  })
}

module.exports = app