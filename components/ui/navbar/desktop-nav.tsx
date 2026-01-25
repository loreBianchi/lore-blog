"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "@/types/navigation";

interface DesktopNavProps {
  items?: NavItem[];
}

export function DesktopNav({ items = [] }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {items.map((item) => {
        const isActive = pathname === item.path && !item.isExternal;

        if (item.isExternal) {
          return (
            <a
              key={item.path}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group hover:text-navbar-active transition-colors cursor-pointer text-navbar-text"
            >
              <span className="flex items-center gap-2">
                {item.name}
                <span className="text-xs">↗</span>
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`
                  relative group hover:text-navbar-active transition-colors cursor-pointer
                  ${isActive ? "text-navbar-text-active" : "text-navbar-text"}
                `}
          >
            <span className="flex items-center gap-2">
              {isActive && <span className="text-navbar-text-active">{">"}</span>}
              {item.name}
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 border border-navbar text-navbar-text">
                  {item.badge}
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
