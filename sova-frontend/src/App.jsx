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
        <Route index element={<Welcome />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="blog" element={<BlogHomePage />} />
          <Route path="blog/:slug" element={<SinglePostPage />} />
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="edit-post/:slug" element={<EditPostPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<ErrorHandlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
