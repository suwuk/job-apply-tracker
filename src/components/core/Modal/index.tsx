"use client";

import { useRef } from "react";

export default function Modal({ children, isOpen, onClose }: any) {
	const overlay = useRef(null);
	if (!isOpen) return null;

	return (
		<div
			ref={overlay}
			className="fixed inset-0 z-999 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
			onClick={(e) => e.target === overlay.current && onClose()}
		>
			<div className="relative w-full max-w-md mx-auto animate-in fade-in zoom-in duration-200">
				{children}
			</div>
		</div>
	);
}
