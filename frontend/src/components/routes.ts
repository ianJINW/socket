export type AppRoute = {
  path: string;
  label: string;
  public?: boolean; // visible to unauthenticated users
  roles?: string[] | null; // null = any authenticated user, [] = no one
};

export const appRoutes: AppRoute[] = [
  { path: '/dashboard', label: 'Dashboard', roles: null },
  { path: '/students', label: 'Students', roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/academics', label: 'Academics', roles: ['admin', 'academic_admin'] },
  { path: '/exams', label: 'Exams', roles: ['admin', 'academic_admin', 'teacher'] },
  { path: '/finance', label: 'Finance', roles: ['admin', 'finance'] },
  { path: '/about', label: 'About', public: true },
];

export default appRoutes;
