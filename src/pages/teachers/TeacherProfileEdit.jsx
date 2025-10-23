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
  Textarea,
  Label,
} from "components/common";

export default function TeacherProfileEdit() {
  const { user } = useAuth();
  const [f, setF] = useState({
    bio: "",
    subjects: "",
    yearsExperience: 0,
    avatarUrl: "",
  });
  const [ok, setOk] = useState("");

  useEffect(() => {
    (async () => setF(await userService.getTeacherProfile(user.id)))();
  }, [user.id]);

  const submit = async (e) => {
    e.preventDefault();
    await userService.updateTeacherProfile(user.id, f);
    setOk("Đã cập nhật");
    setTimeout(() => setOk(""), 1200);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sửa hồ sơ giáo viên</CardTitle>
        </CardHeader>

        <CardContent>
          {ok && <div className="text-emerald-600 mb-3">{ok}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className="block mb-1">Bio</Label>
              <Textarea
                rows={3}
                value={f.bio || ""}
                onChange={(e) => setF({ ...f, bio: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Môn (CSV)</Label>
              <Input
                value={f.subjects || ""}
                onChange={(e) => setF({ ...f, subjects: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Số năm</Label>
              <Input
                type="number"
                value={f.yearsExperience || 0}
                onChange={(e) =>
                  setF({ ...f, yearsExperience: +e.target.value })
                }
              />
            </div>
            <div>
              <Label className="block mb-1">Avatar URL</Label>
              <Input
                value={f.avatarUrl || ""}
                onChange={(e) => setF({ ...f, avatarUrl: e.target.value })}
              />
            </div>
            <Button type="submit">Lưu</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
