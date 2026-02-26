
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  User as UserIcon,
  Lock as LockIcon,
  LayoutDashboard,
  Shield,
  Zap,
} from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // fallback to onLogin if provided
    if (onLogin) {
      const result = await onLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Invalid email or password");
      }
    } else {
      setError("Login configuration error. Please contact support.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/authbg.png')",
        }}
      ></div>

      {/* Left Side Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-8">
            Sign in to access your personalized dashboard and continue your
            journey with us.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <p className="text-lg">Personalized Dashboard</p>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-lg">Secure & Private</p>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-lg">Easy to Use</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-md rounded-lg border-2 border-gray-300 p-6">
          <form className="text-center">
            <h2 className="text-white text-3xl font-bold mb-8">Sign In</h2>

            {error && (
              <p className="text-red-500 font-bold text-sm mb-4">{error}</p>
            )}

            {/* Email */}
            <div className="relative mb-8">
              <Mail className="absolute top-1/2 left-0 -translate-y-1/2 w-5 h-5 text-[#7875B5]" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b-2 border-white focus:border-gray-300 text-white font-medium placeholder-gray-300 focus:outline-none"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Password */}
            <div className="relative mb-8">
              <LockIcon className="absolute top-1/2 left-0 -translate-y-1/2 w-5 h-5 text-[#7875B5]" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-8 pr-12 py-3 bg-transparent border-b-2 border-white focus:border-gray-300 text-white font-medium placeholder-gray-300 focus:outline-none"
                placeholder="Password"
                required
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

            {/* Forgot Password */}
            <div className="flex justify-end mb-2">
              <a
                href="/forgot-password"
                className="text-sm text-white hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-fit px-8 py-2 mt-4 text-[#2E4A7B] bg-white font-bold rounded-full shadow-lg hover:bg-gray-100 hover:text-blue-950 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-6 text-center text-sm text-white">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-white hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
