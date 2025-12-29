"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ListTodo,
  Calendar,
  History,
  Settings,
  LogOut,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    { icon: <ListTodo size={20} />, label: "My Tracker", href: "/mytrack" },
    { icon: <Calendar size={20} />, label: "Interviews", href: "/interviews" },
    {
      icon: <History size={20} />,
      label: "Applications History",
      href: "/application-history",
    },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#2D4A8A] text-white rounded-md transition-colors active:scale-95"
      >
        {isOpen ? (
          <X size={20} aria-hidden="true" />
        ) : (
          <Menu size={20} aria-hidden="true" />
        )}
      </button>

      {/* Sidebar Aside */}
      <aside
        id="main-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen bg-[#2D4A8A] text-white flex flex-col transition-transform duration-300 ease-in-out transform 
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static shadow-2xl lg:shadow-none`}
      >
        <div className="p-6 flex items-center gap-2 text-xl font-bold">
          <div
            className="bg-white text-[#2D4A8A] p-1 rounded"
            aria-hidden="true"
          >
            <CheckCircle2 size={20} />
          </div>
          <span className="tracking-tight">JobTrackr</span>
        </div>

        <nav
          className="flex-1 px-4 py-4 overflow-y-auto"
          aria-label="Main Navigation"
        >
          <ul className="space-y-2 list-none p-0 m-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                    ${
                      isActive
                        ? "bg-white/10 shadow-inner"
                        : "hover:bg-white/5 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <footer className="p-6 border-t border-blue-800">
          <button
            className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors w-full group"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            />
            <span className="font-medium font-sans">Log out</span>
          </button>
        </footer>
      </aside>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );
}
