import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Welcome from "./pages/Welcome";
import ErrorHandlePage from "./pages/ErrorHandlePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<ErrorHandlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
