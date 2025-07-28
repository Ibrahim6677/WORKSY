import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { registerAsync } from "../../features/auth/authSlice";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import micIcon from "../../assets/images/Group9.svg";
import Input, { InputSubmit } from "../../components/atoms/input/Input";
import { useAuth } from "../../hooks/useAuth/useAuth";
import GoogleButton from "../../components/atoms/Bottom/GoogleButton";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // ✅ استخدام useAuth للحصول على حالة المصادقة
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // ✅ إعادة توجيه المستخدم إذا كان مسجل دخول بالفعل
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ User already authenticated, redirecting to workspace...');
      navigate("/workspace");
    }
  }, [isAuthenticated, navigate]);

  // ✅ معالجة التسجيل العادي
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!userName || !email || !password) {
      alert("جميع الحقول مطلوبة");
      return;
    }
    if (!email.includes("@")) {
      alert("صيغة الإيميل غير صحيحة");
      return;
    }
    if (password.length < 6) {
      alert("كلمة المرور يجب أن تكون أطول من 6 أحرف");
      return;
    }

    try {
      console.log('📝 Registration attempt for:', email);
      
      await dispatch(registerAsync({
        name: userName,
        email,
        password
      })).unwrap();
      
      console.log('✅ Registration successful, navigating to verify...');
      navigate("/verify", { state: { from: "register", email } });
    } catch (err: any) {
      console.error("❌ Registration failed:", err);
    }
  };

  // ✅ إظهار loading إذا كان المستخدم مصادق بالفعل
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-8 bg-white gap-8">
      {/* Left - Register Form */}
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
          <p className="text-md text-gray-500 mb-6 text-center">
            Create your account to get started
          </p>

          {/* ✅ أزرار تسجيل الدخول بالمنصات الاجتماعية */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            {/* Google Register Button */}
            <div className="w-full">
              <GoogleButton />
            </div>
            
            {/* Microsoft Register Button (مُعطّل مؤقتاً) */}
            <button 
              className="flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-full w-full h-[50px] bg-white hover:shadow-md transition-shadow opacity-50 cursor-not-allowed"
              disabled
              title="Coming soon"
            >
              <img src={micIcon} alt="Microsoft" />
              <span className="text-[#444] text-lg font-medium">
                Sign Up With Microsoft
              </span>
              <span className="text-xs text-gray-400 ml-2">(Soon)</span>
            </button>
          </div>

          {/* ✅ فاصل "OR" */}
          <div className="flex items-center w-full mb-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
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
