import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { forgotPasswordRequestAsync } from "../../features/auth/authSlice";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import Input, { InputSubmit } from "../../components/atoms/input/Input";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(forgotPasswordRequestAsync(email)).unwrap();
      navigate("/verify", { state: { from: "forget-password", email } });
    } catch (err: any) {
      // الخطأ سيكون متاح في Redux state
      console.error("Reset password request failed:", err);
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
          <h1 className="text-3xl sm:text-4xl text-center capitalize font-bold mb-2">
            forget your password?
          </h1>
          <p className="text-sm sm:text-md text-gray-500 capitalize text-center p-2">
            enter your email address we will send you a link to reset your password
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full space-y-2 max-w-md mx-auto"
          >
            <Input
              type="email"
              name="email"
              placeholder="name@work.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            <InputSubmit
              type="submit"
              value={loading ? "Loading..." : "Send New Password"}
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
  )
}

export default ForgetPassword