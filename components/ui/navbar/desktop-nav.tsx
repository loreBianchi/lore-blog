"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from ".";
import { NavItem } from "@/types/navigation";

interface DesktopNavProps {
  items?: Record<string, NavItem>;
}

export function DesktopNav({ items = navItems }) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {Object.entries(items).map(([path, { name, icon, badge }]) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            href={path}
            className={`
                      relative group px-4 py-2 rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }
                    `}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm">{icon}</span>
              <span className="font-medium capitalize">{name}</span>
              {badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white">
                  {badge}
                </span>
              )}
            </span>

            {/* Underline animation */}
            <span
              className={`
                      absolute bottom-0 left-1/2 transform -translate-x-1/2 
                      h-0.5 w-0 bg-blue-500 group-hover:w-8 transition-all duration-300
                      ${isActive ? "w-8" : ""}
                    `}
            />
          </Link>
        );
      })}
    </nav>
  );
}
