import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppShell } from '../../components/layout';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { ProjectsListPage } from '../../features/projects/pages/ProjectsListPage';
import { ClientsListPage } from '../../features/clients/pages/ClientsListPage';
import { CompanyBranchPage } from '../../features/settings/pages/CompanyBranchPage';
import { UsersListPage } from '../../features/users/pages/UsersListPage';
import { PermissionsPage } from '../../features/permissions/pages/PermissionsPage';
import { AuthProvider } from '../../features/auth/context/AuthContext';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'projects',
            element: <ProjectsListPage />,
          },
          {
            path: 'project-masters/clients',
            element: <ClientsListPage />,
          },
          {
            path: 'clients',
            element: <Navigate to="/project-masters/clients" replace />,
          },
          {
            path: 'settings/company-branch',
            element: <CompanyBranchPage />,
          },
          {
            path: 'settings/users',
            element: <UsersListPage />,
          },
          {
            path: 'users',
            element: <Navigate to="/settings/users" replace />,
          },
          {
            path: 'settings/permissions',
            element: <PermissionsPage />,
          },
          {
            path: 'permissions',
            element: <Navigate to="/settings/permissions" replace />,
          },
          {
            path: 'settings/company',
            element: <Navigate to="/settings/company-branch" replace />,
          },
          {
            path: 'settings/branch',
            element: <Navigate to="/settings/company-branch" replace />,
          },
          // Placeholders for other routes
          {
            path: '*',
            element: (
              <div className="p-8 flex items-center justify-center text-text-muted h-full">
                This module is under construction.
              </div>
            ),
          },
        ],
      },
    ],
  },
]);
