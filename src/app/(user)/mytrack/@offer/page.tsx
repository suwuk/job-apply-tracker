"use client";

import React, { useRef, useMemo } from "react";
import Link from "next/link";
import {
  Loader2,
  FileX,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
  PartyPopper,
  Briefcase,
  Clock,
  UserCheck,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { JobApplicationPayload, ApplicationStage } from "@/types/applications";

export default function OfferColumn() {
  const { jobs, loading } = useJobs();

  const offerJobs = useMemo(
    () => jobs.filter((job) => job.status === "offer"),
    [jobs]
  );

  const scrollRef = useRef<HTMLUListElement>(null);

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
    });
  };

  return (
    <section className="flex flex-col bg-emerald-50/40 rounded-3xl md:rounded-4xl p-4 md:p-6 border border-emerald-100 w-full overflow-hidden group/column relative">
      <header className="flex items-center justify-between mb-3 px-1 text-emerald-600">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="bg-emerald-500 p-1.5 rounded-lg text-white shrink-0"
            aria-hidden="true"
          >
            <UserCheck size={14} />
          </div>
          <h2 className="font-black text-[10px] md:text-sm uppercase tracking-wider truncate">
            Job Offers
          </h2>
        </div>
        <span className="bg-emerald-500 text-white text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold shadow-sm shrink-0">
          {loading ? "..." : offerJobs.length}
        </span>
      </header>

      {!loading && offerJobs.length > 1 && (
        <div className="flex lg:hidden items-center gap-1.5 text-[9px] text-emerald-400 font-bold uppercase mb-3 ml-1 animate-pulse">
          <MousePointer2 size={10} aria-hidden="true" /> Swipe for Good News
        </div>
      )}

      <div className="relative w-full">
        {/* Navigation Arrows - Always visible on Desktop LG */}
        {!loading && offerJobs.length > 1 && (
          <nav aria-label="Slider navigation" className="hidden lg:block">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-emerald-100 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white active:scale-90 group-hover/column:translate-x-1"
              style={{ marginLeft: "4px" }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl border border-emerald-100 text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white active:scale-90 group-hover/column:-translate-x-1"
              style={{ marginRight: "4px" }}
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}

        {loading ? (
          <div className="flex justify-center py-12" aria-busy="true">
            <Loader2 className="animate-spin text-emerald-400" />
          </div>
        ) : offerJobs.length > 0 ? (
          <ul
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory touch-pan-x p-0 m-0 list-none px-1"
          >
            {offerJobs.map((job) => (
              <li
                key={job.id}
                className="min-w-70 xs:min-w-[300px] md:min-w-[320px] snap-start"
              >
                <OfferCard job={job} formatDate={formatDate} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyOfferState />
        )}
      </div>
    </section>
  );
}

function OfferCard({
  job,
  formatDate,
}: {
  job: JobApplicationPayload;
  formatDate: (d: string | null | undefined) => string;
}) {
  const offerStage = job.stages?.find(
    (s: ApplicationStage) => s.type === "offer"
  );

  return (
    <Link
      href={`/mytrack/details/${job.id}`}
      scroll={false}
      className="block h-full group/card outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-3xl"
    >
      <article className="bg-white p-5 rounded-3xl border border-emerald-50 shadow-sm group-hover/card:shadow-lg group-hover/card:border-emerald-200 transition-all flex flex-col h-full relative overflow-hidden">
        {/* Background Decoration */}
        <div
          className="absolute -top-4 -right-4 text-emerald-50 opacity-40 rotate-12 pointer-events-none"
          aria-hidden="true"
        >
          <PartyPopper size={80} />
        </div>

        <header className="flex gap-3 mb-4 items-center relative z-10">
          <div
            className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-white text-xl shadow-md shrink-0 shadow-emerald-200"
            aria-hidden="true"
          >
            {job.companyName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-800 text-sm truncate m-0">
              {job.companyName}
            </h4>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tight m-0">
              Offer Received!
            </p>
          </div>
        </header>

        <div className="space-y-3 mb-4 relative z-10 flex-1">
          <div className="flex items-center gap-2 text-slate-600">
            <Briefcase
              size={13}
              className="text-emerald-400 shrink-0"
              aria-hidden="true"
            />
            <span className="text-xs font-bold truncate">{job.position}</span>
          </div>

          <div className="flex items-center gap-2 text-red-500 bg-red-50 px-2.5 py-1.5 rounded-xl w-fit border border-red-100/50">
            <Clock size={12} className="shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Expires:{" "}
              <time dateTime={offerStage?.scheduledAt || ""}>
                {formatDate(offerStage?.scheduledAt)}
              </time>
            </span>
          </div>
        </div>

        {offerStage?.notes && (
          <footer className="mt-auto bg-slate-50/80 p-3 rounded-2xl border border-slate-100 relative z-10">
            <p className="text-[10px] text-slate-500 italic line-clamp-2 m-0 leading-relaxed">
              &quot;{offerStage.notes}&quot;
            </p>
          </footer>
        )}
      </article>
    </Link>
  );
}

function EmptyOfferState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white/40 rounded-2xl border border-dashed border-emerald-200 text-center mx-1">
      <FileX size={40} className="text-emerald-200 mb-3" aria-hidden="true" />
      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 m-0">
        Waiting for Good News
      </p>
    </div>
  );
}
