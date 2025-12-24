"use client";
import { useState } from "react";

interface AlertProps {
	id: string;
	type?: "blue" | "red" | "green" | "yellow" | "gray";
	message: React.ReactNode;
}

export default function Alert({ id, type = "blue", message }: AlertProps) {
	const [open, setOpen] = useState(true);

	if (!open) return null;

	const colors = {
		blue: {
			bg: "bg-blue-50 dark:bg-gray-800",
			text: "text-blue-800 dark:text-blue-400",
			btn: "bg-blue-50 text-blue-500 hover:bg-blue-200 focus:ring-blue-400 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700",
		},
		red: {
			bg: "bg-red-50 dark:bg-gray-800",
			text: "text-red-800 dark:text-red-400",
			btn: "bg-red-50 text-red-500 hover:bg-red-200 focus:ring-red-400 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700",
		},
		green: {
			bg: "bg-green-50 dark:bg-gray-800",
			text: "text-green-800 dark:text-green-400",
			btn: "bg-green-50 text-green-500 hover:bg-green-200 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700",
		},
		yellow: {
			bg: "bg-yellow-50 dark:bg-gray-800",
			text: "text-yellow-800 dark:text-yellow-300",
			btn: "bg-yellow-50 text-yellow-500 hover:bg-yellow-200 focus:ring-yellow-400 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700",
		},
		gray: {
			bg: "bg-gray-50 dark:bg-gray-800",
			text: "text-gray-800 dark:text-gray-300",
			btn: "bg-gray-50 text-gray-500 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
		},
	};

	return (
		<div
			id={id}
			className={`flex items-center p-4 mb-4 rounded-lg ${colors[type].bg} ${colors[type].text}`}
			role="alert"
		>
			{/* Icon */}
			<svg
				className="shrink-0 w-4 h-4"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
			</svg>
			<span className="sr-only">Info</span>

			{/* Content */}
			<div className="ms-3 text-sm font-medium">{message}</div>

			{/* Close Button */}
			<button
				type="button"
				onClick={() => setOpen(false)}
				className={`ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${colors[type].btn}`}
				aria-label="Close"
			>
				<span className="sr-only">Close</span>
				<svg
					className="w-3 h-3"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 14 14"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
					/>
				</svg>
			</button>
		</div>
	);
}
