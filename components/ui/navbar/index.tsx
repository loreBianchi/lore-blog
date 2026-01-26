"use client";

import { useState, useEffect } from "react";
import { DesktopNav } from "./desktop-nav";
import { NavItem } from "@/types/navigation";
import { MobileNav } from "./mobile-nav";
import { MobileMenuBtn } from "./mobile-menu-btn";
import { ThemeToggle } from "@/components/ui/theme-toggle";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: NavItem[] = [
  { path: "/", name: "home", isExternal: false },
  { path: "/experiments", name: "experiments", badge: "new", isExternal: false },
  { path: "https://blog.lorebianchi.com", name: "blog", isExternal: true },
  { path: "/contact", name: "contact", isExternal: false },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="px-4 py-3">
      <div className="max-w-4xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-1 flex items-center justify-between">
          <Link
            href="/" 
            className="hover:text-green-300 transition-colors cursor-pointer"
          >
            <h1 className="text-xl font-bold tracking-wide">
              {">"} lorebianchi.com
            </h1>
          </Link>

          {/* Mobile Menu Button */}
          <MobileMenuBtn isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <ThemeToggle className="hidden md:block" />
        </div>

        {/* Desktop Navigation */}
        <DesktopNav items={navItems} />
        {/* Mobile Navigation */}
        <MobileNav 
          items={navItems} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
      </div>
    </header>
  );
}