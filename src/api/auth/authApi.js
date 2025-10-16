import { http } from "api/http";

export const authApi = {
  login: (credentials) => http.post("/auth/login", credentials),
  getProfile: () => http.get("/auth/me"),
  logout: () => http.post("/auth/logout"),
};
