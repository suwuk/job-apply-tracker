"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  Calendar,
  MapPin,
  Video,
  AlertCircle,
  MessagesSquare,
  Clipboard,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { JobApplicationPayload, ApplicationStage } from "@/types/applications";
import { getScheduleInfo } from "@/utils/date";

export default function InterviewColumn() {
  const { jobs, loading } = useJobs();
  const scrollRef = useRef<HTMLUListElement>(null);

  const interviewJobs = useMemo(
    () => jobs.filter((job) => job.status === "interview"),
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

  return (
    <section className="flex flex-col bg-orange-50/50 rounded-3xl md:rounded-4xl p-4 md:p-6 border border-orange-100 w-full overflow-hidden group/column relative">
      <header className="flex items-center justify-between mb-3 px-1 text-orange-600">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="bg-orange-500 p-1.5 rounded-lg text-white shrink-0"
            aria-hidden="true"
          >
            <MessagesSquare size={14} />
          </div>
          <h2 className="font-black text-[10px] md:text-sm uppercase tracking-wider truncate">
            Interview Phase
          </h2>
        </div>
        <span className="bg-orange-500 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : interviewJobs.length}
        </span>
      </header>

      {!loading && interviewJobs.length > 1 && (
        <div className="flex lg:hidden items-center gap-1.5 text-[9px] text-orange-400 font-bold uppercase mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} aria-hidden="true" /> Swipe to see schedule
        </div>
      )}

      <div className="relative w-full">
        {/* Navigation - Always visible on Hover Desktop */}
        {!loading && interviewJobs.length > 1 && (
          <nav aria-label="Slider navigation" className="hidden lg:block">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-orange-100 text-orange-600 transition-all hover:bg-orange-600 hover:text-white active:scale-90 group-hover/column:translate-x-1"
              style={{ marginLeft: "4px" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-orange-100 text-orange-600 transition-all hover:bg-orange-600 hover:text-white active:scale-90 group-hover/column:-translate-x-1"
              style={{ marginRight: "4px" }}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}

        {loading ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <Loader2 className="animate-spin text-orange-400" />
          </div>
        ) : interviewJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x p-0 m-0 list-none px-1"
          >
            {interviewJobs.map((job: JobApplicationPayload) => {
              const interviewStage = job.stages?.find(
                (s: ApplicationStage) => s.type === "interview"
              );
              const schedule = getScheduleInfo(
                interviewStage?.scheduledAt || null
              );

              return (
                <li
                  key={job.id}
                  className="min-w-70 sm:min-w-77.5 md:min-w-85 snap-start"
                >
                  <Link
                    href={`/mytrack/details/${job.id}`}
                    scroll={false}
                    className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-3xl group/card"
                  >
                    <article className="bg-white p-5 rounded-3xl shadow-sm border border-transparent group-hover/card:border-orange-200 transition-all h-full flex flex-col">
                      <div className="flex items-center mb-4 gap-2">
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-lg md:text-xl uppercase shadow-inner"
                          aria-hidden="true"
                        >
                          {job.companyName?.charAt(0)}
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-700 bg-orange-50 px-2.5 py-1 rounded-lg truncate">
                          {interviewStage?.title || "User Interview"}
                        </span>
                      </div>

                      <div className="mb-4 min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm md:text-base truncate m-0">
                          {job.companyName}
                        </h3>
                        <p className="text-[11px] md:text-xs text-slate-400 font-medium truncate m-0">
                          {job.position}
                        </p>
                      </div>

                      <div className="space-y-3 mb-4 flex-1">
                        <div
                          className={`p-3 rounded-2xl border transition-colors ${
                            schedule.isUrgent
                              ? "bg-red-50 border-red-100"
                              : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Calendar
                              size={14}
                              className={
                                schedule.isUrgent
                                  ? "text-red-500"
                                  : "text-slate-400"
                              }
                              aria-hidden="true"
                            />
                            <span
                              className={`text-[9px] md:text-[10px] font-black uppercase tracking-tight ${
                                schedule.isUrgent
                                  ? "text-red-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {schedule.isUrgent
                                ? `HURRY! IN ${schedule.daysLeft} DAYS`
                                : "SCHEDULED AT"}
                            </span>
                          </div>
                          <time
                            className={`text-xs md:text-sm font-black leading-tight block ${
                              schedule.isUrgent
                                ? "text-red-600 animate-pulse"
                                : "text-slate-800"
                            }`}
                          >
                            {schedule.text}
                          </time>
                        </div>

                        <div className="flex flex-col gap-2.5 px-1">
                          {interviewStage?.notes?.includes("http") ? (
                            <div className="flex items-center gap-2 text-blue-600">
                              <Video
                                size={14}
                                className="text-orange-400 shrink-0"
                                aria-hidden="true"
                              />
                              <span className="text-[10px] md:text-[11px] font-black truncate underline underline-offset-2">
                                Join Meeting Link
                              </span>
                            </div>
                          ) : interviewStage?.notes ? (
                            <div className="flex items-center gap-2 text-slate-500">
                              <Clipboard
                                size={13}
                                className="text-orange-400 shrink-0"
                                aria-hidden="true"
                              />
                              <p className="text-[10px] md:text-[11px] font-bold truncate tracking-tight m-0">
                                {interviewStage.notes}
                              </p>
                            </div>
                          ) : null}

                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin
                              size={14}
                              className="text-orange-400 shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-[10px] md:text-[11px] font-medium truncate">
                              {job.location || "Remote / Online"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <footer className="mt-auto pt-3 border-t border-slate-50 flex justify-between items-center">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-tighter sm:tracking-normal ${
                            schedule.isUrgent
                              ? "bg-red-500 text-white"
                              : "bg-orange-500 text-white shadow-sm shadow-orange-100"
                          }`}
                        >
                          {schedule.isUrgent ? (
                            <AlertCircle size={10} />
                          ) : (
                            <Clock size={10} />
                          )}
                          {schedule.isUrgent ? "Urgent" : "Confirmed"}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                          Priority: {job.priority}
                        </span>
                      </footer>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white/40 rounded-2xl border border-dashed border-orange-200 text-center mx-1">
            <FileX
              size={40}
              className="text-orange-200 mb-3"
              aria-hidden="true"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 m-0">
              No Scheduled Interviews
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
