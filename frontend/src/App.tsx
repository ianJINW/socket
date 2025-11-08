import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './app/Login';
import { Dashboard } from './app/Dashboard';
import { Students } from './app/Students';
import Academics from './app/Academics';
import Exams from './app/Exams';
import Finance from './app/Finance';
import About from './app/About';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { appRoutes } from './components/routes';

function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <NavBar />}

      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />

          {appRoutes.map((r) => {
            // map path to component
            const componentMap: Record<string, JSX.Element> = {
              '/dashboard': <Dashboard />,
              '/students': <Students />,
              '/academics': <Academics />,
              '/exams': <Exams />,
              '/finance': <Finance />,
              '/about': <About />,
            };

            const element = componentMap[r.path] || <Navigate to="/dashboard" replace />;

            if (r.public) {
              return <Route key={r.path} path={r.path} element={element} />;
            }

            // protected routes
            if (r.roles === null) {
              return (
                <Route
                  key={r.path}
                  path={r.path}
                  element={<ProtectedRoute>{element}</ProtectedRoute>}
                />
              );
            }

            // role restricted
            return (
              <Route
                key={r.path}
                path={r.path}
                element={<ProtectedRoute allowedRoles={r.roles || []}>{element}</ProtectedRoute>}
              />
            );
          })}

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;


