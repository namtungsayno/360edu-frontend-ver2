import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import useClassrooms from "../../hooks/classroom/useClassrooms";

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

  // ✅ Ẩn/Hiện phòng (thay cho Xoá)
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

  return (
    <section className="section-padding">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="m-0">Classrooms</h2>
          <Link className="btn btn-primary" to="/classrooms/new">
            + Thêm Classroom
          </Link>
        </div>

        <form className="row g-2 mb-3" onSubmit={onSearchSubmit}>
          <div className="col-auto">
            <input
              name="q"
              defaultValue={q}
              className="form-control"
              placeholder="Tìm theo tên..."
            />
          </div>
          <div className="col-auto">
            <button className="btn btn-outline-secondary" type="submit">
              Tìm
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th style={{ width: 120 }}>ID</th>
                <th>Tên classroom</th>
                <th style={{ width: 140 }}>Sức chứa</th>
                <th style={{ width: 140 }}>Trạng thái</th> {/* NEW */}
                <th style={{ width: 220 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Đang tải...</td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={5}>Không có dữ liệu</td>
                </tr>
              ) : (
                data.items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.capacity}</td>
                    <td>
                      {r.active ? (
                        <span className="badge text-bg-success">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="badge text-bg-secondary">Đã ẩn</span>
                      )}
                    </td>
                    <td className="text-end">
                      <Link
                        className="btn btn-sm btn-outline-primary me-2"
                        to={`/classrooms/${r.id}/edit`}
                      >
                        Sửa
                      </Link>

                      {/* NEW: nút Ẩn/Hiện thay cho Xoá */}
                      <button
                        className={`btn btn-sm ${
                          r.active
                            ? "btn-outline-warning"
                            : "btn-outline-success"
                        }`}
                        onClick={() => onToggle(r.id, r.active)}
                      >
                        {r.active ? "Ẩn phòng" : "Hiện phòng"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data.total > data.size && (
          <nav>
            <ul className="pagination">
              <li className={`page-item ${data.page <= 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => goPage(data.page - 1)}
                >
                  «
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">Trang {data.page + 1}</span>
              </li>
              <li
                className={`page-item ${
                  (data.page + 1) * data.size >= data.total ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goPage(data.page + 1)}
                >
                  »
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
