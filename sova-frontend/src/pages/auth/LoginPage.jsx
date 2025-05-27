import LoginForm from "../../components/LoginForm";
import useTitle from "../../hooks/useTitle";

export default function LoginPage() {
  useTitle("Login - Sova");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Welcome Back
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
