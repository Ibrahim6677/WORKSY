import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState, AppDispatch } from "../../store/store";
import { loginAsync } from "../../features/auth/authSlice";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import googleIcon from "../../assets/images/Group.svg";
import micIcon from "../../assets/images/Group9.svg";
import Input, { InputSubmit } from "../../components/atoms/input/Input";
import { useAuth } from "../../hooks/useAuth/useAuth";
import { loginWithGoogle } from "../../services/api/auth/authApi";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
    
    try {
      const result = await dispatch(loginAsync({ email, password })).unwrap();
      // بعد نجاح login، سيتم تحديث sessionToken في Redux
      navigate("/verify", { 
        state: { 
          from: "login", 
          email, 
          sessionToken: result.data.sessionToken 
        } 
      });
    } catch (err: any) {
      // الخطأ سيكون متاح في Redux state
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-8 gap-8">
      {/* Left - Login Form */}
      <div className="flex flex-col items-center justify-center w-full max-w-xl bg-[#EFE7FF] rounded-2xl shadow-[2px_2px_3px_3px_#F6F1Fe] p-6">
        <header className="w-full flex justify-center items-center mb-4">
          <img src={logo} alt="logo" />
          <h1 className="text-2xl font-bold font-amiko uppercase ml-2">Worksy</h1>
        </header>

        <section className="w-full px-2">
          <h1 className="text-3xl sm:text-4xl text-center font-bold mb-2">
            Sign in To Worksy
          </h1>
          <p className="text-sm sm:text-md text-gray-500 text-center p-2">
            Enter your email address
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-2 max-w-md mx-auto">
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

            <Link
              to="/forget-password"
              className="text-sm text-[#a38bd2] underline mt-2 text-left"
            >
              Forget your password?
            </Link>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <InputSubmit
              type="submit"
              value={loading ? "Loading..." : "Get Started"}
              className="bg-[#6629DE] text-white rounded-2xl w-full mt-4 py-3 cursor-pointer hover:opacity-90 transition duration-300"
              disabled={loading}
            />
          </form>

          <div className="text-sm text-gray-500 mt-3 text-center">
            Create a new account?
            <Link to="/register" className="text-[#a38bd2] underline ml-1">
              Sign up
            </Link>
          </div>

          <div className="flex items-center w-full mt-6 mb-2">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col items-center">
            <button
              className="flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-full w-[90%] sm:w-[300px] h-[50px] bg-white mb-4 hover:shadow-md"
              onClick={loginWithGoogle}
            >
              <img src={googleIcon} alt="" />
              <span className="text-[#444] text-sm font-medium">
                Sign In With Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-full w-[90%] sm:w-[300px] h-[50px] bg-white mb-2 hover:shadow-md">
              <img src={micIcon} alt="" />
              <span className="text-[#444] text-sm font-medium">
                Sign In With Microsoft
              </span>
            </button>
          </div>
        </section>
      </div>

      {/* Right - Login Illustration */}
      <div className="hidden lg:block w-full max-w-sm">
        <img src={imgLogin} className="w-full h-auto object-contain" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
