"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { EyeOff, Eye } from "lucide-react";

// Input type
export interface PasswordProps {
  label: string;
  required?: boolean;
  name: string;
  id: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const PasswordInput = ({
  label,
  required,
  name,
  id,
  placeholder,
  disabled,
  value,
  onChange,
}: PasswordProps) => {
  const t = useTranslations("inputs.errors");
  const [error, setError] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleBlur = () => {
    setBlurred(true);

    // Check for error after blur
    if (required && !value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold leading-6 text-gray-900">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative mt-2">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          className={`block w-full rounded-md border-0 px-[10px] py-1.5 sm:text-sm sm:leading-6 outline-none ${
            error && blurred
              ? "text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500"
              : "text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
          }`}
          placeholder={placeholder}
          disabled={disabled}
          value={value ?? ""}
          onBlur={handleBlur}
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility">
          {showPassword ? (
            <Eye className="size-5 text-gray-500" />
          ) : (
            <EyeOff className="size-5 text-gray-500" />
          )}
        </button>
      </div>
      {error && blurred && (
        <p className="mt-2 text-xs text-red-600" id="email-error">
          {t("required")}
        </p>
      )}
    </div>
  );
};
