import axios from "axios";

const API_URL = "https://nt-shopping-list.onrender.com/api";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export const login = async (credentials) => {
    try {
        const response = await api.post("/auth", credentials);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post("/users", userData);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Delete User Error:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    } catch (error) {
        console.error("Logout Error:", error.message);
    }
};

export default api;
