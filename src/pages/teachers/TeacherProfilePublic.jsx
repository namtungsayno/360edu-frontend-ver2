import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userService } from "services/user/userService";
import { Card, CardHeader, CardBody } from "components/ui/Card";

export default function TeacherProfilePublic() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const [p, u] = await Promise.all([
        userService.getTeacherProfile(userId),
        userService.get(userId),
      ]);
      setProfile(p);
      setUser(u);
    })();
  }, [userId]);

  if (!profile || !user) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader title={`Giáo viên: ${user.fullName || user.username}`} />
        <CardBody>
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt="avatar"
              width={140}
              className="rounded mb-4"
            />
          )}
          <div className="space-y-3">
            <div>
              <div className="text-sm text-zinc-500">Giới thiệu</div>
              <div>{profile.bio || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Môn giảng dạy</div>
              <div>{profile.subjects || "—"}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Kinh nghiệm (năm)</div>
              <div>{profile.yearsExperience ?? "—"}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
