// src/pages/user/UserDetailPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userService } from "services/user/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "components/common";
import { Badge } from "components/common/badge";
import { Switch } from "components/common/switch";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Award,
  Edit,
} from "lucide-react";

function roleFromBackend(roles = []) {
  if (roles.includes("ROLE_TEACHER")) return "Teacher";
  if (roles.includes("ROLE_PARENT")) return "Parent";
  if (roles.includes("ROLE_STUDENT")) return "Student";
  return "User";
}

function getRoleBadgeColor(role) {
  switch (role) {
    case "Teacher":
      return "bg-green-100 text-green-800";
    case "Student":
      return "bg-blue-100 text-blue-800";
    case "Parent":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const userFromState = state?.user || null;

  const [user, setUser] = useState(userFromState);
  const [loading, setLoading] = useState(!userFromState);
  const [error, setError] = useState("");

  // Fallback fetch nếu vào thẳng URL
  useEffect(() => {
    if (userFromState) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const d = await userService.get(id);
        if (!mounted) return;
        const mapped = {
          id: d.id,
          name: d.fullName || d.username || "User",
          email: d.email || "",
          phone: d.phone || "",
          role: roleFromBackend(d.roles || []),
          status: d.enabled ? "active" : "inactive",
          // các field “Figma” không có từ BE thì để trống/giả lập
          address: "",
          dateOfBirth: "",
          grade: "", // Student
          parentName: "",
          parentPhone: "",
          parentEmail: "",
          subjects: [], // Teacher
          qualification: "",
          experience: "",
          studentName: "",
          studentGrade: "",
        };
        setUser(mapped);
      } catch (e) {
        setError(e?.message || "Không tải được dữ liệu người dùng");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, userFromState]);

  const role = useMemo(() => user?.role || "User", [user]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error)
    return (
      <div className="p-6">
        <div className="mb-4 text-rose-600">{error}</div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  if (!user)
    return (
      <div className="p-6">
        Không có dữ liệu người dùng.
        <div className="mt-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );

  // ======================== Student Profile ========================
  const StudentProfile = ({ u }) => (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-black">Thông tin học viên</h1>
          <p className="text-sm text-gray-600 mt-1">
            Chi tiết thông tin cá nhân và học tập
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-600">
                  {u.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl mb-1 text-black">{u.name}</h2>
                  <Badge className={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <InfoLine
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  label="Email"
                  value={u.email}
                />
                <InfoLine
                  icon={<Phone className="h-4 w-4 text-slate-400" />}
                  label="Số điện thoại"
                  value={u.phone}
                />
                <InfoLine
                  icon={<Calendar className="h-4 w-4 text-slate-400" />}
                  label="Ngày sinh"
                  value={u.dateOfBirth || "—"}
                />
                <InfoLine
                  icon={<Award className="h-4 w-4 text-slate-400" />}
                  label="Khối"
                  value={u.grade || "—"}
                />
                <InfoLine
                  icon={<MapPin className="h-4 w-4 text-slate-400" />}
                  label="Địa chỉ"
                  value={u.address || "—"}
                  full
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin phụ huynh
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <SimpleKV label="Họ tên" value={u.parentName || "—"} />
                <SimpleKV label="Số điện thoại" value={u.parentPhone || "—"} />
                <div className="col-span-2">
                  <SimpleKV label="Email" value={u.parentEmail || "—"} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <SideStats status={u.status} />
      </div>
    </div>
  );

  // ======================== Teacher Profile ========================
  const TeacherProfile = ({ u }) => (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-black">Thông tin giáo viên</h1>
          <p className="text-sm text-gray-600 mt-1">
            Chi tiết thông tin cá nhân và giảng dạy
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-3xl text-green-600">
                  {u.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl mb-1 text-black">{u.name}</h2>
                  <Badge className={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <InfoLine
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  label="Email"
                  value={u.email}
                />
                <InfoLine
                  icon={<Phone className="h-4 w-4 text-slate-400" />}
                  label="Số điện thoại"
                  value={u.phone}
                />
                <InfoLine
                  icon={<Calendar className="h-4 w-4 text-slate-400" />}
                  label="Ngày sinh"
                  value={u.dateOfBirth || "—"}
                />
                <InfoLine
                  icon={<MapPin className="h-4 w-4 text-slate-400" />}
                  label="Địa chỉ"
                  value={u.address || "—"}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin giảng dạy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1">
                <p className="text-sm text-slate-600">Môn giảng dạy</p>
                <div className="flex gap-2 flex-wrap">
                  {(u.subjects || []).length > 0
                    ? u.subjects.map((s, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <BookOpen className="h-3 w-3" />
                          {s}
                        </Badge>
                      ))
                    : "—"}
                </div>
              </div>
              <SimpleKV
                label="Trình độ chuyên môn"
                value={u.qualification || "—"}
              />
              <SimpleKV label="Kinh nghiệm" value={u.experience || "—"} />
            </CardContent>
          </Card>
        </div>

        <SideStats status={u.status} />
      </div>
    </div>
  );

  // ======================== Parent Profile ========================
  const ParentProfile = ({ u }) => (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-black">Thông tin phụ huynh</h1>
          <p className="text-sm text-gray-600 mt-1">
            Chi tiết thông tin phụ huynh và học viên
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-3xl text-purple-600">
                  {u.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl mb-1 text-black">{u.name}</h2>
                  <Badge className={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <InfoLine
                  icon={<Mail className="h-4 w-4 text-slate-400" />}
                  label="Email"
                  value={u.email}
                />
                <InfoLine
                  icon={<Phone className="h-4 w-4 text-slate-400" />}
                  label="Số điện thoại"
                  value={u.phone}
                />
                <InfoLine
                  icon={<MapPin className="h-4 w-4 text-slate-400" />}
                  label="Địa chỉ"
                  value={u.address || "—"}
                  full
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <CardTitle className="text-lg font-semibold text-black">
                Thông tin học viên
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <SimpleKV label="Tên học viên" value={u.studentName || "—"} />
                <SimpleKV label="Khối" value={u.studentGrade || "—"} />
              </div>
            </CardContent>
          </Card>
        </div>

        <SideStats status={u.status} />
      </div>
    </div>
  );

  // ======================== helpers ========================
  function InfoLine({ icon, label, value, full = false }) {
    return (
      <div className={`space-y-1 ${full ? "col-span-2" : ""}`}>
        <p className="text-sm text-slate-600">{label}</p>
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-medium text-gray-900">{value || "—"}</p>
        </div>
      </div>
    );
  }

  function SimpleKV({ label, value }) {
    return (
      <div className="space-y-1">
        <p className="text-sm text-slate-600">{label}</p>
        <p className="font-medium text-gray-900">{value || "—"}</p>
      </div>
    );
  }

  function SideStats({ status }) {
    return (
      <div className="space-y-6">
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Switch checked={status === "active"} readOnly />
              <span className="text-sm font-medium">
                {status === "active" ? "Đang hoạt động" : "Đã vô hiệu hóa"}
              </span>
            </div>
            <Button className="w-full" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa thông tin
            </Button>
          </CardContent>
        </Card>

        {/* Mini stats “đẹp UI” — số liệu giả định */}
        <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Lớp học</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Học viên</span>
              <span className="font-medium">—</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Điểm danh</span>
              <span className="font-medium">—</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ======================== render theo role ========================
  if (role === "Student") return <StudentProfile u={user} />;
  if (role === "Teacher") return <TeacherProfile u={user} />;
  if (role === "Parent") return <ParentProfile u={user} />;

  // fallback role “User” → xài layout student cho gọn
  return <StudentProfile u={user} />;
}
