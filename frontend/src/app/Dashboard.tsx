import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '../api/students';
import apiClient from '../api/client';

export const Dashboard = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const { data: studentsData } = useQuery({
    queryKey: ['students', { page: 1, pageSize: 5 }],
    queryFn: () => studentsApi.getAll({ page: 1, pageSize: 5 }),
    enabled: user?.role === 'admin' || user?.role === 'academic_admin',
  });

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-indigo-600">{studentsData?.meta.total || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Active Students</h3>
                <p className="text-3xl font-bold text-green-600">
                  {studentsData?.data.filter(s => s.status === 'active').length || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2 mt-2">
                  <button
                    onClick={() => navigate('/students')}
                    className="w-full text-left px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
                  >
                    Manage Students
                  </button>
                  <button
                    onClick={() => navigate('/academics')}
                    className="w-full text-left px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
                  >
                    Manage Classes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'teacher':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
              <p className="text-gray-600">Schedule information will be displayed here</p>
            </div>
          </div>
        );
      case 'student':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Student Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">My Classes</h3>
              <p className="text-gray-600">Class information will be displayed here</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">Welcome to the School Management System</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">SMS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {getDashboardContent()}
        </div>
      </main>
    </div>
  );
};


