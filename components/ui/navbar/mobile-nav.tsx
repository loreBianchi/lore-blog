"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../../theme-toggle";
import { NavItem } from "@/types/navigation";

interface MobileNavProps {
  items?: NavItem[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function MobileNav({ items = [], mobileMenuOpen, setMobileMenuOpen }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
      }`}
    >
      <nav className="flex flex-col border-t border-green-400/30 pt-4">
        {items.map((item) => {
          const isActive = pathname === item.path && !item.isExternal;

          if (item.isExternal) {
            return (
              <Link
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-2 hover:bg-green-400/10 transition-colors text-green-400/70 hover:text-green-300 flex items-center justify-between"
              >
                <span>{item.name}</span>
                <span className="text-xs">↗</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`py-3 px-2 hover:bg-green-400/10 transition-colors flex items-center justify-between ${
                isActive
                  ? "text-green-300 bg-green-400/5"
                  : "text-green-400/70 hover:text-green-300"
              }`}
            >
              <span className="flex items-center gap-2">
                {isActive && <span>{">"}</span>}
                {item.name}
              </span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 border border-green-400/30 text-green-400/70">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
        <div className="py-3 px-2 border-t border-green-400/30 mt-2">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
