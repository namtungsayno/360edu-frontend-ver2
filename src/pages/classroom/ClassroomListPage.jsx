// src/pages/classroom/ClassroomListPage.jsx
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  DoorOpen,
  Users,
  Activity,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  X,
} from "lucide-react";
import useClassrooms from "../../hooks/classroom/useClassrooms";

/* ===== Tiny UI ===== */
const Card = ({ className = "", children }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);
const CardHeader = ({ title, right }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-100">
    <h3 className="font-semibold text-slate-800">{title}</h3>
    {right}
  </div>
);
const CardBody = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Badge = ({ color = "slate", children }) => {
  const map = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-md ${map[color]}`}>
      {children}
    </span>
  );
};

/* ===== Minimal Modal (no lib) ===== */
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-[71] w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-lg border border-slate-200">
        {children}
      </div>
    </div>
  );
}

/* ===== Form dùng chung cho Create/Edit ===== */
function Switch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition",
        checked ? "bg-slate-900" : "bg-slate-300",
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function ClassroomForm({
  mode = "create",
  initialValue = { id: "", name: "", capacity: 30, active: true },
  onSubmit,
  onCancel,
  submitting,
}) {
  const [v, setV] = useState(initialValue);
  const [err, setErr] = useState({});

  function setField(k, val) {
    setV((s) => ({ ...s, [k]: val }));
  }

  function validate() {
    const e = {};
    if (!v.id.trim()) e.id = "Bắt buộc";
    if (!v.name.trim()) e.name = "Bắt buộc";
    if (!String(v.capacity).trim() || Number(v.capacity) <= 0)
      e.capacity = "Phải > 0";
    setErr(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      id: v.id.trim(),
      name: v.name.trim(),
      capacity: Number(v.capacity),
      active: !!v.active,
    });
  }

  return (
    <>
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {mode === "create" ? "Thêm phòng học mới" : "Chỉnh sửa phòng học"}
          </h2>
          <p className="text-slate-500 mt-1">
            Điền thông tin để {mode === "create" ? "thêm" : "cập nhật"} phòng
            học vào hệ thống
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-slate-50 text-slate-500"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-700">
              Mã phòng <span className="text-red-600">*</span>
            </label>
            <input
              value={v.id}
              onChange={(e) => setField("id", e.target.value)}
              placeholder="VD: P201"
              className={[
                "w-full rounded-lg border px-3 py-2 placeholder:text-slate-400",
                err.id
                  ? "border-red-400"
                  : "border-slate-300 focus:ring-2 focus:ring-slate-300",
              ].join(" ")}
              disabled={mode === "edit"} // khóa ID khi sửa
            />
            {err.id && <div className="text-xs text-red-600">{err.id}</div>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-700">
              Tên phòng <span className="text-red-600">*</span>
            </label>
            <input
              value={v.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="VD: Phòng 201"
              className={[
                "w-full rounded-lg border px-3 py-2 placeholder:text-slate-400",
                err.name
                  ? "border-red-400"
                  : "border-slate-300 focus:ring-2 focus:ring-slate-300",
              ].join(" ")}
            />
            {err.name && <div className="text-xs text-red-600">{err.name}</div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-slate-700">
              Sức chứa <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={v.capacity}
              onChange={(e) => setField("capacity", e.target.value)}
              placeholder="30"
              className={[
                "w-full rounded-lg border px-3 py-2 placeholder:text-slate-400",
                err.capacity
                  ? "border-red-400"
                  : "border-slate-300 focus:ring-2 focus:ring-slate-300",
              ].join(" ")}
            />
            {err.capacity && (
              <div className="text-xs text-red-600">{err.capacity}</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-700 block">Trạng thái</label>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
              <Switch
                checked={!!v.active}
                onChange={(val) => setField("active", val)}
              />
              <span className="text-sm">
                {v.active ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting
              ? "Đang lưu…"
              : mode === "create"
              ? "Thêm phòng"
              : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </>
  );
}

/* ===== Page ===== */
export default function ClassroomListPage() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 0);
  const size = Number(sp.get("size") || 10);
  const q = sp.get("q") || "";

  const { data, loading, error, setParams, refresh } = useClassrooms({
    page,
    size,
    q,
  });

  /* Modal states */
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function onSearchSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextQ = (form.get("q") || "").toString().trim();
    setSp({ q: nextQ, page: 0, size });
    setParams({ page: 0, size, q: nextQ });
  }

  function goPage(p) {
    setSp({ q, page: p, size });
    setParams({ page: p, size, q });
  }

  // Ẩn/Hiện phòng – giữ nghiệp vụ cũ
  async function onToggle(id, active) {
    const { classroomService } = await import(
      "../../services/classroom/classroomService"
    );
    try {
      if (active) await classroomService.disable(id);
      else await classroomService.enable(id);
      refresh();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Thao tác thất bại");
    }
  }

  // Tạo phòng – mở modal
  function openCreate() {
    setCreateOpen(true);
  }

  // Sửa phòng – mở modal
  function openEdit(row) {
    setEditing({
      id: row.id,
      name: row.name,
      capacity: row.capacity,
      active: !!row.active,
    });
    setEditOpen(true);
  }

  // Submit create
  async function handleCreate(values) {
    setSubmitting(true);
    try {
      const { classroomService } = await import(
        "../../services/classroom/classroomService"
      );
      await classroomService.create(values);
      setCreateOpen(false);
      refresh();
    } catch (e) {
      alert(e?.response?.data?.message || e?.message || "Không thể tạo phòng");
    } finally {
      setSubmitting(false);
    }
  }

  // Submit edit
  async function handleEdit(values) {
    setSubmitting(true);
    try {
      const { classroomService } = await import(
        "../../services/classroom/classroomService"
      );
      await classroomService.update(values.id, {
        name: values.name,
        capacity: values.capacity,
        active: values.active,
      });
      setEditOpen(false);
      setEditing(null);
      refresh();
    } catch (e) {
      alert(
        e?.response?.data?.message || e?.message || "Không thể lưu thay đổi"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const items = data?.items || [];
  const activeCount = items.filter((r) => r.active).length;
  const inactiveCount = items.length - activeCount;
  const totalSeats = items.reduce((s, r) => s + (r.capacity || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quản lý phòng học
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý thông tin các phòng học và phòng thực hành
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Thêm phòng học
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader
            title="Tổng số phòng"
            right={<DoorOpen className="h-4 w-4 text-blue-600" />}
          />
          <CardBody>
            <div className="text-2xl">{data?.total ?? 0}</div>
            <p className="text-xs text-slate-500 mt-1">Phòng</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Đang hoạt động (trang hiện tại)"
            right={<Activity className="h-4 w-4 text-emerald-600" />}
          />
          <CardBody>
            <div className="text-2xl text-emerald-600">{activeCount}</div>
            <p className="text-xs text-slate-500 mt-1">Phòng</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Không hoạt động (trang hiện tại)"
            right={<Activity className="h-4 w-4 text-rose-600" />}
          />
          <CardBody>
            <div className="text-2xl text-rose-600">{inactiveCount}</div>
            <p className="text-xs text-slate-500 mt-1">Phòng</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader
            title="Tổng sức chứa (trang hiện tại)"
            right={<Users className="h-4 w-4 text-indigo-600" />}
          />
          <CardBody>
            <div className="text-2xl text-indigo-600">{totalSeats}</div>
            <p className="text-xs text-slate-500 mt-1">Học viên</p>
          </CardBody>
        </Card>
      </div>

      {/* List + Search */}
      <Card>
        <CardHeader
          title="Danh sách phòng học"
          right={
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Tìm kiếm phòng học…"
                className="pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300 w-72"
              />
            </form>
          }
        />
        <CardBody className="pt-0">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-3">ID</th>
                  <th className="px-3 py-3">Tên classroom</th>
                  <th className="px-3 py-3">Sức chứa</th>
                  <th className="px-3 py-3">Trạng thái</th>
                  <th className="px-3 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="px-3">
                        <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6">
                      <div className="text-red-600">{error}</div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-10 text-center text-slate-500"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  items.map((r) => (
                    <tr
                      key={r.id}
                      className="bg-white hover:bg-slate-50 rounded-xl"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                            <DoorOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-mono">{r.id}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800">
                        {r.name}
                      </td>
                      <td className="px-3 py-3">{r.capacity}</td>
                      <td className="px-3 py-3">
                        {r.active ? (
                          <Badge color="green">Hoạt động</Badge>
                        ) : (
                          <Badge color="gray">Đã ẩn</Badge>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* mở modal sửa */}
                          <button
                            onClick={() => openEdit(r)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-50"
                            title="Sửa"
                          >
                            <Pencil className="h-4 w-4" /> Sửa
                          </button>
                          {/* Ẩn/Hiện giữ đúng service */}
                          <button
                            className={`inline-flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg border ${
                              r.active
                                ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                                : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            }`}
                            onClick={() => onToggle(r.id, r.active)}
                            title={r.active ? "Ẩn phòng" : "Hiện phòng"}
                          >
                            {r.active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            {r.active ? "Ẩn phòng" : "Hiện phòng"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.total > data.size && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Trang {data.page + 1} • Mỗi trang {data.size} • Tổng{" "}
                {data.total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
                  disabled={data.page <= 0}
                  onClick={() => goPage(data.page - 1)}
                >
                  «
                </button>
                <span className="text-sm">{data.page + 1}</span>
                <button
                  className="px-3 py-2 rounded-lg border border-slate-300 disabled:opacity-50"
                  disabled={(data.page + 1) * data.size >= data.total}
                  onClick={() => goPage(data.page + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ===== CREATE MODAL ===== */}
      <Modal
        open={createOpen}
        onClose={() => !submitting && setCreateOpen(false)}
      >
        <ClassroomForm
          mode="create"
          onCancel={() => !submitting && setCreateOpen(false)}
          onSubmit={handleCreate}
          submitting={submitting}
          initialValue={{ id: "", name: "", capacity: 30, active: true }}
        />
      </Modal>

      {/* ===== EDIT MODAL ===== */}
      <Modal open={editOpen} onClose={() => !submitting && setEditOpen(false)}>
        <ClassroomForm
          mode="edit"
          initialValue={editing || undefined}
          onCancel={() => !submitting && setEditOpen(false)}
          onSubmit={handleEdit}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
}
