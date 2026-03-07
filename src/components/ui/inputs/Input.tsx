"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { AlertCircle } from "lucide-react";

// Input type
export interface InputProps {
  label: string;
  required?: boolean;
  type: "text" | "number" | "email" | "url" | "tel";
  name: string;
  id: string;
  placeholder: string;
  disabled?: boolean;
  initialValue?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputField = ({
  label,
  required,
  type,
  name,
  id,
  placeholder,
  disabled,
  initialValue,
  value,
  onChange,
}: InputProps) => {
  const t = useTranslations("inputs.errors");
  const [error, setError] = useState(false);
  const [blurred, setBlurred] = useState(false);

  const handleBlur = () => {
    setBlurred(true);

    // Check for error after blur
    if (required && !value) {
      setError(true);
    } else if (type === "email" && !value?.includes("@")) {
      setError(true);
    } else if (type === "url") {
      try {
        new URL(value || "");
        setError(false);
      } catch (error) {
        setError(true);
        console.log(error);
      }
    } else if (type === "tel" && !/^\+?\d{7,14}$/.test(value || "")) {
      setError(true);
    } else {
      setError(false);
    }
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
          type={type}
          name={name}
          id={id}
          className={`block w-full rounded-md border-0 px-[10px] py-1.5 sm:text-sm sm:leading-6 outline-none ${
            error && blurred
              ? "text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500"
              : "text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
          }`}
          placeholder={placeholder}
          disabled={disabled}
          value={value ?? initialValue ?? ""}
          onBlur={handleBlur}
          onChange={onChange}
        />
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <AlertCircle className="size-5 text-red-500" />
          </div>
        )}
      </div>
      {error && blurred && (
        <p className="mt-2 text-xs text-red-600" id="email-error">
          {type === "email"
            ? t("email")
            : type === "url"
              ? t("url")
              : type === "tel"
                ? t("tel")
                : t("required")}
        </p>
      )}
    </div>
  );
};
