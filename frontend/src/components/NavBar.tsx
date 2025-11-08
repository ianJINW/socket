import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { appRoutes } from './routes';

const NavBar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearAuth();
    navigate('/login');
  };

  const linkClass = (isActive: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-indigo-700 text-white' : 'text-gray-200 hover:bg-indigo-600 hover:text-white'}`;

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="text-white font-bold text-lg">SMS</div>
            <div className="hidden md:flex items-center space-x-1">
              {appRoutes.map((r) => {
                const visible = r.public || (user && (r.roles === null || (r.roles && r.roles.includes(user.role))));
                if (!visible) return null;
                return (
                  <NavLink key={r.path} to={r.path} className={({ isActive }) => linkClass(isActive)}>
                    {r.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-indigo-100 text-sm">{user.firstName} {user.lastName}</div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-white text-indigo-700 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="px-3 py-1 bg-white text-indigo-700 rounded-md text-sm font-medium hover:bg-gray-100">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
