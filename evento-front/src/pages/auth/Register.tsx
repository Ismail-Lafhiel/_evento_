import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../../components/auth/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "../../services/auth.service";
import { toast } from "react-toastify";

const registerSchema = z
  .object({
    fullname: z
      .string()
      .regex(
        /^[A-Za-z]+\s[A-Za-z]+$/,
        "Full name must be in format: First name Space Last name"
      ),
    username: z
      .string()
      .transform((username) => {
        // Generate random number between 1 and 999
        const randomNum = Math.floor(Math.random() * 999) + 1;
        // Add @ prefix and random number suffix if they don't exist
        if (!username.startsWith("@")) {
          username = "@" + username;
        }
        // Remove any existing numbers at the end before adding new ones
        username = username.replace(/\d+$/, "");
        return `${username}${randomNum}`;
      })
      .pipe(
        z
          .string()
          .regex(
            /^@[A-Za-z]+[0-9]{1,3}$/,
            "Username must contain only letters with optional numbers at the end"
          )
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
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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

  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value) {
      // Remove any existing @ prefix and numbers at the end
      value = value.replace(/^@/, "").replace(/\d+$/, "");
      // Add @ prefix if it doesn't exist
      if (!value.startsWith("@")) {
        value = "@" + value;
      }
      // Generate random number between 1 and 999
      const randomNum = Math.floor(Math.random() * 999) + 1;
      value = `${value}${randomNum}`;
      setValue("username", value);
    }
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 xl:py-24">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full name
                </label>
                <FormInput
                  type="text"
                  {...register("fullname")}
                  id="fullname"
                  placeholder="Enter your full name"
                />
                {errors.fullname && (
                  <p className="mt-1 ml-1 text-xs text-red-600">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <FormInput
                  type="text"
                  {...register("username")}
                  id="username"
                  placeholder="Enter your username"
                  onBlur={handleUsernameBlur}
                />
                {errors.username && (
                  <p className="mt-1 ml-1 text-xs text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <FormInput
                  type="email"
                  {...register("email")}
                  id="email"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 ml-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <FormInput
                  type="password"
                  {...register("password")}
                  id="password"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 ml-1 text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <FormInput
                  type="password"
                  {...register("confirm_password")}
                  id="confirm_password"
                  placeholder="Confirm your password"
                />
                {errors.confirm_password && (
                  <p className="mt-1 ml-1 text-xs text-red-600">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Create an account"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
