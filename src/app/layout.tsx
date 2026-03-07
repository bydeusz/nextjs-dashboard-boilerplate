import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/providers/ToastProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import "@/assets/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
