const Product = require("../models/Product")
const { successResponse , errorResponse } = require("../utils/apiResponse")

const createProduct = async (req, res) => {
  try {

    const {
      name,
      description,
      price,
      category,
      stock
    } = req.body

    if (!name || !price) {
      errorResponse(res, 400, "Name and price are required")
      return
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      createdBy: req.user.userId
    })

    successResponse(res, 201, "Product created successfully", product)

  } catch (error) {
    errorResponse(res, 500, error.message)
  }
}

const getProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1

    const limit = Number(req.query.limit) || 10

    const search = req.query.search || ""

    const skip = (page - 1) * limit

    const query = {
      name: {
        $regex: search,
        $options: "i"
      }
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Product.countDocuments(query)

    successResponse(res, 200, "Products fetched successfully", {
      products,
      total,
      page,
      pages: Math.ceil(total / limit)
    })

  } catch (error) {
      errorResponse(res, 500, error.message)
  }
}

const getSingleProduct = async (req, res) => {
  try {

    const product = await Product.findById(
      req.params.id
    )

    if (!product) {
      errorResponse(res, 404, "Product not found")
      return
    }

    successResponse(res, 200, "Product fetched successfully", product)

  } catch (error) {

    errorResponse(res, 500, error.message)
  }
}

const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after"
      }
    )

    if (!product) {
      errorResponse(res, 404, "Product not found")
      return
    }

    successResponse(res, 200, "Product updated successfully", product)

  } catch (error) {

    errorResponse(res, 500, error.message)
  }
}


const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(
      req.params.id
    )

    if (!product) {
      errorResponse(res, 404, "Product not found")
      return
    }

    successResponse(res, 200, "Product deleted successfully", product)

  } catch (error) {

    errorResponse(res, 500, error.message)
  }
}

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
}

