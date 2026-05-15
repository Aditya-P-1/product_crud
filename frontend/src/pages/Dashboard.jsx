import React, { useState, useEffect, useRef } from "react"

import Navbar from "../components/Navbar"
import SearchFilter from "../components/SearchFilter"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import ProductDetailsModal from "../components/ProductDetailsModal"
import PaginationBar from "../components/PaginationBar"
import ProductGridSkeleton from "../components/ProductGridSkeleton"
import productApi from "../api/productApi"
import { useDebouncedValue } from "../hooks/useDebouncedValue"

const PAGE_SIZE = 9

function Dashboard() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [listNonce, setListNonce] = useState(0)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isListRefreshing, setIsListRefreshing] = useState(false)
  const [listError, setListError] = useState("")
  const [listSuccessMessage, setListSuccessMessage] = useState("")

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 400)
  const [category, setCategory] = useState("")

  const [actionBanner, setActionBanner] = useState(null)

  const isFirstFetch = useRef(true)
  const successTimeoutRef = useRef(null)

  const bumpList = () => setListNonce((n) => n + 1)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    const controller = new AbortController()

    const run = async () => {
      setListError("")
      if (isFirstFetch.current) {
        setIsInitialLoading(true)
      } else {
        setIsListRefreshing(true)
      }

      try {
        const response = await productApi.getProducts(
          page,
          PAGE_SIZE,
          debouncedSearch,
          { signal: controller.signal }
        )

        if (controller.signal.aborted) {
          return
        }

        const payload = response.data.data
        const list = payload.products || []
        const totalCount = payload.total ?? 0
        const pages = payload.pages ?? 1

        if (list.length === 0 && page > 1) {
          if (totalCount > 0) {
            setPage((p) => Math.max(1, p - 1))
          } else {
            setPage(1)
          }
          return
        }

        setProducts(list)
        setTotal(totalCount)
        setTotalPages(Math.max(pages, 1))

        if (successTimeoutRef.current) {
          window.clearTimeout(successTimeoutRef.current)
        }
        setListSuccessMessage(
          totalCount === 0
            ? "No products match your filters."
            : `Showing ${list.length} product${list.length === 1 ? "" : "s"} on this page (${totalCount} total).`
        )
        successTimeoutRef.current = window.setTimeout(() => {
          setListSuccessMessage("")
        }, 4000)
      } catch (err) {
        if (
          controller.signal.aborted ||
          err.code === "ERR_CANCELED" ||
          err.name === "CanceledError"
        ) {
          return
        }
        const message =
          err.response?.data?.message || "Failed to fetch products. Please try again."
        setListError(message)
        setListSuccessMessage("")
        console.error("Fetch error:", err)
      } finally {
        if (!controller.signal.aborted) {
          if (isFirstFetch.current) {
            setIsInitialLoading(false)
            isFirstFetch.current = false
          }
          setIsListRefreshing(false)
        }
      }
    }

    run()

    return () => {
      controller.abort()
    }
  }, [page, debouncedSearch, listNonce])

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let filtered = products

    if (category) {
      filtered = filtered.filter(
        (product) => product.category === category
      )
    }

    setFilteredProducts(filtered)
  }, [category, products])

  const handleRetryList = () => {
    setListError("")
    bumpList()
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await productApi.deleteProduct(id)
      setActionBanner({ type: "success", text: "Product deleted successfully." })
      bumpList()
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete product"
      setActionBanner({ type: "error", text: message })
      console.error("Delete error:", err)
    }
  }

  const handleAddProduct = () => {
    setEditProduct(null)
    setIsModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (editProduct) {
        await productApi.updateProduct(editProduct._id, productData)
        setActionBanner({ type: "success", text: "Product updated successfully." })
        bumpList()
      } else {
        await productApi.createProduct(productData)
        setActionBanner({ type: "success", text: "Product created successfully." })
        setPage(1)
        bumpList()
      }
      setIsModalOpen(false)
      setEditProduct(null)
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save product"
      setActionBanner({ type: "error", text: message })
      console.error("Save error:", err)
    }
  }

  const handleView = (product) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const handleSearch = (searchValue) => {
    setSearch(searchValue)
  }

  const handleCategoryFilter = (categoryValue) => {
    setCategory(categoryValue)
  }

  const dismissListError = () => setListError("")
  const dismissActionBanner = () => setActionBanner(null)

  return (
    <div>
      <Navbar />

      <div className="p-4 md:p-6">
        {actionBanner && (
          <div
            className={`mb-4 px-4 py-3 rounded border flex justify-between gap-3 items-start ${
              actionBanner.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
            role="status"
          >
            <span>{actionBanner.text}</span>
            <button
              type="button"
              onClick={dismissActionBanner}
              className="text-sm font-semibold shrink-0 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {listError && (
          <div
            className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            role="alert"
          >
            <span>{listError}</span>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRetryList}
                className="px-3 py-1.5 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={dismissListError}
                className="px-3 py-1.5 rounded border border-red-300 text-sm font-medium hover:bg-red-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {listSuccessMessage && !listError && (
          <div
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4"
            role="status"
          >
            {listSuccessMessage}
          </div>
        )}

        <SearchFilter
          onAdd={handleAddProduct}
          onSearch={handleSearch}
          onCategoryFilter={handleCategoryFilter}
          disabled={isInitialLoading}
        />

        <div className="relative min-h-[200px]">
          {isInitialLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : (
            <>
              {isListRefreshing && (
                <div
                  className="absolute inset-0 z-10 bg-white/70 flex flex-col items-center justify-center gap-2 rounded-lg"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="h-9 w-9 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-gray-700">Updating products…</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onView={handleView}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    {category
                      ? "No products in this category on the current page."
                      : "No products found."}
                  </div>
                )}
              </div>

              {!listError && total > 0 && (
                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={PAGE_SIZE}
                  disabled={isListRefreshing}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editProduct={editProduct}
      />

      <ProductDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}

export default Dashboard
