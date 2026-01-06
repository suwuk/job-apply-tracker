"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useLoginModal } from "@/store/useLoginModal";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const { onOpen } = useLoginModal();

  // Helper untuk class link aktif
  const linkStyles = (path: string) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
    }`;

  // Fungsi untuk menutup menu mobile saat link diklik
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <Link
            href="/"
            className="text-2xl font-bold text-slate-800 tracking-tight shrink-0"
          >
            JobTrackr
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#home" className={linkStyles("/")}>
              Home
            </Link>
            <Link href="/#features" className={linkStyles("/#features")}>
              Features
            </Link>
            <Link
              href="/#testimonials"
              className={linkStyles("/#testimonials")}
            >
              Testimonials
            </Link>
            <Link href="#" className={linkStyles("/#")}>
              FAQs
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex rounded-full border-2 border-slate-100 hover:border-blue-400 transition p-0.5 focus:outline-none"
                  >
                    <Image
                      src={session?.user?.image || "/default-avatar.png"}
                      alt="Profile"
                      className="size-8 rounded-full bg-slate-100 object-cover"
                      height={32}
                      width={32}
                    />
                  </button>

                  {profileOpen && (
                    <>
                      {/* Invisible backdrop to close dropdown when clicking outside */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setProfileOpen(false)}
                      ></div>
                      
                      <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl bg-white py-2 shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 z-20">
                        <div className="px-4 py-2 border-b border-slate-50 md:hidden">
                           <p className="text-xs text-slate-400">Signed in as</p>
                           <p className="text-sm font-semibold truncate text-slate-700">{session?.user?.name}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="md:hidden block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="#"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          Your profile
                        </Link>
                        <Link
                          href="#"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          Settings
                        </Link>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => signOut()}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onOpen}
                className="bg-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 whitespace-nowrap"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition focus:outline-none"
                aria-label="Toggle Menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="size-6"
                >
                  {mobileMenuOpen ? (
                    <path
                      d="M6 18 18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <path
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/#home"
            onClick={closeMobileMenu}
            className="block py-3 text-slate-700 font-medium border-b border-slate-50 active:text-blue-600"
          >
            Home
          </Link>
          <Link
            href="/#features"
            onClick={closeMobileMenu}
            className="block py-3 text-slate-700 font-medium border-b border-slate-50 active:text-blue-600"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            onClick={closeMobileMenu}
            className="block py-3 text-slate-700 font-medium border-b border-slate-50 active:text-blue-600"
          >
            Testimonials
          </Link>
          <Link
            href="#"
            onClick={closeMobileMenu}
            className="block py-3 text-slate-700 font-medium active:text-blue-600"
          >
            FAQs
          </Link>
        </div>
      )}
    </nav>
  );
}