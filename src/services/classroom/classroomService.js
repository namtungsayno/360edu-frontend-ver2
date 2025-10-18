// src/services/classroom/classroomService.js
import { classroomApi } from "../../api/classroom/classroomApi";

/**
 * Tầng service gom logic chuyển đổi dữ liệu, fallback cho 2 dạng response
 * (mảng hoặc page object), mapping DTO nếu cần.
 */
export const classroomService = {
  async list(params) {
    const data = await classroomApi.list(params);
    if (Array.isArray(data)) {
      return {
        items: data,
        page: 0,
        size: data.length,
        total: data.length,
      };
    }
    return {
      items: data.content || [],
      page: data.number ?? params?.page ?? 0,
      size: data.size ?? params?.size ?? 10,
      total: data.totalElements ?? data.content?.length ?? 0,
    };
  },

  getById: classroomApi.getById,
  create: classroomApi.create,
  update: classroomApi.update,
  remove: classroomApi.remove,
};
