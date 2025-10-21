import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";

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
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader title="Tạo giáo viên" />
        <CardBody>
          {err && <div className="text-rose-600 mb-3">{err}</div>}
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.username}
                onChange={(e) => setF({ ...f, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mật khẩu tạm</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.tempPassword}
                onChange={(e) => setF({ ...f, tempPassword: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
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
              <label className="block text-sm mb-1">SĐT</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Bio</label>
              <textarea
                rows={3}
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.profile.bio}
                onChange={(e) =>
                  setF({ ...f, profile: { ...f.profile, bio: e.target.value } })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Môn (CSV)</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
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
              <label className="block text-sm mb-1">Số năm</label>
              <input
                type="number"
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
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
              <label className="block text-sm mb-1">Avatar URL</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
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
              <Button>Tạo</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
