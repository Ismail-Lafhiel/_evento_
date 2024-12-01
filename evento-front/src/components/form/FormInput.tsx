import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  placeholder: string;
  value?: string;
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    type: initialType, 
    id, 
    placeholder, 
    value, 
    label,
    error,
    icon,
    helperText,
    className = "",
    disabled,
    ...props 
  }, ref) => {
    // State for password visibility toggle
    const [type, setType] = useState(initialType);

    // Handle password visibility toggle
    const togglePasswordVisibility = () => {
      setType(type === "password" ? "text" : "password");
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={id} 
            className={`
              block 
              mb-2 
              text-sm 
              font-medium 
              ${error ? 'text-red-600' : 'text-gray-900 dark:text-white'}
              ${disabled ? 'opacity-60' : ''}
            `}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Leading Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-gray-500 dark:text-gray-400 ${disabled ? 'opacity-60' : ''}`}>
                {icon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={type}
            id={id}
            value={value}
            disabled={disabled}
            className={`
              w-full
              px-4
              py-2.5
              text-sm
              text-gray-900
              bg-white
              dark:bg-gray-700
              border
              rounded-lg
              transition-all
              duration-200
              disabled:opacity-60
              disabled:cursor-not-allowed
              placeholder:text-gray-400
              dark:text-white
              dark:placeholder:text-gray-400
              ${icon ? 'pl-10' : ''}
              ${initialType === 'password' ? 'pr-10' : ''}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:focus:border-primary-500'
              }
              ${className}
            `}
            placeholder={placeholder}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />

          {/* Password Toggle Button */}
          {initialType === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {type === "password" ? (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              ) : (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p 
            className="mt-2 text-sm text-red-600 dark:text-red-500"
            id={`${id}-error`}
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
