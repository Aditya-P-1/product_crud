const express = require("express")

const router = express.Router()

const protect = require("../middleware/auth.middleware.js")

const validate = require(
  "../middleware/validate.middleware"
)

const {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  getProductsQuerySchema
} = require(
  "../validations/product.validation"
)

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require(
  "../controllers/product.controller"
)

router.get(
  "/",
  validate(getProductsQuerySchema, "query"),
  getProducts
)

router.get(
  "/:id",
  validate(productIdSchema, "params"),
  getSingleProduct
)

router.post(
  "/",
  protect,
  validate(createProductSchema),
  createProduct
)

router.put(
  "/:id",
  protect,
  validate(productIdSchema, "params"),
  validate(updateProductSchema),
  updateProduct
)

router.delete(
  "/:id",
  protect,
  validate(productIdSchema, "params"),
  deleteProduct
)

module.exports = router