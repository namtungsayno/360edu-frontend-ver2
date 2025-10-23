import React, { useEffect, useState } from "react";
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

export default function MyProfilePage() {
  const { user } = useAuth();
  const [f, setF] = useState({ fullName: "", email: "", phone: "" });
  const [ok, setOk] = useState("");

  useEffect(() => {
    (async () => {
      const d = await userService.get(user.id);
      setF({
        fullName: d.fullName || "",
        email: d.email || "",
        phone: d.phone || "",
      });
    })();
  }, [user.id]);

  const submit = async (e) => {
    e.preventDefault();
    await userService.update(user.id, f);
    setOk("Đã lưu");
    setTimeout(() => setOk(""), 1200);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Hồ sơ của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label className="block mb-1">Họ tên</Label>
              <Input
                value={f.fullName}
                onChange={(e) => setF({ ...f, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Email</Label>
              <Input
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Số điện thoại</Label>
              <Input
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
              />
            </div>
            <div className="col-span-full">
              <Button type="submit">Lưu</Button>
              {ok && <span className="ml-3 text-emerald-600">{ok}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
