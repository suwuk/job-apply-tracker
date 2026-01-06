import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyTrackMainPage() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
          Application Board
        </h2>
        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
          Track your career journey
        </p>
      </div>

      <Link
        href="/mytrack/add"
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4A85F6] text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-600 transition active:scale-95"
      >
        <Plus size={18} strokeWidth={3} />
        Add Application
      </Link>
    </div>
  );
}
