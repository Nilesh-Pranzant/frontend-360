// pages/Logins/ForgotPasswordPage.js
import { Link } from "react-router-dom";
import { Mail, Shield, Zap, Clock } from "lucide-react";
import backgroundImage from "../../public/images/authbg.png"; 

const ForgotPasswordPage = () => {
  return (
    // This is the main container that will handle the layout
    <div className="flex min-h-screen relative">
      {/* Background Image - Fixed to work properly */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      {/* Left Side Panel - Only visible on large screens, now 60% width */}
      <div className="hidden lg:flex lg:w-3/4  relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Forgot Your Password?</h1>
          <p className="text-lg mb-8">
            No worries, we'll send you reset instructions to your registered
            email address.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-lg">Email Instructions</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-lg">Secure & Simple</p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80  bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-lg">Quick Recovery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form - Now 40% width */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 mr-0 lg:mr-20 relative z-10 h-screen">
        {/* Form Container with attractive design - matching SignUpPage */}
        <div className="w-full max-w-lg bg-white/5  backdrop-blur-md rounded-3xl shadow-2xl p-6">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold  text-white">Forgot Password?</h2>
            <p className="text-sm text-white mt-1">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-white focus:border-gray-300 text-white font-medium placeholder-gray-300 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-fit sm:w-fit w-full px-6 sm:px-8 py-2 mt-4 sm:ml-25 ml-0 text-[#2e4a7b] bg-white font-bold rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-950 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            <Link
              to="/login"
              className="font-medium text-white hover:text-gray-300"
            >
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
