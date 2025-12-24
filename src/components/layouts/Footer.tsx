export default function Footer() {
	return (
		/* Gunakan bg-white agar selaras dengan landing page */
		<footer className="bg-white border-t border-slate-100 py-10 px-6 md:px-10">
			<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
				<div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs md:text-sm text-slate-500 font-medium">
					<a href="#" className="hover:text-blue-600 transition">
						Privacy Policy
					</a>
					<a href="#" className="hover:text-blue-600 transition">
						Terms of Service
					</a>
					<a href="#" className="hover:text-blue-600 transition">
						Contact Us
					</a>
				</div>
				<p className="text-xs md:text-sm text-slate-400">
					© 2024 JobTrackr. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
