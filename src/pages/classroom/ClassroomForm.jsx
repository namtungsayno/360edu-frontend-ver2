// src/pages/classroom/ClassroomForm.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useClassroomForm from "../../hooks/classroom/useClassroomForm";

export default function ClassroomForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isEdit, f, loading, saving, error, onChange, submit } =
    useClassroomForm(id);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await submit();
    if (res.ok) navigate("/classrooms", { replace: true });
  }
  return (
    <section className="section-padding">
      <div className="container" style={{ maxWidth: 640 }}>
        <h2 className="mb-3">{isEdit ? "Sửa Classroom" : "Thêm Classroom"}</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <form className="vstack gap-3" onSubmit={onSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div>
              <label className="form-label">
                Tên classroom <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="name"
                value={f.name}
                onChange={onChange}
                placeholder="VD: 6A1, Physics Lab, ..."
                maxLength={120}
                required
              />
            </div>

            <div>
              <label className="form-label">
                Sức chứa (chỗ) <span className="text-danger">*</span>
              </label>
              <input
                className="form-control"
                name="capacity"
                value={f.capacity}
                onChange={onChange}
                inputMode="numeric"
                placeholder="VD: 30"
                required
              />
              <div className="form-text">
                Chỉ nhập số nguyên dương (≤ 5000).
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                disabled={saving}
                type="submit"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => navigate(-1)}
              >
                Huỷ
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
