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
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
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
    <section className="flex flex-col bg-red-50/40 rounded-4xl p-4 md:p-6 border border-red-100 w-full overflow-hidden group/column">
      <header className="flex items-center justify-between mb-2 px-1 text-red-600">
        <div className="flex items-center gap-2">
          <div
            className="bg-red-500 p-1.5 rounded-lg text-white shrink-0"
            aria-hidden="true"
          >
            <AlertCircle size={14} />
          </div>
          <h2 className="font-black text-xs md:text-sm uppercase tracking-wider">
            Rejected
          </h2>
        </div>
        <span className="bg-red-500 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
          {loading ? "..." : rejectedJobs.length}
        </span>
      </header>

      {!loading && rejectedJobs.length > 1 && (
        <div className="flex items-center gap-1 text-[9px] text-red-400 font-bold uppercase mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} aria-hidden="true" /> Review for evaluation
        </div>
      )}

      <div className="relative w-full">
        {rejectedJobs.length > 1 && (
          <nav aria-label="Slider navigation" className="hidden lg:block">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md border text-red-600 opacity-0 group-hover/column:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md border text-red-600 opacity-0 group-hover/column:opacity-100 transition-opacity hover:bg-red-600 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </nav>
        )}

        {loading ? (
          <div className="flex justify-center py-10" aria-busy="true">
            <Loader2 className="animate-spin text-red-400" />
          </div>
        ) : rejectedJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory list-none p-0 m-0"
          >
            {rejectedJobs.map((job) => (
              <li key={job.id} className="min-w-70 md:min-w-[320px] snap-start">
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
      className="block h-full group/card"
    >
      <article className="bg-white p-5 rounded-3xl border border-red-50 shadow-sm hover:shadow-md transition-all flex flex-col h-full grayscale-[0.3] hover:grayscale-0">
        <header className="flex gap-3 mb-4 items-center">
          <div
            className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xl shadow-inner"
            aria-hidden="true"
          >
            {job.companyName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-700 text-sm truncate">
              {job.companyName}
            </h4>
            <p className="text-[10px] text-red-400 font-black uppercase">
              Not This Time
            </p>
          </div>
        </header>

        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={13} className="text-red-300" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-tight">
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

        <footer className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>{job.position}</span>
        </footer>
      </article>
    </Link>
  );
}

function EmptyRejectedState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-white/40 rounded-2xl border border-dashed border-red-200 text-center">
      <FileX size={40} className="text-red-100 mb-2" aria-hidden="true" />
      <p className="text-[10px] font-black uppercase tracking-widest text-red-300 m-0">
        Keep Moving Forward!
      </p>
    </div>
  );
}
