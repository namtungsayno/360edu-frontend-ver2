import React, { useState } from "react";
import { useAuth } from "context/auth/AuthContext";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [f, setF] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    if (f.newPassword !== f.confirm) {
      setErr("Xác nhận mật khẩu không khớp");
      return;
    }
    try {
      await userService.changePassword(user.id, {
        currentPassword: f.currentPassword,
        newPassword: f.newPassword,
      });
      setOk("Đổi mật khẩu thành công");
      setF({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader title="Đổi mật khẩu" />
        <CardBody>
          {err && <div className="text-rose-600 mb-3">{err}</div>}
          {ok && <div className="text-emerald-600 mb-3">{ok}</div>}
          <form onSubmit={submit} className="space-y-4">
            {["currentPassword", "newPassword", "confirm"].map((k) => (
              <div key={k}>
                <label className="block text-sm mb-1">
                  {k === "currentPassword"
                    ? "Mật khẩu hiện tại"
                    : k === "newPassword"
                    ? "Mật khẩu mới"
                    : "Xác nhận mật khẩu mới"}
                </label>
                <input
                  type="password"
                  className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 bg-transparent"
                  value={f[k]}
                  onChange={(e) => setF({ ...f, [k]: e.target.value })}
                />
              </div>
            ))}
            <Button>Cập nhật</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
