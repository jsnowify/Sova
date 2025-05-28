import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout"; // Import MainLayout
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BlogHomePage from "./pages/BlogHomePage";
import SinglePostPage from "./pages/SinglePostPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import ErrorHandlePage from "./pages/ErrorHandlePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use MainLayout */}
        <Route index element={<Welcome />} /> {/* index route for "/" */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="blog" element={<BlogHomePage />} />
          <Route path="blog/:slug" element={<SinglePostPage />} />
          {/* These auth pages could also be outside MainLayout if you want a completely different look */}
          {/* Protected routes for create/edit post and dashboard.
            You'd ideally wrap these with a ProtectedRoute component that checks roles.
            For now, they are inside MainLayout but their internal logic should handle auth.
          */}
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="edit-post/:slug" element={<EditPostPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        {/* Routes that might not use MainLayout (or could use a different layout) */}
        {/* For example, if dashboard has its own distinct layout:
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
           Add other dashboard-specific sub-routes here
        </Route>
        */}
        {/* Fallback Error Page (typically outside main layout) */}
        <Route path="*" element={<ErrorHandlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
