// src/pages/subject/SubjectManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Switch,
  Label,
  Textarea,
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


import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Users,
  GraduationCap,
  AlertCircle,
  Book,
  User,
} from "lucide-react";

// ⚠️ Hiện dùng mock API — đổi lại khi backend sẵn sàng
import subjectService from "../../services/subject/subjectService.mock";

export default function SubjectManagement() {
  // --- STATE ---
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);

  // Dialog & Form
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // --- FETCH DATA ---
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách môn học");
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD ---
  const validateForm = () => {
    const errors = {};
    if (!formData.subjectName.trim()) errors.subjectName = "Tên môn học không được để trống";
    if (!formData.subjectCode.trim()) errors.subjectCode = "Mã môn học không được để trống";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const newSubject = await subjectService.createSubject({
        name: formData.subjectName,
        code: formData.subjectCode,
        description: formData.description,
      });
      setSubjects([newSubject, ...subjects]);
      setIsCreateOpen(false);
      setFormData({ subjectName: "", subjectCode: "", description: "" });
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const updated = await subjectService.updateSubject(selectedSubject.id, {
        name: formData.subjectName,
        code: formData.subjectCode,
        description: formData.description,
      });
      setSubjects(subjects.map((s) => (s.id === selectedSubject.id ? updated : s)));
      setIsEditOpen(false);
      setSelectedSubject(null);
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const updated = await subjectService.toggleSubjectStatus(id);
    setSubjects(subjects.map((s) => (s.id === id ? updated : s)));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa môn học này?")) return;
    await subjectService.deleteSubject(id);
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  // --- FILTER + PAGINATION ---
  const filtered = subjects.filter((s) =>
    [s.name, s.code, s.description].some((f) =>
      f?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubjects = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // --- FORM CHANGE ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const openEditDialog = (subject) => {
    setSelectedSubject(subject);
    setFormData({
      subjectName: subject.name,
      subjectCode: subject.code,
      description: subject.description || "",
    });
    setIsEditOpen(true);
  };

  // --- RENDER ---
  return (
    <div className="p-6 space-y-6 bg-white text-black min-h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black mb-1">Quản lý môn học</h1>
              <p className="text-sm text-gray-600">Quản lý thông tin các môn học trong hệ thống</p>
            </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Plus className="h-4 w-4 mr-2" /> Thêm môn học
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm môn học mới</DialogTitle>
              <DialogDescription>Điền thông tin để thêm môn học vào hệ thống</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subjectName">Tên môn học *</Label>
                  <Input
                    id="subjectName"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleFormChange}
                    placeholder="VD: Toán học"
                    className={formErrors.subjectName ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCode">Mã môn học *</Label>
                  <Input
                    id="subjectCode"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleFormChange}
                    placeholder="VD: MATH"
                    className={formErrors.subjectCode ? "border-red-500" : ""}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Mô tả về môn học..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
                className="bg-white hover:bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-lg"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white border-2 border-black px-4 py-2 rounded-lg"
              >
                {loading ? "Đang tạo..." : "Thêm môn học"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

          {/* TABLE */}
          <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-black">Danh sách môn học</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm môn học..."
                    className="pl-10 w-80 border border-gray-300 focus:border-gray-400 focus:ring-0 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <p className="text-center text-black py-10">Đang tải...</p>
              ) : paginatedSubjects.length === 0 ? (
                <p className="text-center text-black py-10">Không có môn học nào</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Mã môn học</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Tên môn học</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Khóa học</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Lớp học</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Giáo viên</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Học viên</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Mô tả</TableHead>
                          <TableHead className="font-semibold text-gray-700 py-3 px-4 text-left">Trạng thái</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center py-3 px-4">Sửa</TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center py-3 px-4">Xóa</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedSubjects.map((subject) => (
                          <TableRow key={subject.id} className="hover:bg-gray-50 border-b border-gray-200">
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                                  <BookOpen className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-mono font-medium text-gray-900">{subject.code}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-medium text-gray-900">{subject.name}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{subject.courses || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{subject.classes || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{subject.teachers || 0}</span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="text-blue-600 font-semibold">{subject.students || 0}</span>
                            </TableCell>
                            <TableCell className="py-3 px-4 max-w-xs text-sm text-gray-600">
                              {subject.description}
                            </TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleStatus(subject.id)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                                    subject.isActive ? 'bg-green-500' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                                      subject.isActive ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className="text-sm text-gray-700">
                                  {subject.isActive ? "Hiển thị" : "Ẩn"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => openEditDialog(subject)}
                                className="text-black hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-black hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full"
                                onClick={() => handleDelete(subject.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                </Table>
              </div>

                  {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                              <PaginationLink
                                onClick={() => setCurrentPage(i + 1)}
                                isActive={currentPage === i + 1}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                              className={
                                currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
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

          {/* MINI DASHBOARD */}
          <div className="grid gap-4 md:grid-cols-4 mt-6">
            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng môn học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{subjects.length}</div>
                <p className="text-xs text-gray-500 mt-1">Môn học</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((sum, s) => sum + (s.courses || 0), 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Khóa học</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng lớp học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((sum, s) => sum + (s.classes || 0), 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Lớp học</p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tổng học viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.reduce((sum, s) => sum + (s.students || 0), 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Học viên</p>
              </CardContent>
            </Card>
          </div>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa môn học</DialogTitle>
            <DialogDescription>Cập nhật thông tin môn học</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editSubjectName">Tên môn học *</Label>
                <Input
                  id="editSubjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleFormChange}
                  placeholder="VD: Toán học"
                />
              </div>
              <div>
                <Label htmlFor="editSubjectCode">Mã môn học *</Label>
                <Input
                  id="editSubjectCode"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleFormChange}
                  placeholder="VD: MATH"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editSubjectDescription">Mô tả</Label>
              <Textarea
                id="editSubjectDescription"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                placeholder="Mô tả về môn học..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="bg-white hover:bg-gray-100 text-black border-2 border-black px-4 py-2 rounded-lg"
            >
              Hủy
            </Button>

            <Button
              onClick={handleEditSave}
              disabled={loading || !selectedSubject}
              className="bg-black hover:bg-gray-800 text-white border-2 border-black px-4 py-2 rounded-lg"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
