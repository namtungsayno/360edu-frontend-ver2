import axios from "axios";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

console.log("MOCK MODE =", process.env.REACT_APP_USE_MOCK);

// Mock đơn giản nếu chưa có backend
if (process.env.REACT_APP_USE_MOCK === "true") {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  // mock POST /auth/login
  http.post = async (url, data, cfg) => {
    if (url === "/auth/login") {
      await delay(500);
      if (data?.email === "admin@demo.com" && data?.password === "123") {
        return { data: { accessToken: "demo-at", refreshToken: "demo-rt" } };
      }
      const error = new Error("Unauthorized");
      error.response = {
        status: 401,
        data: { message: "Email hoặc mật khẩu không đúng" },
      };
      throw error;
    }
    if (url === "/auth/logout") {
      await delay(200);
      return { data: { ok: true } };
    }
    // fallback thật sự
    return axios.post(url, data, cfg);
  };

  // mock GET /auth/me
  const originalGet = http.get.bind(http);
  http.get = async (url, cfg) => {
    if (url === "/auth/me") {
      await delay(300);
      const at = localStorage.getItem("access_token");
      if (!at) {
        const error = new Error("Unauthenticated");
        error.response = { status: 401, data: { message: "Unauthenticated" } };
        throw error;
      }
      return {
        data: { id: 1, email: "admin@demo.com", fullName: "Demo Admin" },
      };
    }
    return originalGet(url, cfg);
  };
}
