// src/api/auth/authApi.js
import { http } from "api/http";

export const authApi = {
  login: ({ username, password }) =>
    http.post("/auth/login", { username, password }).then((r) => r.data),

  getProfile: () => http.get("/auth/singup").then((r) => r.data),

  logout: () => http.post("/auth/logout").then((r) => r.data),
};
