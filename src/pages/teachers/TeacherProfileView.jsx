import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userService } from "services/user/userService";
import { useAuth } from "context/auth/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "components/common";

export default function TeacherProfileView() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [p, setP] = useState(null);

  useEffect(() => {
    (async () => setP(await userService.getTeacherProfile(userId)))();
  }, [userId]);

  if (!p) return <div className="p-6">Loading…</div>;

  const isSelfTeacher =
    (user?.roles || []).includes("ROLE_TEACHER") &&
    String(user?.id) === String(userId);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Hồ sơ giáo viên</CardTitle>
          {isSelfTeacher && (
            <div className="flex gap-2">
              <Link to="/teacher/me/profile/edit">
                <Button variant="outline">Chỉnh sửa hồ sơ</Button>
              </Link>
              <Link to={`/teachers/${userId}/preview`}>
                <Button variant="outline">Xem như khách</Button>
              </Link>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {p.avatarUrl && (
            <img
              src={p.avatarUrl}
              alt="avatar"
              width={120}
              className="rounded mb-3"
            />
          )}
          <dl className="grid grid-cols-3 gap-2">
            <dt className="text-muted-foreground">Bio</dt>
            <dd className="col-span-2">{p.bio || "-"}</dd>
            <dt className="text-muted-foreground">Môn</dt>
            <dd className="col-span-2">{p.subjects || "-"}</dd>
            <dt className="text-muted-foreground">Kinh nghiệm</dt>
            <dd className="col-span-2">{p.yearsExperience ?? "-"}</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
