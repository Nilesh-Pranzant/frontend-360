import { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    // This is the main container that will handle the layout
    <div className="flex min-h-screen relative">
      {/* Background Image - Now visible on all screen sizes */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('../../../public/images/authbg.png')",
        }}
      ></div>
      {/* Left Side Panel - Only visible on large screens, now 60% width */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl text-white font-bold mb-4">
            Set New Password
          </h1>
          <p className="text-lg mb-8 text-white">
            Your new password must be different from previous used passwords.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-lg">Secure Password</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-lg">Easy to Remember</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <ArrowRight className="w-5 h-5" />
              </div>
              <p className="text-lg">Quick & Simple</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Side - Reset Password Form - Now 40% width */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        {/* Glassmorphic Form Card - Matching Login UI Style */}
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-lg border-2 border-gray-300 p-6">
          <form className="text-center">
            <h2 className="text-white text-3xl font-bold mb-8">
              Set New Password
            </h2>
            {/* New Password Field */}
            <div className="relative mb-8">
              <Lock className="absolute top-1/2 left-0 -translate-y-1/2 w-5 h-5 text-[#7875B5]" />
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-8 pr-12 py-3 bg-transparent border-b-2 border-white focus:border-gray-300 text-white font-medium placeholder-gray-300 focus:outline-none"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7875B5] hover:text-white focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Confirm Password Field */}
            <div className="relative mb-8">
              <Lock className="absolute top-1/2 left-0 -translate-y-1/2 w-5 h-5 text-[#7875B5]" />
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full pl-8 pr-12 py-3 bg-transparent border-b-2 border-white focus:border-gray-300 text-white font-medium placeholder-gray-300 focus:outline-none"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#7875B5] hover:text-white focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {/* Reset Button */}
            <button
              type="submit"
              className="w-fit px-8 py-2 mt-4 text-[#2E4A7B] bg-white font-bold rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-950 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Reset Password
            </button>
            {/* Back to Login Link */}
            <p className="mt-6 text-center text-sm text-white">
              <Link
                to="/login"
                className="font-medium text-white hover:underline"
              >
                ← Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
