import React, { useEffect, useState } from "react";

function ProductModal({
  isOpen,
  onClose,
  onSave,
  editProduct,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || "",
        category: editProduct.category || "",
        description: editProduct.description || "",
        price: editProduct.price || "",
        stock: editProduct.stock || "",
      });
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
      });
    }
  }, [editProduct]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // VALIDATION
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required";
    } else if (isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Convert price and stock to numbers
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    onSave(submitData);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">

      <div className="bg-white p-6 rounded-xl w-full max-w-[500px]">

        <h2 className="text-2xl font-bold mb-5">
          {editProduct
            ? "Edit Product"
            : "Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* PRODUCT NAME */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            >
              <option value="">
                Select Category
              </option>

              <option value="electronics">
                Electronics
              </option>

              <option value="fashion">
                Fashion
              </option>

              <option value="books">
                Books
              </option>
            </select>

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              rows={4}
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* PRICE */}
          <div>
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price}
              </p>
            )}
          </div>

          {/* STOCK */}
          <div>
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              value={formData.stock}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-4">

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Product
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
