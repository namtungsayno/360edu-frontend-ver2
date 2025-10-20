import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";
import Table from "components/ui/Table";

export default function TeacherListPage() {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => setData(await userService.listTeachers(page, 20)))();
  }, [page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader
          title="Giáo viên"
          actions={
            <Link to="/admin/teachers/create">
              <Button>Tạo giáo viên</Button>
            </Link>
          }
        />
        <CardBody>
          <Table head={["ID", "Họ tên", "Email", "SĐT", "Trạng thái", ""]}>
            {data.content.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="px-4 py-3">{t.id}</td>
                <td className="px-4 py-3">
                  <Link
                    className="text-indigo-600 hover:underline"
                    to={`/admin/users/${t.id}`}
                  >
                    {t.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3">{t.email}</td>
                <td className="px-4 py-3">{t.phone}</td>
                <td className="px-4 py-3">
                  {t.enabled ? "Active" : "Disabled"}
                </td>
                <td className="px-4 py-3 text-right">
                  {/* NEW: link xem hồ sơ GV cho ADMIN */}
                  <Link to={`/teachers/${t.id}/profile`}>
                    <Button variant="outline">Xem hồ sơ GV</Button>
                  </Link>
                </td>
              </tr>
            ))}
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
