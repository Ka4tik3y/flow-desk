import { AppShell } from "../components/layout/AppShell";
import { AuthLayout } from "../features/auth/AuthLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { TaskDetailPage } from "../features/tasks/TaskDetailPage";
import { TaskDetailPlaceholder } from "../features/tasks/TaskDetailPlaceholder";
import { TasksPage } from "../features/tasks/TasksPage";
import { UsersPage } from "../features/users/UsersPage";
import { AdminRoute, ProtectedRoute, PublicRoute } from "./RouteGuards";
import { NotFoundPage } from "./NotFoundPage";

export const appRoutes = [
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/register", element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          {
            path: "/tasks",
            element: <TasksPage />,
            children: [
              { index: true, element: <TaskDetailPlaceholder /> },
              { path: ":taskId", element: <TaskDetailPage /> },
            ],
          },
          {
            element: <AdminRoute />,
            children: [{ path: "/users", element: <UsersPage /> }],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
