import axios from "axios";

const API_URL = "http://localhost:8000/api";

// For fetching the initial products
export async function productsData() {
  const products = await axios.get(
    "https://fakestoreapiserver.reactbd.com/products"
  );
  return products;
}

// Product management API functions
export const productApi = {
  // Get all products
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // If the server connection fails, fall back to the fake store API
      const fakeResponse = await productsData();
      return fakeResponse.data;
    }
  },

  // Get a specific product
  getProduct: async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  },

  // Create a new product
  createProduct: async (product) => {
    const response = await axios.post(`${API_URL}/products`, product);
    return response.data;
  },

  // Update an existing product
  updateProduct: async (id, product) => {
    const response = await axios.put(`${API_URL}/products/${id}`, product);
    return response.data;
  },

  // Delete a product
  deleteProduct: async (id) => {
    await axios.delete(`${API_URL}/products/${id}`);
    return true;
  }
};