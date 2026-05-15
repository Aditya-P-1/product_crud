const { z } = require("zod")

const productIdSchema = z.object({
  id: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid product ID"
    )
})

const createProductSchema = z.object({

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description too long")
    .optional(),

  price: z
    .number({
      required_error: "Price is required"
    })
    .positive("Price must be greater than 0"),

  category: z
    .string()
    .max(50, "Category too long")
    .optional(),

  stock: z
    .number({
      required_error: "Stock is required"
    })
    .min(0, "Stock cannot be negative")
})


const updateProductSchema = z.object({

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .optional(),

  description: z
    .string()
    .max(1000)
    .optional(),

  price: z
    .number()
    .positive("Price must be greater than 0")
    .optional(),

  category: z
    .string()
    .max(50)
    .optional(),

  stock: z
    .number()
    .min(0, "Stock cannot be negative")
    .optional()
})

const getProductsQuerySchema = z.object({

  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .optional(),

  search: z
    .string()
    .optional()
})

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  getProductsQuerySchema
}