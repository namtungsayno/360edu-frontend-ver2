import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";
import Table from "components/ui/Table";

export default function UserListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({ content: [], totalPages: 0 });

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      setData(await userService.list(q, page, 20));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [page]);

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
          title="Người dùng"
          actions={
            <div className="flex gap-2">
              <input
                className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent"
                placeholder="Tìm email hoặc SĐT"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button
                onClick={() => {
                  setPage(0);
                  load();
                }}
              >
                Tìm
              </Button>
            </div>
          }
        />
        <CardBody>
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
              "",
            ]}
          >
            {data.content.map((u) => (
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
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" onClick={() => toggle(u)}>
                    {u.enabled ? "Deactivate" : "Reactivate"}
                  </Button>
                </td>
              </tr>
            ))}
            {!loading && data.content.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={8}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </Table>
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
              disabled={page + 1 >= data.totalPages}
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
