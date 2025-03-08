import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Get all products
export const getAllProducts = () => API.get('/products');

// Create a new product
export const createProduct = (productData) => API.post('/products', productData);

// Soft delete a product
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Undelete a product
export const undeleteProduct = (id) => API.patch(`/products/undelete/${id}`);

export default API;
