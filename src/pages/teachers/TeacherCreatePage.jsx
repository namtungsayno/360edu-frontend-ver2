import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function TeacherCreatePage() {
  const nav = useNavigate();
  const [f, setF] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    tempPassword: "",
    profile: { bio: "", subjects: "", yearsExperience: 0, avatarUrl: "" },
  });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const d = await userService.createTeacher(f);
      nav(`/admin/users/${d.id}`);
    } catch (ex) {
      setErr(ex.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tạo giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          {err && <div className="text-rose-600 mb-3">{err}</div>}

          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label className="block mb-1">Username</Label>
              <Input
                value={f.username}
                onChange={(e) => setF({ ...f, username: e.target.value })}
              />
            </div>
            <div>
              <Label className="block mb-1">Mật khẩu tạm</Label>
              <Input
                value={f.tempPassword}
                onChange={(e) => setF({ ...f, tempPassword: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
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
              <Label className="block mb-1">SĐT</Label>
              <Input
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="block mb-1">Bio</Label>
              <Textarea
                rows={3}
                value={f.profile.bio}
                onChange={(e) =>
                  setF({ ...f, profile: { ...f.profile, bio: e.target.value } })
                }
              />
            </div>

            <div>
              <Label className="block mb-1">Môn (CSV)</Label>
              <Input
                value={f.profile.subjects}
                onChange={(e) =>
                  setF({
                    ...f,
                    profile: { ...f.profile, subjects: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label className="block mb-1">Số năm</Label>
              <Input
                type="number"
                value={f.profile.yearsExperience || 0}
                onChange={(e) =>
                  setF({
                    ...f,
                    profile: { ...f.profile, yearsExperience: +e.target.value },
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label className="block mb-1">Avatar URL</Label>
              <Input
                value={f.profile.avatarUrl}
                onChange={(e) =>
                  setF({
                    ...f,
                    profile: { ...f.profile, avatarUrl: e.target.value },
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">Tạo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
