import React from "react"

function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  disabled,
}) {
  if (totalPages <= 1 && total === 0) {
    return null
  }

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
      <p className="text-sm text-gray-600">
        Showing{" "}
        <span className="font-medium text-gray-800">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-gray-800">{total}</span>{" "}
        products
      </p>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600 px-2">
          Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
          <span className="font-semibold text-gray-900">
            {Math.max(totalPages, 1)}
          </span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= totalPages}
          className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default PaginationBar
