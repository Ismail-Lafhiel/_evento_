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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join us and start participating in sports events
          </p>
        </div>

        {/* Registration Form */}
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
                  <span className="mr-1">•</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
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
            <div className="mt-2 space-y-2">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircleIcon
                    className={`h-4 w-4 mr-2 ${
                      password?.match(req.regex)
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                  />
                  <span
                    className={`${
                      password?.match(req.regex)
                        ? "text-green-600 dark:text-green-400"
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
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                "Create Account"
              )}
            </button>

            {/* Login Link */}
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
