"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { X, Menu, Settings, LifeBuoy } from "lucide-react";

import { Brand } from "@/components/ui/labels/Brand";
import { NavLink } from "@/components/ui/actions/NavLink";
import { SearchInput } from "@/components/ui/inputs/Search";
import LanguageSwitcher from "@/components/ui/actions/LanguageSwitcher";
import LogoutButton from "@/components/ui/actions/LogoutButton";

interface DashboardProps {
  children: React.ReactNode;
}

const Dashboard = ({ children }: DashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            sidebarOpen,
            setSidebarOpen,
            toggleSidebar,
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface DashboardSidebarProps {
  children?: React.ReactNode;
  thumbnail?: React.ReactNode;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  toggleSidebar?: () => void;
}

const DashboardSidebar = ({
  children,
  thumbnail,
  sidebarOpen = false,
  toggleSidebar = () => {},
}: DashboardSidebarProps) => {
  const t = useTranslations("navigation.navbar");

  return (
    <div
      className={`p-4 fixed top-0 left-0 h-screen w-full md:w-64 border-r border-gray-200 md:flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:h-auto bg-white ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:static z-50 md:z-auto`}>
      <button
        type="button"
        className="absolute top-4 right-4 p-2 text-gray-500 md:hidden hover:text-gray-900"
        onClick={toggleSidebar}>
        <X className="size-6" />
      </button>

      <div className="flex justify-between mb-6">
        <Brand href="/" />
        <div className="hidden md:block">{thumbnail}</div>
      </div>

      <div className="mb-6">
        <SearchInput
          className="bg-gray-100 px-8 py-[9px] border border-gray-200 rounded-md text-xs text-gray-900 focus:border-gray-700"
          placeholder={t("search")}
          name="search"
          id="search"
          disabled={true}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
      </div>

      <nav className="flex-1 space-y-2">{children}</nav>
      <nav className="space-y-2 absolute bottom-0 left-0 w-full p-4 border-t">
        <LanguageSwitcher />
        <NavLink href="/settings">
          <Settings className="size-4 mr-2" />
          {t("links.settings")}
        </NavLink>
        <NavLink href="/support">
          <LifeBuoy className="size-4 mr-2" />
          {t("links.support")}
        </NavLink>
        <LogoutButton />
      </nav>
    </div>
  );
};

interface DashboardContentProps {
  children: React.ReactNode;
  toggleSidebar?: () => void;
}

const DashboardContent = ({
  children,
  toggleSidebar = () => {},
}: DashboardContentProps) => {
  return (
    <main className="flex flex-col flex-grow overflow-y-auto bg-slate-50">
      <button
        onClick={toggleSidebar}
        type="button"
        className="md:hidden absolute top-4 right-4">
        <Menu className="size-6 text-gray-900" />
      </button>
      <div>{children}</div>
    </main>
  );
};

interface DashboardNavigationProps {
  children: React.ReactNode;
}

const DashboardNavigation = ({ children }: DashboardNavigationProps) => {
  return <nav className="flex-1 space-y-2">{children}</nav>;
};

export { Dashboard, DashboardSidebar, DashboardContent, DashboardNavigation };
