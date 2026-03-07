import LanguageSwitcher from "@/components/ui/actions/LanguageSwitcher";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen">
      <div className="hidden lg:flex lg:w-1/3 xl:w-1/2">
        <Image
          src="/img/mood-bg.jpg"
          alt="This is showing a mood background for the login screen"
          width={1080}
          height={1350}
          priority={true}
          className="object-cover object-center"
        />
      </div>
      <div className="relative flex w-full lg:w-2/3 xl:w-1/2 items-center bg-gray-100 justify-center p-4 md:p-0">
        <div className="lg:w-1/2">{children}</div>
        <div className="absolute top-4 right-6">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
