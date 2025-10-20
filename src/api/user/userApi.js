import { http } from "api/http";

const PATH = {
  root: "/users",
  teachers: "/users/teachers",
  enabled: (id) => `/users/${id}/enabled`,
  changePw: (id) => `/users/${id}/change-password`,
  user: (id) => `/users/${id}`,
  teacherProfile: (id) => `/users/${id}/teacher-profile`,
};

export const userApi = {
  list: (params) => http.get(PATH.root, { params }), // {q, page, size}
  listTeachers: (params) => http.get(PATH.teachers, { params }), // {page, size}
  get: (id) => http.get(PATH.user(id)),
  update: (id, payload) => http.put(PATH.user(id), payload),
  changePassword: (id, payload) => http.post(PATH.changePw(id), payload),
  setEnabled: (id, enabled) => http.patch(PATH.enabled(id), { enabled }),
  createTeacher: (payload) => http.post(PATH.teachers, payload),
  getTeacherProfile: (userId) => http.get(PATH.teacherProfile(userId)),
  updateTeacherProfile: (userId, payload) =>
    http.put(PATH.teacherProfile(userId), payload),
};
