"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from ".";
import { ThemeToggle } from "../../theme-toggle";
import { useState } from "react";
import { NavItem } from "@/types/navigation";

interface MobileNavProps {
  items?: Record<string, NavItem>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function MobileNav({ items = navItems, mobileMenuOpen, setMobileMenuOpen }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <div
      className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
          `}
    >
      <nav className="py-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col space-y-2">
          {Object.entries(items).map(([path, { name, icon, badge }]) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                        flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                        ${
                          isActive
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }
                      `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{icon}</span>
                  <span className="font-medium capitalize">{name}</span>
                </div>
                {badge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Theme Toggle Mobile */}
          <div className="px-4 py-3">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
}
