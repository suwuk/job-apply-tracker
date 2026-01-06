"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  MessageSquareX,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { JobApplicationPayload, ApplicationStage } from "@/types/applications";

export default function RejectedColumn() {
  const { jobs, loading } = useJobs();

  const rejectedJobs = useMemo(
    () => jobs.filter((job) => job.status === "rejected"),
    [jobs]
  );

  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll 70% dari lebar container agar perpindahan kartu halus
      const scrollAmount = clientWidth * 0.7;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="flex flex-col bg-red-50/40 rounded-3xl md:rounded-4xl p-4 md:p-6 border border-red-100 w-full overflow-hidden group/column relative">
      <header className="flex items-center justify-between mb-3 px-1 text-red-600">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="bg-red-500 p-1.5 rounded-lg text-white shrink-0"
            aria-hidden="true"
          >
            <AlertCircle size={14} />
          </div>
          <h2 className="font-black text-[10px] md:text-sm uppercase tracking-wider truncate">
            Rejected
          </h2>
        </div>
        <span className="bg-red-500 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : rejectedJobs.length}
        </span>
      </header>

      {!loading && rejectedJobs.length > 1 && (
        <div className="flex lg:hidden items-center gap-1.5 text-[9px] text-red-400 font-bold uppercase mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} aria-hidden="true" /> Review for evaluation
        </div>
      )}

      <div className="relative w-full">
        {/* Navigation Arrows - Visible on Desktop LG */}
        {!loading && rejectedJobs.length > 1 && (
          <nav aria-label="Slider navigation" className="hidden lg:block">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-red-100 text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-90 group-hover/column:translate-x-1"
              style={{ marginLeft: "4px" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-red-100 text-red-600 transition-all hover:bg-red-600 hover:text-white active:scale-90 group-hover/column:-translate-x-1"
              style={{ marginRight: "4px" }}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}

        {loading ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <Loader2 className="animate-spin text-red-400" />
          </div>
        ) : rejectedJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x p-0 m-0 list-none px-1"
          >
            {rejectedJobs.map((job) => (
              <li
                key={job.id}
                className="min-w-70 xs:min-w-[300px] md:min-w-[320px] snap-start"
              >
                <RejectedCard job={job} formatDate={formatDate} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyRejectedState />
        )}
      </div>
    </section>
  );
}

function RejectedCard({
  job,
  formatDate,
}: {
  job: JobApplicationPayload;
  formatDate: (d: string | null | undefined) => string;
}) {
  const rejectedStage = job.stages?.find(
    (s: ApplicationStage) => s.type === "rejected"
  );

  return (
    <Link
      href={`/mytrack/details/${job.id}`}
      scroll={false}
      className="block h-full group/card outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-3xl"
    >
      <article className="bg-white p-5 rounded-3xl border border-red-50 shadow-sm group-hover/card:shadow-md group-hover/card:border-red-200 transition-all flex flex-col h-full grayscale-[0.3] hover:grayscale-0">
        <header className="flex gap-3 mb-4 items-center">
          <div
            className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner shrink-0"
            aria-hidden="true"
          >
            {job.companyName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-700 text-sm truncate m-0">
              {job.companyName}
            </h4>
            <p className="text-[10px] text-red-400 font-black uppercase tracking-tight m-0">
              Not This Time
            </p>
          </div>
        </header>

        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar
              size={13}
              className="text-red-300 shrink-0"
              aria-hidden="true"
            />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight">
              Rejected At:{" "}
              <time dateTime={rejectedStage?.completedAt || ""}>
                {formatDate(rejectedStage?.completedAt)}
              </time>
            </span>
          </div>

          {rejectedStage?.notes && (
            <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100/50 flex gap-2 items-start">
              <MessageSquareX
                size={14}
                className="text-red-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-[10px] text-red-700/80 font-semibold leading-relaxed line-clamp-3 italic m-0">
                &quot;{rejectedStage.notes}&quot;
              </p>
            </div>
          )}
        </div>

        <footer className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest min-w-0">
          <span className="truncate">{job.position}</span>
        </footer>
      </article>
    </Link>
  );
}

function EmptyRejectedState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white/40 rounded-2xl border border-dashed border-red-200 text-center mx-1">
      <FileX size={40} className="text-red-100 mb-3" aria-hidden="true" />
      <p className="text-[10px] font-black uppercase tracking-widest text-red-300 m-0">
        Keep Moving Forward!
      </p>
    </div>
  );
}
