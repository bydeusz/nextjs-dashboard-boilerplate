"use client";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

import "flag-icons/css/flag-icons.min.css";

import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const t = useTranslations("navigation.language");
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "nl", label: t("dutch"), flag: "nl" },
    { code: "en", label: t("english"), flag: "gb" },
  ];

  const handleLanguageChange = async (newLocale: string) => {
    // Set the cookie using Next.js API route
    await fetch("/api/language", {
      method: "POST",
      body: JSON.stringify({ locale: newLocale }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Refresh the page to apply the new locale
    router.refresh();
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="relative text-xs" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-primary">
        <span className={"fi fi-" + selectedLanguage?.flag}></span>
        <span>{selectedLanguage?.label}</span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown
            className={
              "h-4 w-4 transition-transform" + (isOpen ? " rotate-180" : "")
            }
          />
        </span>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-28 overflow-y-auto">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={
                "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100" +
                (locale === language.code ? " bg-gray-50" : "")
              }>
              <span className={"fi fi-" + language.flag}></span>
              <span>{language.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
