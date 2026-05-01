"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { createContext, useContext, useMemo, Children, isValidElement } from "react";

interface TabsProps {
  children: React.ReactNode;
}

interface TabProps {
  href: string;
  children: React.ReactNode;
}

const TabsContext = createContext<{ activeHref: string | null }>({
  activeHref: null,
});

export const Tabs = ({ children }: TabsProps) => {
  const pathname = usePathname();

  const activeHref = useMemo(() => {
    const hrefs: string[] = [];
    Children.forEach(children, (child) => {
      if (!isValidElement(child)) {
        return;
      }
      const { href } = child.props as Partial<TabProps>;
      if (typeof href === "string") {
        hrefs.push(href);
      }
    });

    return (
      hrefs
        .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
        .sort((a, b) => b.length - a.length)[0] ?? null
    );
  }, [children, pathname]);

  return (
    <TabsContext.Provider value={{ activeHref }}>
      <div className="w-full overflow-x-auto">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-10">{children}</nav>
        </div>
      </div>
    </TabsContext.Provider>
  );
};

export const Tab = ({ href, children }: TabProps) => {
  const { activeHref } = useContext(TabsContext);
  const isActive = activeHref === href;

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
