import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/form/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/auth.service";
import { toast } from "react-toastify";
import {
  AtSymbolIcon,
  CheckCircleIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const registerSchema = z
  .object({
    fullname: z
      .string()
      .min(3, "Full name is required")
      .regex(
        /^[A-Za-z]+\s[A-Za-z]+$/,
        "Full name must be in format: First name Space Last name"
      ),
    username: z
      .string()
      .min(3, "Username is required")
      .regex(
        /^[A-Za-z][A-Za-z0-9]*$/,
        "Username must contain only letters and numbers"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "One uppercase letter", regex: /[A-Z]/ },
    { label: "One lowercase letter", regex: /[a-z]/ },
    { label: "One number", regex: /[0-9]/ },
    { label: "One special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ];

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Remove confirm_password before sending to API
      const { confirm_password, ...registerData } = data;

      await authService.register(registerData);

      toast.success("Registration successful! Please log in.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Registration failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex bg-white dark:bg-gray-900">
      {/* Left Side - Logo and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative p-12 lg:pt-[11.5rem] justify-center">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('public/img/hero_cover.jpg')",
          }}
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Content */}
        <div className="relative max-w-lg">
          <h1 className="text-4xl font-bold text-white mb-6">
            Join Evento Today
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Create an account and start your journey in the world of sports
            events. Participate, compete, and connect with other athletes.
          </p>
          <div className="grid grid-cols-2 gap-6 text-gray-200">
            <div className="flex items-center p-4 bg-white/5 backdrop-blur-lg rounded-lg hover:bg-white/10 transition-colors">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>Create Profile</span>
            </div>
            <div className="flex items-center p-4 bg-white/5 backdrop-blur-lg rounded-lg hover:bg-white/10 transition-colors">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              <span>Join Events</span>
            </div>
            <div className="flex items-center p-4 bg-white/5 backdrop-blur-lg rounded-lg hover:bg-white/10 transition-colors">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Meet Athletes</span>
            </div>
            <div className="flex items-center p-4 bg-white/5 backdrop-blur-lg rounded-lg hover:bg-white/10 transition-colors">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              <span>Track Progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-block mb-2">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Join us and start participating in sports events
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <FormInput
                  type="text"
                  {...register("fullname")}
                  id="fullname"
                  placeholder="John Doe"
                  className="pl-10"
                />
              </div>
              {errors.fullname && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
                  <span className="mr-1">•</span>
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <FormInput
                  type="text"
                  {...register("username")}
                  id="username"
                  placeholder="johndoe"
                  className="pl-10"
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
                  <span className="mr-1">•</span>
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <FormInput
                  type="email"
                  {...register("email")}
                  id="email"
                  placeholder="john@example.com"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
                  <span className="mr-1">•</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <FormInput
                  type="password"
                  {...register("password")}
                  id="password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <FormInput
                  type="password"
                  {...register("confirm_password")}
                  id="confirm_password"
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
              {errors.confirm_password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
                  <span className="mr-1">•</span>
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
            {/* Password Requirements */}
            <div className="mt-4 space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircleIcon
                    className={`h-4 w-4 mr-2 ${
                      password && req.regex.test(password)
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                  <span
                    className={`${
                      password && req.regex.test(password)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
