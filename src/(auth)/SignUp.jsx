import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Monitor,
  Shield,
  Zap,
} from "lucide-react";
import backgroundImage from "../../public/images/authbg.png";// Import the image

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      {/* Left Side Panel */}
      <div className="hidden lg:flex lg:w-3/5 relative z-10">
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            Start Your Journey With Us
          </h1>
          <p className="text-lg mb-8">
            Create an account to access exclusive features and personalized
            content.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-black/80 bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <Monitor className="w-5 h-5" />
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

      {/* Right Side - Sign Up Form with Glassmorphism Effect */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 relative z-10 h-screen">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-3xl shadow-2xl p-3 pr-8 pl-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-2">
                <User className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-white">Create Account</h2>
              <p className="text-sm text-white/70 mt-1">
                Sign up to get started
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-white/40 focus:border-white text-white placeholder-white/50 text-sm focus:outline-none"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-white/40 focus:border-white text-white placeholder-white/50 text-sm focus:outline-none"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-10 py-3 bg-transparent border-b-2 border-white/40 focus:border-white text-white placeholder-white/50 text-sm focus:outline-none"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 border-white/40 focus:border-white text-white placeholder-white/50 text-sm focus:outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 ml-2 text-indigo-400 border-white/40 rounded focus:ring-white/50 bg-transparent"
                  required
                />
                <span className="ml-3 text-sm text-white/80">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-white underline hover:text-white/70"
                  >
                    Terms and Conditions
                  </a>
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-60"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-white underline hover:text-white/70"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
