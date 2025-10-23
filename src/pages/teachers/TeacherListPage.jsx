import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "services/user/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "components/common";

export default function TeacherListPage() {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => setData(await userService.listTeachers(page, 20)))();
  }, [page]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Giáo viên</CardTitle>
          <Link to="/admin/teachers/create">
            <Button>Tạo giáo viên</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Họ tên</TH>
                <TH>Email</TH>
                <TH>SĐT</TH>
                <TH>Trạng thái</TH>
                <TH className="text-right"> </TH>
              </TR>
            </THead>
            <TBody>
              {data.content.map((t) => (
                <TR key={t.id}>
                  <TD>{t.id}</TD>
                  <TD>
                    <Link
                      className="text-indigo-600 hover:underline"
                      to={`/admin/users/${t.id}`}
                    >
                      {t.fullName}
                    </Link>
                  </TD>
                  <TD>{t.email}</TD>
                  <TD>{t.phone}</TD>
                  <TD>{t.enabled ? "Active" : "Disabled"}</TD>
                  <TD className="text-right">
                    <Link to={`/teachers/${t.id}/profile`}>
                      <Button variant="outline">Xem hồ sơ GV</Button>
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {page + 1} / {data.totalPages || 1}
            </span>
            <Button
              variant="outline"
              disabled={page + 1 >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
