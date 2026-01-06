"use client";

import { useRef, useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
}

export default function Modal({
  children,
  isOpen,
  onClose,
  maxWidth = "max-w-4xl",
}: ModalProps) {
  const overlay = useRef(null);

  // Mencegah scroll pada body saat modal terbuka
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-999 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={(e) => e.target === overlay.current && onClose()}
    >
      <div
        className={`relative w-full ${maxWidth} mx-auto animate-in fade-in zoom-in duration-200`}
      >
        {children}
      </div>
    </div>
  );
}
