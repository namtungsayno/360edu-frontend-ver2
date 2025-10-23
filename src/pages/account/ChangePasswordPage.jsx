import React, { useState } from "react";
import { useAuth } from "context/auth/AuthContext";
import { userService } from "services/user/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Label,
} from "components/common";

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
    } catch (ex) {
      setErr(ex.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          {err && <div className="text-rose-600 mb-3">{err}</div>}
          {ok && <div className="text-emerald-600 mb-3">{ok}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="block mb-1">Mật khẩu hiện tại</Label>
              <Input
                type="password"
                value={f.currentPassword}
                onChange={(e) =>
                  setF({ ...f, currentPassword: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="block mb-1">Mật khẩu mới</Label>
              <Input
                type="password"
                value={f.newPassword}
                onChange={(e) => setF({ ...f, newPassword: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Xác nhận mật khẩu mới</Label>
              <Input
                type="password"
                value={f.confirm}
                onChange={(e) => setF({ ...f, confirm: e.target.value })}
              />
            </div>
            <Button type="submit">Cập nhật</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
