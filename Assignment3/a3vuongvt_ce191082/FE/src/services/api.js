// Tác giả & coder: Thanh Vuong CE190182
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Tự động đính kèm JWT Token vào Header Authorization
apiClient.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem("fuminihotel_user");
        if (raw) {
            const user = JSON.parse(raw);
            if (user?.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
    } catch {
        // ignore parse error
    }
    return config;
});

export const extractErrorMessage = (error, fallback = "Có lỗi xảy ra khi kết nối máy chủ!") => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (typeof error?.response?.data === "string" && error.response.data.trim()) {
        return error.response.data;
    }
    return error?.message || fallback;
};

export const formatCurrency = (amount) => {
    const num = Number(amount || 0);
    return num.toLocaleString("vi-VN") + " VNĐ";
};

export const api = {
    // 1. Auth (JWT Login & Customer Registration)
    login: (email, password) => apiClient.post("/auth/login", { email, password }),
    register: (data) => apiClient.post("/auth/register", data),

    // 2. Rooms & RoomTypes (Public GET & Staff CRUD)
    getPublicRooms: (search = "", roomTypeId = "") =>
        apiClient.get("/rooms/public", {
            params: {
                ...(search ? { search } : {}),
                ...(roomTypeId ? { roomTypeId } : {}),
            },
        }),
    getAllRooms: (search = "") =>
        apiClient.get("/rooms", { params: search ? { search } : {} }),
    createRoom: (data) => apiClient.post("/rooms", data),
    updateRoom: (id, data) => apiClient.put(`/rooms/${id}`, data),
    deleteRoom: (id) => apiClient.delete(`/rooms/${id}`),

    getRoomTypes: () => apiClient.get("/room-types"),
    createRoomType: (data) => apiClient.post("/room-types", data),

    // 3. Customers (Staff CRUD & Search)
    getCustomers: (search = "") =>
        apiClient.get("/customers", { params: search ? { search } : {} }),
    getCustomerById: (id) => apiClient.get(`/customers/${id}`),
    createCustomer: (data) => apiClient.post("/customers", data),
    updateCustomer: (id, data) => apiClient.put(`/customers/${id}`, data),
    deleteCustomer: (id) => apiClient.delete(`/customers/${id}`),

    // 4. Customer Profile
    getProfile: (id) => apiClient.get(`/profile/${id}`),
    updateProfile: (id, data) => apiClient.put(`/profile/${id}`, data),

    // 5. Booking Reservations (Staff CRUD & Customer Online Booking / History)
    getAllBookings: (search = "") =>
        apiClient.get("/bookings", { params: search ? { search } : {} }),
    getCustomerBookings: (customerId) =>
        apiClient.get(`/bookings/customer/${customerId}`),
    createBooking: (data) => apiClient.post("/bookings", data),
    updateBooking: (id, data) => apiClient.put(`/bookings/${id}`, data),
    deleteBooking: (id) => apiClient.delete(`/bookings/${id}`),
};

export default api;
