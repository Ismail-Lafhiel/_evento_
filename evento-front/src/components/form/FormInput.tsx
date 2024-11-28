import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  id: string;
  placeholder: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ type, id, placeholder, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
