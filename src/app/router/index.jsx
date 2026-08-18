import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../../components/layout';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
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
]);
