"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

// Input type
export interface TextAreaProps {
  label: string;
  required?: boolean;
  name: string;
  id: string;
  disabled?: boolean;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export const TextArea = ({
  label,
  required,
  name,
  id,
  disabled,
  value,
  onChange,
}: TextAreaProps) => {
  const t = useTranslations("inputs.errors");
  const [error, setError] = useState(false);
  const [blurred, setBlurred] = useState(false);

  const handleBlur = () => {
    setBlurred(true);

    // Check for error after blur
    if (required && !value) {
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
      <div className="mt-2">
        <textarea
          rows={4}
          name={name}
          id={id}
          className={`block w-full rounded-md border-0 py-1.5 sm:text-sm sm:leading-6 ${
            error && blurred
              ? "text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500"
              : "text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200"
          }`}
          value={value ?? ""}
          disabled={disabled}
          onBlur={handleBlur}
          onChange={onChange}
        />
      </div>
      {error && blurred && (
        <p className="mt-2 text-xs text-red-600" id="email-error">
          {t("required")}
        </p>
      )}
    </div>
  );
};
