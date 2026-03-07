"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface TabsProps {
  children: React.ReactNode;
}

interface TabProps {
  href: string;
  children: React.ReactNode;
}

export const Tabs = ({ children }: TabsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-10">{children}</nav>
      </div>
    </div>
  );
};

export const Tab = ({ href, children }: TabProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-primary whitespace-nowrap ${
        isActive ? "text-primary border-primary" : "border-transparent"
      }`}>
      {children}
    </Link>
  );
};
