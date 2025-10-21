// src/services/subject/subjectService.mock.js
const mockSubjects = [
  {
    id: 1,
    name: "Toán học",
    code: "MATH",
    description: "Môn học toán học từ cơ bản đến nâng cao",
    isActive: true,
    courses: 15,
    classes: 25,
    teachers: 8,
    students: 450,
  },
  {
    id: 2,
    name: "Vật lý",
    code: "PHY",
    description: "Môn học vật lý đại cương và chuyên sâu",
    isActive: true,
    courses: 12,
    classes: 18,
    teachers: 5,
    students: 320,
  },
  {
    id: 3,
    name: "Sinh học",
    code: "BIO",
    description: "Môn học sinh học đại cương",
    isActive: false,
    courses: 6,
    classes: 10,
    teachers: 3,
    students: 180,
  },
];

const subjectService = {
  getAllSubjects: async () => mockSubjects,
  createSubject: async (data) => ({
    id: Date.now(),
    ...data,
    isActive: true,
    courses: 0,
    classes: 0,
    teachers: 0,
    students: 0,
  }),
  updateSubject: async (id, data) => ({
    id,
    ...data,
    isActive: true,
  }),
  toggleSubjectStatus: async (id) => {
    const subject = mockSubjects.find((s) => s.id === id);
    subject.isActive = !subject.isActive;
    return subject;
  },
  deleteSubject: async (id) => true,
};

export default subjectService;
