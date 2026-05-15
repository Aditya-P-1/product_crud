import React, { useState } from "react"
import { useAuth } from "../context/AuthContext"

function SearchFilter({ onAdd, onSearch, onCategoryFilter, disabled = false }) {
  const { isAuthenticated } = useAuth()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setCategory(value)
    if (onCategoryFilter) {
      onCategoryFilter(value)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
      
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
          disabled={disabled}
          className="border p-3 rounded w-full bg-white disabled:bg-gray-100 disabled:text-gray-500"
        />

        <select 
          value={category}
          onChange={handleCategoryChange}
          disabled={disabled}
          className="border p-3 rounded w-full md:w-[250px] bg-white disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="books">Books</option>
        </select>

      </div>

      {/* Add Product Button - Only for authenticated users */}
      {isAuthenticated && (
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 whitespace-nowrap disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          + Add Product
        </button>
      )}

    </div>
  )
}

export default SearchFilter