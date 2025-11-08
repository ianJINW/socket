import apiClient from './client';

export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  admissionNo: string;
  emails: string[];
  contacts: string[];
  classId?: {
    _id: string;
    name: string;
    gradeLevel: number;
  };
  status: string;
  medical?: {
    notes?: string;
    allergies?: string[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}

export const studentsApi = {
  getAll: async (params?: { page?: number; pageSize?: number; q?: string; classId?: string; status?: string }): Promise<PaginatedResponse<Student>> => {
    const response = await apiClient.get<PaginatedResponse<Student>>('/students', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await apiClient.get<{ data: Student }>(`/students/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Student>): Promise<Student> => {
    const response = await apiClient.post<{ data: Student }>('/students', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Student>): Promise<Student> => {
    const response = await apiClient.patch<{ data: Student }>(`/students/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },
};


