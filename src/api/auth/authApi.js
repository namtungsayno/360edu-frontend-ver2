import { http } from "api/http";

export const authApi = {
  login: ({ username, password }) =>
    http.post("/auth/login", { username, password }),
  getProfile: () => http.get("/auth/me"),
  logout: () => http.post("/auth/logout"),
};
