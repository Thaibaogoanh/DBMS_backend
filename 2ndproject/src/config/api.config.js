const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        PROFILE: `${API_BASE_URL}/auth/profile`
    },
    // Product endpoints
    PRODUCTS: {
        LIST: `${API_BASE_URL}/products`,
        DETAIL: (id) => `${API_BASE_URL}/products/${id}`,
        CREATE: `${API_BASE_URL}/products`,
        UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
        DELETE: (id) => `${API_BASE_URL}/products/${id}`
    },
    // Category endpoints
    CATEGORIES: {
        LIST: `${API_BASE_URL}/categories`,
        DETAIL: (id) => `${API_BASE_URL}/categories/${id}`
    },
    // Order endpoints
    ORDERS: {
        LIST: `${API_BASE_URL}/orders`,
        DETAIL: (id) => `${API_BASE_URL}/orders/${id}`,
        CREATE: `${API_BASE_URL}/orders`
    },
    // Recommendation endpoints
    RECOMMENDATIONS: {
        USER: `${API_BASE_URL}/recommendations/user-recommendations`,
        SIMILAR: (id) => `${API_BASE_URL}/recommendations/similar-products/${id}`,
        FREQUENTLY_BOUGHT: (id) => `${API_BASE_URL}/recommendations/frequently-bought/${id}`,
        CATEGORY_HIERARCHY: `${API_BASE_URL}/recommendations/category-hierarchy`,
        RECORD_PURCHASE: `${API_BASE_URL}/recommendations/record-purchase`
    }
};

export const getAuthHeader = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`
    }
}); 