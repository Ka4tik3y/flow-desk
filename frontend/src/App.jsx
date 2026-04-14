import { Routes, Route } from "react-router-dom";

// Route Guards
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards";

// Layouts
import { AppShell } from "./components/layout/AppShell";
import { AuthLayout } from "./features/auth/AuthLayout";

// Auth Pages (Assuming these exist)
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";

// App Pages
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { TasksPage } from "./features/tasks/TasksPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { TaskDetailPage } from "./features/tasks/TaskDetailPage";
import { TaskDetailPlaceholder } from "./features/tasks/TaskDetailPlaceholder";

// 404 Page
import { NotFoundPage } from "./components/layout/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Public routes for Login and Register */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Main application routes for authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />}>
            <Route index element={<TaskDetailPlaceholder />} />
            <Route path=":taskId" element={<TaskDetailPage />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;