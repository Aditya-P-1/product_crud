import React from "react";

function ProductDetailsModal({
  isOpen,
  onClose,
  product,
}) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      
      <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px]">
        
        <h2 className="text-3xl font-bold mb-4">
          {product.name || product.title}
        </h2>

        <p className="text-gray-700 mb-4">
          {product.description}
        </p>

        <p className="text-sm text-gray-500 mb-1">
          Category: {product.category || "General"}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          Stock: {product.stock ?? 0}
        </p>

        <p className="text-blue-600 font-bold text-xl mb-6">
          ₹ {product.price}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsModal;