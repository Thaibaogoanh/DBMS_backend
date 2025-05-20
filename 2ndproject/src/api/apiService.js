import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Attempt to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                        refreshToken
                    });
                    const { token } = response.data;
                    localStorage.setItem('token', token);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

// Helper function to handle API responses
const handleResponse = (response) => {
    if (response.data.success === false) {
        throw new Error(response.data.message || 'Request failed');
    }
    return response.data;
};

// Auth API
export const authApi = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        const data = handleResponse(response);
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        }
        return data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const data = handleResponse(response);
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken);
            }
        }
        return data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return handleResponse(response);
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return handleResponse(response);
    },

    changePassword: async (passwordData) => {
        const response = await api.put('/auth/change-password', passwordData);
        return handleResponse(response);
    }
};

// User Management API (Admin)
export const userApi = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    updateUser: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    }
};

// Category API
export const categoryApi = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return handleResponse(response);
    },

    getCategory: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return handleResponse(response);
    },

    getCategoryProducts: async (id, params) => {
        const response = await api.get(`/categories/${id}/products`, { params });
        return handleResponse(response);
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return handleResponse(response);
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return handleResponse(response);
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return handleResponse(response);
    }
};

// Product API
export const productApi = {
    getProducts: async (params) => {
        const response = await api.get('/products', { params });
        return handleResponse(response);
    },

    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return handleResponse(response);
    },

    createProduct: async (product) => {
        const response = await api.post('/products', product);
        return handleResponse(response);
    },

    updateProduct: async (id, product) => {
        const response = await api.put(`/products/${id}`, product);
        return handleResponse(response);
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return handleResponse(response);
    },

    createReview: async (productId, reviewData) => {
        const response = await api.post(`/products/${productId}/reviews`, reviewData);
        return handleResponse(response);
    }
};

// Order API
export const orderApi = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return handleResponse(response);
    },

    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return handleResponse(response);
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/myorders');
        return handleResponse(response);
    },

    getAllOrders: async (params) => {
        const response = await api.get('/orders/all/list', { params });
        return handleResponse(response);
    },

    updateOrderStatus: async (id, statusData) => {
        const response = await api.put(`/orders/${id}/status`, statusData);
        return handleResponse(response);
    },

    markOrderAsDelivered: async (id) => {
        const response = await api.put(`/orders/${id}/deliver`);
        return handleResponse(response);
    }
};

// Recommendations API
export const recommendationsApi = {
    getUserRecommendations: async () => {
        const response = await api.get('/recommendations/user-recommendations');
        return handleResponse(response);
    },

    getSimilarProducts: async (productId) => {
        const response = await api.get(`/recommendations/similar-products/${productId}`);
        return handleResponse(response);
    },

    getCategoryHierarchy: async () => {
        const response = await api.get('/recommendations/category-hierarchy');
        return handleResponse(response);
    },

    getPurchasePatterns: async () => {
        const response = await api.get('/recommendations/purchase-patterns');
        return handleResponse(response);
    },

    getFrequentlyBought: async (productId) => {
        const response = await api.get(`/recommendations/frequently-bought/${productId}`);
        return handleResponse(response);
    },

    recordPurchase: async (productId) => {
        const response = await api.post('/recommendations/record-purchase', { productId });
        return handleResponse(response);
    }
};

export default api; 