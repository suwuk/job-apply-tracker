"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  Building,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { ApplicationStatus, JobApplicationPayload } from "@/types/applications";

export default function AppliedColumn() {
  const { jobs, loading } = useJobs();

  const appliedJobs = useMemo(
    () => jobs.filter((job) => job.status === ApplicationStatus.APPLIED),
    [jobs]
  );

  const scrollRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const formatEmploymentType = (str: string) => {
    if (!str) return "";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <section className="flex flex-col bg-blue-50/60 rounded-3xl md:rounded-4xl p-4 md:p-6 border border-blue-100/50 w-full overflow-hidden group/column relative">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-blue-600 min-w-0">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shrink-0">
            <Building size={14} />
          </div>
          <h2 className="font-black text-[10px] md:text-sm uppercase tracking-wider truncate">
            Applied Applications
          </h2>
        </div>
        <span className="bg-blue-600 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : appliedJobs.length}
        </span>
      </div>

      {/* Slider Instruction Mobile */}
      {!loading && appliedJobs.length > 1 && (
        <div className="flex lg:hidden items-center gap-1.5 text-[9px] text-blue-400 font-bold uppercase tracking-tight mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} /> Swipe to see more
        </div>
      )}

      <div className="relative w-full">
        {!loading && appliedJobs.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 group-hover/column:translate-x-1"
              style={{ marginLeft: "4px" }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all active:scale-90 group-hover/column:-translate-x-1"
              style={{ marginRight: "4px" }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        ) : appliedJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x px-1"
          >
            {appliedJobs.map((job: JobApplicationPayload) => (
              <li
                key={job.id}
                className="min-w-70 sm:min-w-75 md:min-w-[320px] snap-start list-none first:ml-1 last:mr-1"
              >
                <Link
                  href={`/mytrack/details/${job.id}`}
                  scroll={false}
                  className="block h-full group/card"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-sm group-hover/card:shadow-md transition-all border border-transparent group-hover/card:border-blue-200 h-full flex flex-col">
                    <div className="flex justify-between mb-4 gap-3">
                      <div className="flex gap-3 min-w-0">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl uppercase shadow-inner">
                          {job.companyName?.charAt(0)}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          <h4 className="font-bold text-gray-800 text-sm truncate">
                            {job.companyName}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {job.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-slate-400 text-[9px] font-bold uppercase self-start mt-1 shrink-0 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {formatEmploymentType(job.employmentType || "")}
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-50">
                      <div className="flex flex-col gap-2.5 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                        <div className="flex items-center gap-2 truncate">
                          <MapPin
                            size={12}
                            className="text-blue-400 shrink-0"
                          />
                          <span className="truncate">
                            {job.location || "Remote"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={12}
                            className="text-blue-400 shrink-0"
                          />
                          <time>
                            {job.appliedAt
                              ? new Date(job.appliedAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/40 rounded-2xl border border-dashed border-blue-200 text-center mx-1">
            <FileX size={40} className="text-blue-200 mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              No Applied Applications
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
