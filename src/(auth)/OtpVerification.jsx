import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, ArrowRight } from "lucide-react";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    // This is the main container that will handle the layout
    <div className="flex min-h-screen relative">
      {/* Background Image - Now visible on all screen sizes */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('../../public/images/authbg.png')",
        }}
      ></div>
      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800 opacity-20"></div> */}

      {/* Left Side Panel - Only visible on large screens, now 60% width */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
          <p className="text-lg mb-8">
            We've sent a 6-digit code to your email. Enter it below to verify
            your account.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-lg">Email Verification</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-lg">Secure & Simple</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <ArrowRight className="w-5 h-5" />
              </div>
              <p className="text-lg">Quick Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - OTP Verification Form - Now 40% width */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        {/* Glassmorphic Form Card - Matching LoginPage */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-lg border-2 border-gray-300 p-6">
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl font-bold mb-4">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-300">
              We've sent a 6-digit code to your email.
            </p>
          </div>

          <form className="space-y-8 ">
            {/* OTP Inputs - Transparent with bottom border only (matching LoginPage) */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-14 text-center text-2xl font-bold text-white bg-transparent border-b-2 border-white focus:border-gray-300 placeholder-gray-400 focus:outline-none transition-colors"
                />
              ))}
            </div>

            {/* Verify Button - Matching LoginPage style */}
            <button
              type="submit"
              className="w-fit mx-auto ml-17 px-10 py-2 text-[#2e4a7b] bg-white font-bold rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-950 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Verify Account
            </button>
          </form>

          {/* Resend Link */}
          <p className="mt-6 text-center text-sm text-white">
            Didn't receive a code?{" "}
            <button className="font-medium text-white hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
