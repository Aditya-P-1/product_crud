const { errorResponse } = require("../utils/apiResponse")

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Default error
  let statusCode = err.statusCode || 500
  let message = err.message || "Internal Server Error"

  // MongoDB validation error
  if (err.name === "ValidationError") {
    statusCode = 400
    message = "Validation Error"
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 400
    message = "Duplicate field value entered"
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401
    message = "Invalid token"
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401
    message = "Token expired"
  }

  // Cast error
  if (err.name === "CastError") {
    statusCode = 400
    message = "Invalid ID format"
  }

  return errorResponse(res, statusCode, message)
}

module.exports = errorHandler
