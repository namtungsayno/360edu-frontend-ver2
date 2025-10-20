// src/api/classroom/classroomApi.js
import { http } from "../http"; // chỉnh đường dẫn nếu http.js ở nơi khác

const BASE = "/classrooms"; // đổi nếu BE của bạn khác (vd: "/api/v1/classrooms")

export const classroomApi = {
  list(params = {}) {
    return http.get(BASE, { params }).then((r) => r.data);
  },
  getById(id) {
    return http.get(`${BASE}/${id}`).then((r) => r.data);
  },
  create(payload) {
    return http.post(BASE, payload).then((r) => r.data);
  },
  update(id, payload) {
    return http.put(`${BASE}/${id}`, payload).then((r) => r.data);
  },
  enable(id) {
    return http.patch?.(`${BASE}/${id}/enable`).then((r) => r.data);
  },
  disable(id) {
    return http.patch?.(`${BASE}/${id}/disable`).then((r) => r.data);
  },
};
