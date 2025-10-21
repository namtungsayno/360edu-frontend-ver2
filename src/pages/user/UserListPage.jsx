import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";
import Table from "components/ui/Table";
import { Search } from "lucide-react";

const TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "ROLE_STUDENT", label: "Học viên" },
  { key: "ROLE_TEACHER", label: "Giáo viên" },
  { key: "ROLE_PARENT", label: "Phụ huynh" },
];

export default function UserListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const size = 20;

  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    content: [],
    totalPages: 1,
    totalElements: 0,
  });

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const roleParam = activeTab === "ALL" ? undefined : activeTab;
      const res = await userService.list(q, page, size, roleParam);
      setData(res || { content: [], totalPages: 1, totalElements: 0 });
    } catch (e) {
      setErr(e?.message || "Có lỗi xảy ra");
      setData({ content: [], totalPages: 1, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }

  // đổi trang hoặc đổi tab sẽ gọi API
  useEffect(() => {
    load(); // eslint-disable-next-line
  }, [page, activeTab]);

  const onSearch = () => {
    setPage(0);
    load();
  };

  const toggle = async (u) => {
    if (
      !window.confirm(
        `${u.enabled ? "Vô hiệu hóa" : "Kích hoạt"} ${u.fullName}?`
      )
    )
      return;
    await userService.setEnabled(u.id, !u.enabled);
    load();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">Quản lý người dùng</span>
              <span className="text-sm text-zinc-500">
                • tổng {data.totalElements ?? 0}
              </span>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  className="pl-8 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent w-80"
                  placeholder="Tìm theo email, số điện thoại…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </div>
              <Button onClick={onSearch}>Tìm</Button>
            </div>
          }
        />

        <CardBody>
          {/* Tabs vai trò – lọc server-side */}
          <div className="mb-4 flex items-center gap-2 overflow-x-auto">
            {TABS.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => {
                    setActiveTab(t.key);
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {err && <div className="text-rose-600 mb-3">{err}</div>}

          <Table
            head={[
              "ID",
              "Username",
              "Họ tên",
              "Email",
              "SĐT",
              "Roles",
              "Trạng thái",
              "Thao tác",
            ]}
          >
            {(data.content || []).map((u) => (
              <tr
                key={u.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.username}</td>
                <td className="px-4 py-3">
                  <Link
                    className="text-indigo-600 hover:underline"
                    to={`/admin/users/${u.id}`}
                  >
                    {u.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">{u.roles?.join(", ")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs ${
                      u.enabled
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                    }`}
                  >
                    {u.enabled ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Link to={`/admin/users/${u.id}`}>
                      <Button variant="outline" size="sm">
                        Xem
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggle(u)}
                    >
                      {u.enabled ? "Deactivate" : "Reactivate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && (data.content || []).length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={8}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="subtle"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-zinc-500">
              Trang {page + 1} / {data.totalPages || 1}
            </span>
            <Button
              variant="subtle"
              disabled={page + 1 >= (data.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
