import RegisterForm from "../../components/RegisterForm";
import useTitle from "../../hooks/useTitle";

export default function RegisterPage() {
  useTitle("Register - Sova");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-6">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Your Account
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}
