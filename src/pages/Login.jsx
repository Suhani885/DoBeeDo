import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCall } from "../utils/api";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiCall("get", "/auth/login");
        if (res.success) {
          setIsAuthenticated(true);
          navigate("/todo");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_\-\.]+@[a-z]+\.[a-z]{2,3}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email))
      newErrors.email = "Please enter a valid email address";

    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password =
        "Password must be 8-16 characters with uppercase, lowercase, number and special character";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const res = await apiCall("post", "/auth/login", {
      data: { email, password },
    });

    if (res.success) {
      navigate("/todo");
    } else {
      setErrors((prev) => ({
        ...prev,
        general:
          res.data?.error || res.message || "An unexpected error occurred!",
      }));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-pink-100 via-pink-200 to-pink-300">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl px-7 mx-7 static">
        <img
          src="/bow.png"
          className="h-44 relative bottom-3.5 right-10"
          alt="Bow"
        />
        <div className="flex justify-center relative bottom-28">
          <img src="/logo.png" alt="Logo" className="max-h-20 object-contain" />
        </div>
        <p className="text-center text-gray-500 relative bottom-28">
          Please log in to your account
        </p>

        {errors.general && (
          <div className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 px-4 rounded-lg relative bottom-20">
            {errors.general}
          </div>
        )}

        <div className="relative bottom-16">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "", general: "" });
              }}
              className={`pl-10 mt-1 block w-full px-4 py-2 bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "", general: "" });
                }}
                className={`pl-10 mt-1 block w-full px-4 py-2 pr-12 bg-gray-50 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 px-4 font-semibold text-white bg-pink-500 hover:bg-pink-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center relative bottom-16">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-500 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
