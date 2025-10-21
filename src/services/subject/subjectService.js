import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const subjectService = {
  getAllSubjects: async () => {
    const response = await axios.get(`${API_URL}/subjects`, {
      withCredentials: true,
    });
    return response.data;
  },

  createSubject: async (data) => {
    const response = await axios.post(`${API_URL}/subjects`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  updateSubject: async (id, data) => {
    const response = await axios.put(`${API_URL}/subjects/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  toggleSubjectStatus: async (id) => {
    const response = await axios.patch(
      `${API_URL}/subjects/${id}/toggle-status`,
      {},
      { withCredentials: true }
    );
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await axios.delete(`${API_URL}/subjects/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};

export default subjectService;