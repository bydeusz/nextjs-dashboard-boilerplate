import { AuthProviders } from "@/providers/AuthProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { initializeBucket } from "@/config/minio";
import "../assets/styles/globals.css";
import { Toaster } from "@/providers/ToastProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  await initializeBucket();

  return (
    <html lang={locale}>
      <body>
        <AuthProviders>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </AuthProviders>
      </body>
    </html>
  );
}
