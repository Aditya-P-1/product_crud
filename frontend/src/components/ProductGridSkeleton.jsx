import React from "react"

function ProductGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-xl shadow animate-pulse"
        >
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-5/6 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}

export default ProductGridSkeleton
