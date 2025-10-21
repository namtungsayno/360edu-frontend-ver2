import React, { useEffect, useState } from "react";
import { useAuth } from "context/auth/AuthContext";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";
import Button from "components/ui/Button";

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
        <CardHeader title="Sửa hồ sơ giáo viên" />
        <CardBody>
          {ok && <div className="text-emerald-600 mb-3">{ok}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Bio</label>
              <textarea
                rows={3}
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.bio || ""}
                onChange={(e) => setF({ ...f, bio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Môn (CSV)</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.subjects || ""}
                onChange={(e) => setF({ ...f, subjects: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Số năm</label>
              <input
                type="number"
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.yearsExperience || 0}
                onChange={(e) =>
                  setF({ ...f, yearsExperience: +e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Avatar URL</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-transparent border-zinc-300 dark:border-zinc-700"
                value={f.avatarUrl || ""}
                onChange={(e) => setF({ ...f, avatarUrl: e.target.value })}
              />
            </div>
            <Button>Lưu</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
