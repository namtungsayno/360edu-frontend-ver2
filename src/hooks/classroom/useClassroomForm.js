// src/hooks/classroom/useClassroomForm.js
import { useEffect, useState } from "react";
import { classroomService } from "../../services/classroom/classroomService";

export default function useClassroomForm(id) {
  const isEdit = id && id !== "new";
  const [f, setF] = useState({ name: "", capacity: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await classroomService.getById(id);
        setF({
          name: data.name ?? "",
          capacity: String(data.capacity ?? ""),
          active: data.active ?? data.status === "ACTIVE",
        });
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Tải dữ liệu thất bại"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  function onChange(e) {
    const { name, value } = e.target;
    setF((s) => ({
      ...s,
      [name]: name === "capacity" ? value.replace(/[^0-9]/g, "") : value,
    }));
  }

  function validate() {
    if (!f.name?.trim()) return "Tên classroom không được để trống";
    const cap = Number(f.capacity);
    if (!Number.isInteger(cap) || cap <= 0)
      return "Sức chứa phải là số nguyên dương";
    if (cap > 5000) return "Sức chứa quá lớn (<= 5000)";
    return "";
  }

  async function submit() {
    const v = validate();
    if (v) {
      setError(v);
      return { ok: false };
    }
    setSaving(true);
    setError("");
    try {
      const payload = { name: f.name.trim(), capacity: Number(f.capacity) };
      if (isEdit) await classroomService.update(id, payload);
      else await classroomService.create(payload);
      return { ok: true };
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Lưu thất bại");
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }

  return { isEdit, f, setF, loading, saving, error, onChange, submit };
}
