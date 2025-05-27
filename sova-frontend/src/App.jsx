import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Welcome from "./pages/Welcome";
import ErrorHandlePage from "./pages/ErrorHandlePage";
import DashboardPage from "./pages/DashboardPage";
import BlogHomePage from "./pages/BlogHomePage";
import SinglePostPage from "./pages/SinglePostPage"; // Import SinglePostPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Blog Routes */}
        <Route path="/blog" element={<BlogHomePage />} />
        <Route path="/blog/:slug" element={<SinglePostPage />} />{" "}
        {/* Add single post route */}
        <Route path="*" element={<ErrorHandlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
