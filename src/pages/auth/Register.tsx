import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { registerAsync } from "../../features/auth/authSlice";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import googleIcon from "../../assets/images/Group.svg";
import micIcon from "../../assets/images/Group9.svg";
import Input, { InputSubmit } from "../../components/atoms/input/Input";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { loginWithGoogle } from "../../services/api/auth/authApi";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/workspace")
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) {
      alert("كل الحقول مطلوبة");
      return;
    }
    if (!email.includes("@")) {
      alert("صيغة الإيميل غير صحيحة");
      return;
    }

    try {
      await dispatch(registerAsync({
        name: userName,
        email,
        password
      })).unwrap();
      navigate("/verify", { state: { from: "register", email } });
    } catch (err: any) {
      // الخطأ سيكون متاح في Redux state
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-8 bg-white gap-8">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl p-6 bg-[#EFE7FF] rounded-2xl shadow-[2px_2px_3px_3px_#F6F1FE]">
        <header className="w-full text-center mb-6">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="Worksy logo" />
            <h1 className="text-2xl font-bold font-amiko uppercase">Worksy</h1>
          </div>
        </header>

        <section className="w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold mb-4">
            Sign Up To Worksy
          </h1>
          <p className="text-md text-gray-500 mb-4 text-center">
            Enter your email address
          </p>

          <div className="flex flex-col items-center">
            <button
              className="rounded-[49px] border border-[#E5E5E5] w-full h-[50px] bg-white py-3 px-6 flex items-center justify-center gap-2 text-black hover:shadow-md mb-3"
              onClick={loginWithGoogle}
            >
              <img src={googleIcon} alt="Google" />
              <span className="text-[#444] text-lg font-medium">
                Sign In With Google
              </span>
            </button>
            <button className="rounded-[49px] border border-[#E5E5E5] w-full h-[50px] bg-white py-3 px-6 flex items-center justify-center gap-2 text-black hover:shadow-md mb-6">
              <img src={micIcon} alt="Microsoft" />
              <span className="text-[#444] text-lg font-medium">
                Sign In With Microsoft
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="text"
              name="userName"
              placeholder="Username"
              value={userName}
              onChange={(e: any) => setUserName(e.target.value)}
            />
            <Input
              type="email"
              name="email"
              placeholder="name@work.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {error && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
            <InputSubmit
              type="submit"
              value={loading ? "Loading..." : "Get Started"}
              className="bg-[#6629DE] text-white rounded-2xl w-full mt-4 py-3 cursor-pointer hover:opacity-90 transition duration-300"
              disabled={loading}
            />
          </form>

          <div className="text-sm text-gray-500 mt-3 text-center">
            Already have an account?
            <Link to="/login" className="text-[#a38bd2] underline ml-1">
              Sign in
            </Link>
          </div>
        </section>
      </div>

      <div className="hidden lg:block w-full max-w-xs md:max-w-sm">
        <img
          src={imgLogin}
          className="w-full max-h-[600px] object-contain"
          alt="Login illustration"
        />
      </div>
    </div>
  );
};

export default Register;
