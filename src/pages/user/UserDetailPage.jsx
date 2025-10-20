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

  const load = async () => {
    const d = await userService.get(id);
    setInfo(d);
    setF({
      fullName: d.fullName || "",
      email: d.email || "",
      phone: d.phone || "",
    });
  };
  useEffect(() => {
    load(); /* eslint-disable-next-line */
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
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader
          title={`User #${info.id}`}
          actions={
            isTeacher ? (
              <Link to={`/teachers/${info.id}/profile`}>
                <Button variant="outline">Xem hồ sơ GV</Button>
              </Link>
            ) : null
          }
        />
        <CardBody>
          <p className="text-sm text-zinc-500 mb-4">
            {info.roles?.join(", ")} — {info.enabled ? "Active" : "Disabled"}
          </p>
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
            <div className="col-span-full">
              <Button>Lưu</Button>{" "}
              {ok && <span className="ml-3 text-emerald-600">{ok}</span>}
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
