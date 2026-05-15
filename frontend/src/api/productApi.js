import axiosInstance from './axios'

const productApi = {
  getProducts: (page = 1, limit = 10, search = '', requestConfig = {}) => {
    return axiosInstance.get('/products', {
      params: {
        page,
        limit,
        search,
      },
      ...requestConfig,
    })
  },

  getSingleProduct: (id) => {
    return axiosInstance.get(`/products/${id}`)
  },

  createProduct: (productData) => {
    return axiosInstance.post('/products', productData)
  },

  updateProduct: (id, productData) => {
    return axiosInstance.put(`/products/${id}`, productData)
  },

  deleteProduct: (id) => {
    return axiosInstance.delete(`/products/${id}`)
  },
}

export default productApi
