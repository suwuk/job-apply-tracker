"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  Zap,
  MousePointer2,
  Calendar,
  Clipboard,
  ClipboardPenLine,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { JobApplicationPayload, ApplicationStage } from "@/types/applications";

export default function TestColumn() {
  const { jobs, loading } = useJobs();
  const scrollRef = useRef<HTMLUListElement>(null);

  const testJobs = useMemo(
    () => jobs.filter((job) => job.status === "test"),
    [jobs]
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll 70% dari lebar container untuk UX yang halus
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="flex flex-col bg-slate-50/80 rounded-3xl md:rounded-4xl p-4 md:p-6 border border-slate-200/50 w-full overflow-hidden group/column relative">
      <header className="flex items-center justify-between mb-3 px-1 text-slate-500">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="bg-slate-500 p-1.5 rounded-lg text-white shrink-0"
            aria-hidden="true"
          >
            <ClipboardPenLine size={14} />
          </div>
          <h2 className="font-black text-[10px] md:text-sm uppercase tracking-wider truncate">
            Skill Test
          </h2>
        </div>
        <span className="bg-slate-200 text-slate-600 text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : testJobs.length}
        </span>
      </header>

      {!loading && testJobs.length > 1 && (
        <div className="flex lg:hidden items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} aria-hidden="true" /> Swipe to see more
        </div>
      )}

      <div className="relative w-full">
        {/* Navigation Arrows - Visible on Desktop LG */}
        {!loading && testJobs.length > 1 && (
          <nav aria-label="Slider navigation" className="hidden lg:block">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-slate-100 text-slate-600 transition-all hover:bg-slate-600 hover:text-white active:scale-90 group-hover/column:translate-x-1"
              style={{ marginLeft: '4px' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-slate-100 text-slate-600 transition-all hover:bg-slate-600 hover:text-white active:scale-90 group-hover/column:-translate-x-1"
              style={{ marginRight: '4px' }}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}

        {loading ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <Loader2 className="animate-spin text-slate-400" />
          </div>
        ) : testJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x p-0 m-0 list-none px-1"
          >
            {testJobs.map((job: JobApplicationPayload) => {
              const testStage = job.stages?.find(
                (s: ApplicationStage) => s.type === "test"
              );

              return (
                <li
                  key={job.id}
                  className="min-w-70 xs:min-w-[300px] md:min-w-[320px] snap-start"
                >
                  <Link
                    href={`/mytrack/details/${job.id}`}
                    scroll={false}
                    className="block h-full group/card outline-none focus-visible:ring-2 focus-visible:ring-slate-400 rounded-3xl"
                  >
                    <article className="bg-white p-5 rounded-3xl shadow-sm border border-transparent group-hover/card:border-slate-300 transition-all h-full flex flex-col">
                      <header className="flex justify-between items-start mb-4">
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg md:text-xl uppercase shadow-inner"
                          aria-hidden="true"
                        >
                          {job.companyName?.charAt(0)}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] md:text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100/50">
                            {testStage?.title || "Skill Test"}
                          </span>
                        </div>
                      </header>

                      <div className="mb-4 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm md:text-base truncate m-0">
                          {job.companyName}
                        </h3>
                        <p className="text-[11px] md:text-xs text-slate-400 truncate m-0 font-medium">
                          {job.position}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4 flex-1">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar
                            size={14}
                            className="shrink-0 text-slate-400"
                            aria-hidden="true"
                          />
                          <time
                            className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight"
                            dateTime={testStage?.scheduledAt || ""}
                          >
                            {formatDate(testStage?.scheduledAt)}
                          </time>
                        </div>
                        {testStage?.notes && (
                          <div className="flex items-start gap-2 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <Clipboard
                              size={13}
                              className="shrink-0 mt-0.5 text-slate-400"
                              aria-hidden="true"
                            />
                            <p className="text-[10px] md:text-[11px] font-medium leading-relaxed line-clamp-2 italic m-0">
                              &quot;{testStage.notes}&quot;
                            </p>
                          </div>
                        )}
                      </div>

                      <footer className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full w-fit border border-amber-100/50">
                          <Zap
                            size={10}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                          <span className="text-[9px] font-black uppercase tracking-tighter">
                            Priority: {job.priority || "High"}
                          </span>
                        </div>
                      </footer>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/40 rounded-2xl border border-dashed border-slate-300 text-center mx-1">
            <FileX
              size={40}
              className="text-slate-200 mb-3"
              aria-hidden="true"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 m-0">
              No Skills Test
            </p>
          </div>
        )}
      </div>
    </section>
  );
}