import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";

export default function UserDetailPage() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [f, setF] = useState({ fullName: "", email: "", phone: "" });
  const [ok, setOk] = useState("");

  async function load() {
    const d = await userService.get(id);
    setInfo(d);
    setF({
      fullName: d.fullName || "",
      email: d.email || "",
      phone: d.phone || "",
    });
  }

  useEffect(() => {
    load(); // eslint-disable-next-line
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await userService.update(id, f);
    setOk("Đã lưu");
    setTimeout(() => setOk(""), 1500);
    load();
  };

  if (!info) return <div className="p-6">Loading…</div>;

  const isTeacher = (info.roles || []).includes("ROLE_TEACHER");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Chi tiết người dùng</h1>
          <p className="text-sm text-zinc-500">
            #{info.id} • {info.username} • {(info.roles || []).join(", ")} •{" "}
            {info.enabled ? "Active" : "Disabled"}
          </p>
        </div>

        {isTeacher && (
          <Link to={`/teachers/${info.id}/profile`}>
            <Button variant="outline">Xem hồ sơ GV</Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader title="Thông tin cơ bản" />
        <CardBody>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm mb-1">Họ tên</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.fullName}
                onChange={(e) => setF({ ...f, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Số điện thoại</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
              />
            </div>

            <div className="col-span-full flex items-center gap-3">
              <Button type="submit">Lưu</Button>
              {ok && <span className="text-emerald-600 text-sm">{ok}</span>}
              <span
                className={`ml-auto inline-flex px-2.5 py-1 rounded-full text-xs ${
                  info.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                }`}
              >
                {info.enabled ? "Active" : "Disabled"}
              </span>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Thông tin hệ thống" />
        <CardBody>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-zinc-500 mb-1">Username</div>
              <div className="font-medium">{info.username}</div>
            </div>
            <div>
              <div className="text-zinc-500 mb-1">Roles</div>
              <div className="font-medium">{(info.roles || []).join(", ")}</div>
            </div>
            <div>
              <div className="text-zinc-500 mb-1">ID</div>
              <div className="font-medium">{info.id}</div>
            </div>
            <div>
              <div className="text-zinc-500 mb-1">Trạng thái</div>
              <div className="font-medium">
                {info.enabled ? "Active" : "Disabled"}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
