import React from "react"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

function ProductCard({
  product,
  onDelete,
  onEdit,
  onView,
}) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <div
        onClick={() => onView(product)}
        className="cursor-pointer"
      >
        <h2 className="text-xl font-bold mb-2">
          {product.name}
        </h2>

        <p className="text-gray-600 mb-2">
          {product.description}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Category: {product.category || 'General'}
        </p>

        <p className="text-sm text-gray-500 mb-3">
          Stock: {product.stock || 0}
        </p>

        <p className="font-semibold text-blue-600 mb-4">
          ₹ {product.price}
        </p>
      </div>

      {isAuthenticated && (
        <div className="flex justify-end gap-5">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit product"
          >
            <FaEdit size={18} />
          </button>

          <button
            onClick={() => onDelete(product._id || product.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete product"
          >
            <FaTrash size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCard