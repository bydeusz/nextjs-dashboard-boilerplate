"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavLink = ({ href, children, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center text-xs font-medium transition-all duration-200 text-gray-900 hover:bg-gray-100 hover:text-slate-700 rounded-md px-[10px] py-2 ${isActive ? "bg-gray-100 text-slate-700" : ""}`}>
      {children}
    </Link>
  );
};
