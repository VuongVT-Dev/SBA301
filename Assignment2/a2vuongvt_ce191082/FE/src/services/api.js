// Tác giả & coder: Thanh Vuong CE190182
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Helper lấy thông báo lỗi rõ ràng từ Spring Boot Backend
export const extractErrorMessage = (error, fallback = "Có lỗi xảy ra khi kết nối máy chủ!") => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (typeof error?.response?.data === "string" && error.response.data.trim()) {
        return error.response.data;
    }
    return error?.message || fallback;
};

export const api = {
    // 1. Auth
    login: (email, password) => apiClient.post("/auth/login", { email, password }),

    // 2. Accounts (Admin & Staff Profile)
    getAccounts: (search = "") =>
        apiClient.get("/accounts", { params: search ? { search } : {} }),
    getAccountById: (id) => apiClient.get(`/accounts/${id}`),
    createAccount: (data) => apiClient.post("/accounts", data),
    updateAccount: (id, data) => apiClient.put(`/accounts/${id}`, data),
    deleteAccount: (id) => apiClient.delete(`/accounts/${id}`),

    // 3. Categories (Staff)
    getCategories: (search = "") =>
        apiClient.get("/categories", { params: search ? { search } : {} }),
    createCategory: (data) => apiClient.post("/categories", data),
    updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data),
    deleteCategory: (id) => apiClient.delete(`/categories/${id}`),

    // 4. Tags (Staff)
    getTags: (search = "") =>
        apiClient.get("/tags", { params: search ? { search } : {} }),
    createTag: (data) => apiClient.post("/tags", data),
    updateTag: (id, data) => apiClient.put(`/tags/${id}`, data),
    deleteTag: (id) => apiClient.delete(`/tags/${id}`),

    // 5. News Articles (Public & Staff)
    getPublicNews: (search = "") =>
        apiClient.get("/news/public", { params: search ? { search } : {} }),
    getAllNews: (search = "") =>
        apiClient.get("/news", { params: search ? { search } : {} }),
    getNewsHistory: (accountId) =>
        apiClient.get(`/news/history/${accountId}`),
    createNews: (data) => apiClient.post("/news", data),
    updateNews: (id, data) => apiClient.put(`/news/${id}`, data),
    deleteNews: (id) => apiClient.delete(`/news/${id}`),
};

export default api;
