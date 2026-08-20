import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppShell } from '../../components/layout';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { ProjectsListPage } from '../../features/projects/pages/ProjectsListPage';
import { ProjectTypesPage } from '../../features/projects/pages/ProjectTypesPage';
import { ProjectStatusesPage } from '../../features/projects/pages/ProjectStatusesPage';
import { FinancialYearsPage } from '../../features/projects/pages/FinancialYearsPage';
import { WorkCategoriesPage } from '../../features/projects/pages/WorkCategoriesPage';
import { ClientsListPage } from '../../features/clients/pages/ClientsListPage';
import { CompanyListPage } from '../../features/settings/pages/CompanyListPage';
import { BranchListPage } from '../../features/settings/pages/BranchListPage';
import { UsersListPage } from '../../features/users/pages/UsersListPage';
import { PermissionsPage } from '../../features/permissions/pages/PermissionsPage';
import { ApprovalWorkflowsPage } from '../../features/workflows/pages/ApprovalWorkflowsPage';
import { AuthProvider } from '../../features/auth/context/AuthContext';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { ErrorBoundary } from '../../components/layout/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
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
            path: 'projects/register',
            element: <ProjectsListPage />,
          },
          {
            path: 'masters/project-types',
            element: <ProjectTypesPage />,
          },
          {
            path: 'masters/project-statuses',
            element: <ProjectStatusesPage />,
          },
          {
            path: 'masters/financial-years',
            element: <FinancialYearsPage />,
          },
          {
            path: 'masters/work-categories',
            element: <WorkCategoriesPage />,
          },
          {
            path: 'masters/clients',
            element: <ClientsListPage />,
          },
          {
            path: 'projects/clients',
            element: <Navigate to="/masters/clients" replace />,
          },
          {
            path: 'project-masters/clients',
            element: <Navigate to="/masters/clients" replace />,
          },
          {
            path: 'clients',
            element: <Navigate to="/masters/clients" replace />,
          },
          {
            path: 'project-masters/types',
            element: <Navigate to="/masters/project-types" replace />,
          },
          {
            path: 'project-types',
            element: <Navigate to="/masters/project-types" replace />,
          },
          {
            path: 'project-masters/status',
            element: <Navigate to="/masters/project-statuses" replace />,
          },
          {
            path: 'project-statuses',
            element: <Navigate to="/masters/project-statuses" replace />,
          },
          {
            path: 'project-status',
            element: <Navigate to="/masters/project-statuses" replace />,
          },
          {
            path: 'project-masters/financial-year',
            element: <Navigate to="/masters/financial-years" replace />,
          },
          {
            path: 'financial-years',
            element: <Navigate to="/masters/financial-years" replace />,
          },
          {
            path: 'project-masters/work-categories',
            element: <Navigate to="/masters/work-categories" replace />,
          },
          {
            path: 'work-categories',
            element: <Navigate to="/masters/work-categories" replace />,
          },
          {
            path: 'administration/companies',
            element: <CompanyListPage />,
          },
          {
            path: 'administration/branches',
            element: <BranchListPage />,
          },
          {
            path: 'administration/users',
            element: <UsersListPage />,
          },
          {
            path: 'administration/roles-permissions',
            element: <PermissionsPage />,
          },
          {
            path: 'administration/approval-workflows',
            element: <ApprovalWorkflowsPage />,
          },
          // Redirects for legacy routes
          {
            path: 'settings/company-branch',
            element: <Navigate to="/administration/companies" replace />,
          },
          {
            path: 'settings/users',
            element: <Navigate to="/administration/users" replace />,
          },
          {
            path: 'users',
            element: <Navigate to="/administration/users" replace />,
          },
          {
            path: 'settings/permissions',
            element: <Navigate to="/administration/roles-permissions" replace />,
          },
          {
            path: 'permissions',
            element: <Navigate to="/administration/roles-permissions" replace />,
          },
          {
            path: 'settings/company',
            element: <Navigate to="/administration/companies" replace />,
          },
          {
            path: 'settings/branch',
            element: <Navigate to="/administration/branches" replace />,
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
