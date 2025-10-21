import { userApi } from "api/user/userApi";
const wrap = async (fn) => {
  try {
    const r = await fn();
    return r.data;
  } catch (e) {
    throw new Error(e?.displayMessage || e.message);
  }
};

export const userService = {
  list: (q, page = 0, size = 20) => wrap(() => userApi.list({ q, page, size })),
  listTeachers: (page = 0, size = 20) =>
    wrap(() => userApi.listTeachers({ page, size })),
  get: (id) => wrap(() => userApi.get(id)),
  update: (id, dto) => wrap(() => userApi.update(id, dto)),
  changePassword: (id, dto) => wrap(() => userApi.changePassword(id, dto)),
  setEnabled: (id, enabled) => wrap(() => userApi.setEnabled(id, enabled)),
  createTeacher: (dto) => wrap(() => userApi.createTeacher(dto)),
  getTeacherProfile: (userId) => wrap(() => userApi.getTeacherProfile(userId)),
  updateTeacherProfile: (userId, dto) =>
    wrap(() => userApi.updateTeacherProfile(userId, dto)),
};
