"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useLoginModal } from "@/store/useLoginModal";

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

	return (
		<nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
			<div className="mx-auto max-w-7xl px-6 lg:px-10">
				<div className="flex h-20 items-center justify-between">
					{/* Logo Section */}

					<Link
						href="/"
						className="text-2xl font-bold text-slate-800 tracking-tight"
					>
						JobTrackr
					</Link>

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex items-center space-x-8">
						<Link href="/#home" className={linkStyles("/")}>
							Home
						</Link>
						<Link href="/#features" className={linkStyles("/about")}>
							Features
						</Link>
						<Link href="/#testimonials" className={linkStyles("/product")}>
							Testimonials
						</Link>
						<Link href="#" className={linkStyles("/about/profile")}>
							FAQs
						</Link>
					</div>

					{/* Right Side: Auth Section */}
					<div className="flex items-center gap-4">
						{status === "authenticated" ? (
							<div className="flex items-center gap-3">
								{/* Notification Button */}
								<button className="p-2 text-slate-400 hover:text-blue-600 transition">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										className="size-5"
									>
										<path
											d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>

								{/* Profile Dropdown */}
								<div className="relative">
									<button
										onClick={() => setProfileOpen(!profileOpen)}
										className="flex rounded-full border-2 border-slate-100 hover:border-blue-400 transition p-0.5"
									>
										<img
											src={session?.user?.image || ""}
											alt="Profile"
											className="size-8 rounded-full bg-slate-100"
										/>
									</button>

									{profileOpen && (
										<div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl bg-white py-2 shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5">
											<Link
												href="#"
												className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
											>
												Your profile
											</Link>
											<Link
												href="#"
												className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
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
									)}
								</div>
							</div>
						) : (
							<button
								onClick={onOpen}
								className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 inline-block text-center"
							>
								Login
							</button>
						)}

						{/* Mobile Menu Button */}
						<div className="md:hidden">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition"
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
				<div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-2">
					<Link
						href="/"
						className="block py-2 text-slate-700 font-medium border-b border-slate-50"
					>
						Home
					</Link>
					<Link
						href="/about"
						className="block py-2 text-slate-700 font-medium border-b border-slate-50"
					>
						Features
					</Link>
					<Link
						href="/product"
						className="block py-2 text-slate-700 font-medium border-b border-slate-50"
					>
						Testimonials
					</Link>
					<Link
						href="/about/profile"
						className="block py-2 text-slate-700 font-medium"
					>
						FAQs
					</Link>
				</div>
			)}
		</nav>
	);
}
