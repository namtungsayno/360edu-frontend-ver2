import React, { useEffect, useMemo, useState } from "react";
import { userService } from "services/user/userService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "components/common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/common/dialog";
import { Search, UserPlus, Edit } from "lucide-react";

// ---------------- Utils ----------------
function getDisplayRole(u) {
  const roles = (u.roles || []).map((r) => String(r).toUpperCase());
  if (roles.includes("TEACHER")) return "Teacher";
  if (roles.includes("STUDENT")) return "Student";
  if (roles.includes("PARENT")) return "Parent";
  if (roles.includes("ADMIN")) return "Admin";
  return roles[0] ? roles[0][0] + roles[0].slice(1).toLowerCase() : "User";
}
function roleBadgeClass(role) {
  switch (role) {
    case "Teacher":
      return "bg-green-100 text-green-800";
    case "Student":
      return "bg-blue-100 text-blue-800";
    case "Parent":
      return "bg-purple-100 text-purple-800";
    case "Admin":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}
const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "students", label: "Học viên" },
  { key: "teachers", label: "Giáo viên" },
  { key: "parents", label: "Phụ huynh" },
];

// --------------- Page -------------------
export default function UserListPage() {
  // query & paging
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const size = 20;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [data, setData] = useState({
    content: [],
    totalPages: 1,
    totalElements: 0,
  });
  const [activeTab, setActiveTab] = useState("all");

  // Dialog states
  const [openAddStudent, setOpenAddStudent] = useState(false);
  const [openAddTeacher, setOpenAddTeacher] = useState(false);

  // Add Student form
  const [stFullName, setStFullName] = useState("");
  const [stEmail, setStEmail] = useState("");
  const [stPhone, setStPhone] = useState("");
  const [stGrade, setStGrade] = useState("");
  const [stParentName, setStParentName] = useState("");
  const [stParentPhone, setStParentPhone] = useState("");
  const [creatingStudent, setCreatingStudent] = useState(false);

  // Add Teacher form
  const [tFullName, setTFullName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPhone, setTPhone] = useState("");
  const [tSubject, setTSubject] = useState("");
  const [tQualification, setTQualification] = useState("");
  const [tExperience, setTExperience] = useState("");
  const [creatingTeacher, setCreatingTeacher] = useState(false);

  // ---------- Load list (REAL) ----------
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await userService.list(q, page, size, undefined);
      setData(res || { content: [], totalPages: 1, totalElements: 0 });
    } catch (e) {
      setErr(e?.message || "Có lỗi xảy ra");
      setData({ content: [], totalPages: 1, totalElements: 0 });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(); // eslint-disable-next-line
  }, [page]);

  const onSearch = () => {
    setPage(0);
    load();
  };

  // ---------- Actions ----------
  const toggleEnabled = async (u) => {
    try {
      await userService.setEnabled(u.id, !u.enabled);
      load();
    } catch (e) {
      setErr(e?.message || "Không thể cập nhật trạng thái");
    }
  };

  const saveStudent = async () => {
    if (!stFullName || !stEmail || !stPhone) return;
    setCreatingStudent(true);
    setErr("");
    try {
      // Ưu tiên API chuyên biệt nếu có, fallback sang create chung
      if (typeof userService.createStudent === "function") {
        await userService.createStudent({
          fullName: stFullName,
          email: stEmail,
          phone: stPhone,
          grade: stGrade || null,
          parentName: stParentName || null,
          parentPhone: stParentPhone || null,
        });
      } else if (typeof userService.create === "function") {
        await userService.create({
          fullName: stFullName,
          email: stEmail,
          phone: stPhone,
          grade: stGrade || null,
          parentName: stParentName || null,
          parentPhone: stParentPhone || null,
          roles: ["STUDENT"],
        });
      } else {
        throw new Error("Chưa có API tạo học viên (createStudent/create).");
      }
      // reset + close + reload + switch tab
      setStFullName("");
      setStEmail("");
      setStPhone("");
      setStGrade("");
      setStParentName("");
      setStParentPhone("");
      setOpenAddStudent(false);
      setActiveTab("students");
      setPage(0);
      await load();
    } catch (e) {
      setErr(e?.message || "Tạo học viên thất bại");
    } finally {
      setCreatingStudent(false);
    }
  };

  const saveTeacher = async () => {
    if (!tFullName || !tEmail || !tPhone || !tSubject) return;
    setCreatingTeacher(true);
    setErr("");
    try {
      if (typeof userService.createTeacher === "function") {
        await userService.createTeacher({
          fullName: tFullName,
          email: tEmail,
          phone: tPhone,
          subject: tSubject,
          qualification: tQualification || null,
          experience: tExperience || null,
        });
      } else if (typeof userService.create === "function") {
        await userService.create({
          fullName: tFullName,
          email: tEmail,
          phone: tPhone,
          subject: tSubject,
          qualification: tQualification || null,
          experience: tExperience || null,
          roles: ["TEACHER"],
        });
      } else {
        throw new Error("Chưa có API tạo giáo viên (createTeacher/create).");
      }
      setTFullName("");
      setTEmail("");
      setTPhone("");
      setTSubject("");
      setTQualification("");
      setTExperience("");
      setOpenAddTeacher(false);
      setActiveTab("teachers");
      setPage(0);
      await load();
    } catch (e) {
      setErr(e?.message || "Tạo giáo viên thất bại");
    } finally {
      setCreatingTeacher(false);
    }
  };

  // ---------- Derived for tabs ----------
  const withRole = useMemo(
    () =>
      (data.content || []).map((u) => ({
        ...u,
        _roleDisplay: getDisplayRole(u),
      })),
    [data.content]
  );

  const tabCounts = useMemo(() => {
    const c = { all: withRole.length, students: 0, teachers: 0, parents: 0 };
    withRole.forEach((u) => {
      if (u._roleDisplay === "Student") c.students++;
      else if (u._roleDisplay === "Teacher") c.teachers++;
      else if (u._roleDisplay === "Parent") c.parents++;
    });
    return c;
  }, [withRole]);

  const filtered = useMemo(() => {
    if (activeTab === "students")
      return withRole.filter((u) => u._roleDisplay === "Student");
    if (activeTab === "teachers")
      return withRole.filter((u) => u._roleDisplay === "Teacher");
    if (activeTab === "parents")
      return withRole.filter((u) => u._roleDisplay === "Parent");
    return withRole;
  }, [withRole, activeTab]);

  // ---------- Render ----------
  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Quản lý thông tin người dùng, giáo viên và phụ huynh • tổng{" "}
            {data.totalElements ?? 0}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Add Student (Dialog) */}
          <Dialog open={openAddStudent} onOpenChange={setOpenAddStudent}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-4 rounded-full border-gray-300 hover:bg-gray-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm học viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm học viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để thêm học viên vào hệ thống
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm">Họ và tên *</label>
                  <Input
                    value={stFullName}
                    onChange={(e) => setStFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Email *</label>
                  <Input
                    value={stEmail}
                    onChange={(e) => setStEmail(e.target.value)}
                    type="email"
                    placeholder="student@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Số điện thoại *</label>
                  <Input
                    value={stPhone}
                    onChange={(e) => setStPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Khối</label>
                  <select
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                    value={stGrade}
                    onChange={(e) => setStGrade(e.target.value)}
                  >
                    <option value="">Chọn khối</option>
                    <option value="G9">Lớp 9</option>
                    <option value="G10">Lớp 10</option>
                    <option value="G11">Lớp 11</option>
                    <option value="G12">Lớp 12</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Tên phụ huynh</label>
                  <Input
                    value={stParentName}
                    onChange={(e) => setStParentName(e.target.value)}
                    placeholder="Họ tên phụ huynh"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">SĐT phụ huynh</label>
                  <Input
                    value={stParentPhone}
                    onChange={(e) => setStParentPhone(e.target.value)}
                    placeholder="0912345678"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenAddStudent(false)}
                >
                  Hủy
                </Button>
                <Button onClick={saveStudent} disabled={creatingStudent}>
                  {creatingStudent ? "Đang lưu..." : "Thêm học viên"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Teacher (Dialog) */}
          <Dialog open={openAddTeacher} onOpenChange={setOpenAddTeacher}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white px-5 rounded-full shadow-lg hover:shadow-xl">
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm giáo viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm giáo viên mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin để thêm giáo viên vào hệ thống
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <label className="text-sm">Họ và tên *</label>
                  <Input
                    value={tFullName}
                    onChange={(e) => setTFullName(e.target.value)}
                    placeholder="Nguyễn Văn B"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Email *</label>
                  <Input
                    value={tEmail}
                    onChange={(e) => setTEmail(e.target.value)}
                    type="email"
                    placeholder="teacher@360edu.vn"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Số điện thoại *</label>
                  <Input
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Môn giảng dạy *</label>
                  <select
                    className="w-full h-10 rounded-md border border-gray-300 px-3"
                    value={tSubject}
                    onChange={(e) => setTSubject(e.target.value)}
                  >
                    <option value="">Chọn môn học</option>
                    <option value="Toán">Toán học</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Lập trình">Lập trình</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm">Trình độ chuyên môn</label>
                  <Input
                    value={tQualification}
                    onChange={(e) => setTQualification(e.target.value)}
                    placeholder="VD: Thạc sĩ Toán học, ĐH KHTN"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm">Kinh nghiệm giảng dạy</label>
                  <Input
                    value={tExperience}
                    onChange={(e) => setTExperience(e.target.value)}
                    placeholder="VD: 5 năm kinh nghiệm"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenAddTeacher(false)}
                >
                  Hủy
                </Button>
                <Button onClick={saveTeacher} disabled={creatingTeacher}>
                  {creatingTeacher ? "Đang lưu..." : "Thêm giáo viên"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Danh sách người dùng
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm theo tên, email, SĐT…"
                  className="pl-10 w-96 border border-gray-300 focus:border-gray-400 focus:ring-0 rounded-md"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
              </div>
              <Button variant="outline" onClick={onSearch}>
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* Segmented tabs */}
          <div className="mt-4 inline-flex rounded-full bg-gray-100 p-1">
            {TABS.map((t) => {
              const isActive = activeTab === t.key;
              const cnt =
                t.key === "all"
                  ? data.totalElements ?? 0
                  : t.key === "students"
                  ? withRole.filter((u) => u._roleDisplay === "Student").length
                  : t.key === "teachers"
                  ? withRole.filter((u) => u._roleDisplay === "Teacher").length
                  : withRole.filter((u) => u._roleDisplay === "Parent").length;

              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={[
                    "px-4 py-1.5 text-sm rounded-full transition-all",
                    isActive
                      ? "bg-white shadow-sm text-black"
                      : "text-gray-600 hover:text-black",
                  ].join(" ")}
                >
                  {t.label} ({cnt})
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {err && (
            <div className="px-6 py-3 text-sm text-red-600 border-b border-red-200 bg-red-50">
              {err}
            </div>
          )}

          {loading ? (
            <p className="text-center text-black py-10">Đang tải...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-black py-10">Không có người dùng</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left w-16">
                        ID
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">
                        Họ tên
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">
                        SĐT
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">
                        Vai trò
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center py-3 px-4 w-24">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow
                        key={u.id}
                        className="hover:bg-gray-50 border-b border-gray-200"
                      >
                        <TableCell className="py-3 px-4">{u.id}</TableCell>
                        <TableCell className="py-3 px-4 font-medium text-gray-900">
                          {u.fullName || u.name || u.username}
                        </TableCell>
                        <TableCell className="py-3 px-4">{u.email}</TableCell>
                        <TableCell className="py-3 px-4">{u.phone}</TableCell>
                        <TableCell className="py-3 px-4">
                          <span
                            className={
                              "inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full " +
                              roleBadgeClass(u._roleDisplay)
                            }
                            title={(u.roles || []).join(", ")}
                          >
                            {u._roleDisplay}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleEnabled(u)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                                u.enabled ? "bg-green-500" : "bg-gray-300"
                              }`}
                              title={
                                u.enabled
                                  ? "Nhấn để vô hiệu hóa"
                                  : "Nhấn để kích hoạt"
                              }
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                                  u.enabled ? "translate-x-5" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm text-gray-700">
                              {u.enabled ? "Hiển thị" : "Ẩn"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-black hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full"
                            title="Sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(0, p - 1))}
                          className={
                            page === 0 ? "opacity-50 pointer-events-none" : ""
                          }
                        />
                      </PaginationItem>
                      {[...Array(data.totalPages || 1)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setPage(i)}
                            isActive={page === i}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setPage((p) =>
                              Math.min((data.totalPages || 1) - 1, p + 1)
                            )
                          }
                          className={
                            page + 1 >= (data.totalPages || 1)
                              ? "opacity-50 pointer-events-none"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
