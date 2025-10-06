"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const auth = useSelector((state) => state.auth);
  const isLoggedIn = !!auth.accessToken;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/alerts", label: "Missing" },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="border-b bg-card">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Khoya Home"
          onClick={closeMobileMenu}
        >
          <Image
            src="/images/khoya-removebg-preview.png"
            width={28}
            height={28}
            alt=""
            className="rounded-sm border"
          />
          <span className="font-semibold tracking-tight">Khoya</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors",
                pathname === l.href && "text-foreground"
              )}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-sm rounded-md px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm rounded-md px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <LogoutButton />
          )}
          <Link
            href="/report"
            className="text-sm rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Report
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t bg-card"
        >
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMobileMenu}
                className={cn(
                  "text-sm text-muted-foreground hover:text-foreground transition-colors py-2",
                  pathname === l.href && "text-foreground font-medium"
                )}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t pt-3 mt-2 flex flex-col gap-3">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="text-sm text-center rounded-md px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="text-sm text-center rounded-md px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <LogoutButton />
              )}
              <Link
                href="/report"
                onClick={closeMobileMenu}
                className="text-sm text-center rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Report
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
