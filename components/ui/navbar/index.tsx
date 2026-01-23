"use client";

import { ThemeToggle } from "../../theme-toggle";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DesktopNav } from "./desktop-nav";
import { NavItem } from "@/types/navigation";
import { MobileNav } from "./mobile-nav";

export const navItems: Record<string, NavItem> = {
  "/": {
    name: "home",
    icon: "🏠",
  },
  "/experiments": {
    name: "experiments",
    icon: "🔬",
    badge: "New",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 max-w-xl mx-auto ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800"
          : "bg-transparent"
      }`}
    >
      <div>
        <div className="flex items-center justify-between h-16">
          <DesktopNav />

          {/* Right Side - Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block mr-4">
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-4 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300
                    ${mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"}
                  `}
                />
                <span
                  className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-4 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300
                    ${mobileMenuOpen ? "opacity-0" : "opacity-100"}
                  `}
                />
                <span
                  className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-4 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300
                    ${mobileMenuOpen ? "-rotate-45" : "translate-y-1"}
                  `}
                />
              </div>
            </button>
          </div>
        </div>

        <MobileNav
          items={navItems}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />  
      </div>
    </header>
  );
}
