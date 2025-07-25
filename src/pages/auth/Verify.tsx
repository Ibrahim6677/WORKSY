import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  completeLoginAsync,
  verifyEmailAsync,
  forgotPasswordVerifyAsync,
  resendVerificationEmailAsync
} from "../../features/auth/authSlice";
import imgLogin from "../../assets/images/Delivery _ order, account, transportation, subway, box, shopping.png";
import logo from "../../assets/images/Vector1.svg";
import { useNavigate, useLocation } from "react-router-dom";

const Verify = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from; // "login" | "register" | "forget"
  const [resendLoading, setResendLoading] = useState(false);

  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const email = location.state?.email;
  const sessionToken = location.state?.sessionToken;

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const code = otp.join("");

  const handleResendVerification = async () => {
    if (!email) {
      alert("البريد الإلكتروني غير متوفر");
      return;
    }
    setResendLoading(true);
    try {
      await dispatch(resendVerificationEmailAsync(email)).unwrap();
      alert("تم إرسال رمز التحقق مرة أخرى");
    } catch (err: any) {
      alert(err || "فشل إعادة إرسال رمز التحقق");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      alert("من فضلك ادخل الكود كاملاً.");
      return;
    }

    try {
      if (from === "login") {
        // استخدام completeLogin async thunk
        await dispatch(completeLoginAsync({ 
          email, 
          sessionToken, 
          otp: code 
        })).unwrap();
        navigate("/workspace");
      } else if (from === "register") {
        await dispatch(verifyEmailAsync(code)).unwrap();
        navigate("/login");
      } else if (from === "forget-password") {
        // استخدام resetToken من Redux state
        const resetToken = location.state?.resetToken;
        await dispatch(forgotPasswordVerifyAsync({ 
          email, 
          pin: code, 
          resetToken 
        })).unwrap();
        navigate("/reset-password", { state: { email, token: code } });
      } else {
        alert("حدث خطأ: لم يتم تحديد نوع التحقق.");
      }
    } catch (err: any) {
      // الخطأ سيكون متاح في Redux state
      console.error("Verification failed:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full min-h-screen px-4 py-8 gap-8">
      <div className="flex flex-col items-center justify-center w-full h-[80vh] max-w-xl bg-[#EFE7FF] rounded-2xl shadow-[2px_2px_3px_3px_#F6F1Fe] p-6">
        <header className="w-full flex justify-center items-center mb-4">
          <img src={logo} alt="logo" />
          <h1 className="text-2xl font-bold font-amiko uppercase ml-2">Worksy</h1>
        </header>
        <p className="text-gray-600 mb-4 text-center">
          {from === "login" && "ادخل رمز التحقق لتسجيل الدخول."}
          {from === "register" && "ادخل رمز التحقق لإتمام التسجيل."}
          {from === "forget" && "ادخل رمز التحقق لإعادة تعيين كلمة المرور."}
          {!from && "ادخل رمز التحقق."}
        </p>
        <div className="flex gap-2 mt-4 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(idx, e.target.value)}
              onKeyDown={e => handleKeyDown(idx, e)}
              ref={el => (inputsRef.current[idx] = el)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-center text-2xl font-bold transition-all shadow-sm bg-white"
              style={{ MozAppearance: "textfield" }}
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || code.length !== 6 || otp.includes("")}
          className="w-full max-w-xs py-3 rounded-lg bg-primary-500 text-white font-semibold text-lg shadow-md bg-[#6334FF] hover:bg-[#5026E4] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "...جاري التحقق" : "تحقق"}
        </button>
        
        
          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="w-full max-w-xs py-2 mt-2 rounded-lg border border-[#6334FF] text-[#6334FF] font-semibold text-sm hover:bg-[#6334FF] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "...جاري الإرسال" : "إعادة إرسال رمز التحقق"}
          </button>
        
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
      <div className="hidden lg:block w-full max-w-sm">
        <img src={imgLogin} className="w-full h-auto object-contain" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Verify;
