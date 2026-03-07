import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

// Import consolidated translation files
import enTranslations from "../../public/translations/en.json";
import nlTranslations from "../../public/translations/nl.json";

// List of supported locales
const locales = ["en", "nl"];

// Simple translation mapping
const translations = {
  en: enTranslations,
  nl: nlTranslations
};

export default getRequestConfig(async () => {
  try {
    const cookieStore = await cookies();
    const headersList = await headers();

    // Try to get locale from cookie
    let locale = cookieStore.get("NEXT_LOCALE")?.value;

    // If no cookie, try to get from Accept-Language header
    if (!locale) {
      const acceptLanguage = headersList.get("accept-language");
      // Get the first supported locale from the Accept-Language header
      locale = acceptLanguage
        ?.split(",")
        ?.map((lang) => lang.split(";")[0].trim().substring(0, 2))
        ?.find((lang) => locales.includes(lang));
    }

    // Fall back to "en" if no supported locale is found
    if (!locale || !locales.includes(locale)) {
      locale = "en";
    }

    console.log(`[i18n] Using static translations for locale: ${locale}`);
    
    // Use the prebuilt translation object for the selected locale
    const messages = translations[locale as keyof typeof translations];
    
    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`[i18n] Error loading translations:`, error);
    // Return English translations as fallback
    return {
      locale: "en",
      messages: translations.en,
    };
  }
});