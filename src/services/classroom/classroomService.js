// src/services/classroom/classroomService.js
import { classroomApi } from "../../api/classroom/classroomApi";

// Chuẩn hoá item từ BE → FE
function normalize(item) {
  // Hỗ trợ cả status: "ACTIVE"/"INACTIVE" hoặc active: boolean
  const status = item.status ?? (item.active ? "ACTIVE" : "INACTIVE");
  const active = item.active ?? status === "ACTIVE";
  return { ...item, status, active };
}

export const classroomService = {
  async list(params) {
    const data = await classroomApi.list(params);
    if (Array.isArray(data)) {
      return {
        items: data.map(normalize),
        page: 0,
        size: data.length,
        total: data.length,
      };
    }
    const items = (data.content || []).map(normalize);
    return {
      items,
      page: data.number ?? params?.page ?? 0,
      size: data.size ?? params?.size ?? 10,
      total: data.totalElements ?? items.length,
    };
  },

  async getById(id) {
    const data = await classroomApi.getById(id);
    return normalize(data);
  },

  async create(payload) {
    const data = await classroomApi.create(payload);
    return normalize(data);
  },

  async update(id, payload) {
    const data = await classroomApi.update(id, payload);
    return normalize(data);
  },

  // NEW: bật/tắt
  async enable(id) {
    try {
      const data = await classroomApi.enable(id); // PATCH /enable
      return normalize(data);
    } catch {
      // fallback: PUT full object nếu BE không có PATCH riêng
      const old = await classroomApi.getById(id);
      const data = await classroomApi.update(id, {
        ...old,
        active: true,
        status: "ACTIVE",
      });
      return normalize(data);
    }
  },

  async disable(id) {
    try {
      const data = await classroomApi.disable(id); // PATCH /disable
      return normalize(data);
    } catch {
      const old = await classroomApi.getById(id);
      const data = await classroomApi.update(id, {
        ...old,
        active: false,
        status: "INACTIVE",
      });
      return normalize(data);
    }
  },
};
