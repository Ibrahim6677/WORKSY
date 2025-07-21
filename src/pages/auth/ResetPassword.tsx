import { useNavigate } from "react-router-dom";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import Input, { InputSubmit } from "../../components/atoms/input/Input";
import { useState } from "react";
import * as authApi from "../../services/api/auth/authApi";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email;
  const token = location.state?.token; // أو حسب ما يرسله backend

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authApi.resetPassword({ token, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 6) {
      setError("Password must be at least 6 characters long");
    } else {
      setError("");
    }
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (password !== value) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-8 gap-8">
      {/* Left - Login Form */}
      <div className="flex flex-col items-center justify-center w-full h-[80vh] max-w-xl bg-[#EFE7FF] rounded-2xl shadow-[2px_2px_3px_3px_#F6F1Fe] p-6">
        <header className="w-full flex justify-center items-center mb-4">
          <img src={logo} alt="logo" />
          <h1 className="text-2xl font-bold font-amiko uppercase ml-2">
            Worksy
          </h1>
        </header>

        <section className="w-full px-2">
          <h1 className="text-3xl sm:text-4xl text-center font-bold mb-2">
            Reset Your Password
          </h1>
          <p className="text-sm sm:text-md text-gray-500 text-center capitalize p-2">
            enter a new password to access your account
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-2 max-w-md mx-auto"
          >
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <InputSubmit
              type="submit"
              value={loading ? "Loading..." : "Update Password"}
              className="bg-[#6629DE] text-white rounded-2xl w-full mt-4 py-3 cursor-pointer hover:opacity-90 transition duration-300"
              disabled={loading}
            />
          </form>
        </section>
      </div>

      {/* Right - Login Illustration */}
      <div className="hidden lg:block w-full max-w-sm">
        <img
          src={imgLogin}
          className="w-full h-auto object-contain"
          alt="Login Illustration"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
