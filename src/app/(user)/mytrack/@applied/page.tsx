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
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
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
    <section className="flex flex-col bg-blue-50/60 rounded-4xl p-4 md:p-6 border border-blue-100/50 w-full overflow-hidden group/column">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shrink-0">
            <Building size={14} />
          </div>
          <span className="font-black text-xs md:text-sm uppercase tracking-wider truncate">
            Applied Applications
          </span>
        </div>
        <span className="bg-blue-600 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : appliedJobs.length}
        </span>
      </div>

      {/* Slider */}
      {!loading && appliedJobs.length > 1 && (
        <div className="flex items-center gap-1 text-[9px] text-blue-400 font-bold uppercase tracking-tighter mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} /> Swipe or use arrows to see more
        </div>
      )}

      <div className="relative w-full">
        {appliedJobs.length > 1 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="hidden lg:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md border border-blue-100 text-blue-600 opacity-0 group-hover/column:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-2 rounded-full shadow-md border border-blue-100 text-blue-600 opacity-0 group-hover/column:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-blue-400" />
          </div>
        ) : appliedJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {appliedJobs.map((job: JobApplicationPayload) => (
              <li
                key={job.id}
                className="min-w-70 md:min-w-[320px] snap-start list-none"
              >
                <Link
                  href={`/mytrack/details/${job.id}`}
                  scroll={false}
                  className="block"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-200 h-full">
                    <div className="flex justify-between mb-4 gap-4">
                      <div className="flex gap-3 min-w-0">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl uppercase">
                          {job.companyName?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-800 text-sm break-words">
                            {job.companyName}
                          </h4>
                          <p className="text-xs text-gray-400 break-words">
                            {job.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-slate-400 pr-1.5 text-md self-start mt-1 shrink-0">
                        {formatEmploymentType(job.employmentType || "")}
                      </div>
                    </div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} /> {job.location || "Remote"}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} />

                          <time>
                            {job.appliedAt
                              ? new Date(job.appliedAt).toDateString()
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
          <div className="flex flex-col items-center justify-center py-10 bg-white/40 rounded-2xl border border-dashed border-blue-200 text-center">
            <FileX size={40} className="text-blue-200 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              No Applied Applications
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
