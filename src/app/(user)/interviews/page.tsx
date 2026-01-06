"use client";

import React, { useState, useMemo } from "react";
import {
  Video,
  Calendar,
  Clock,
  ChevronRight,
  Loader2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useJobs } from "@/context/JobContext";
import ApplicationDetailContent from "@/components/ApplicationDetailContent";
import {
  JobApplicationPayload,
  ApplicationStatus,
  ApplicationStage,
} from "@/types/applications";
import { formatFullDate, formatTimeOnly } from "@/utils/date";

export default function InterviewsPage() {
  const { jobs, loading } = useJobs();
  const [selectedJob, setSelectedJob] = useState<JobApplicationPayload | null>(
    null
  );

  const interviewJobs = useMemo(() => {
    return jobs
      .filter(
        (job) =>
          job.stages?.some((s: ApplicationStage) => s.type === "interview") &&
          job.status !== ApplicationStatus.REJECTED
      )
      .sort((a, b) => {
        const dateA = new Date(
          a.stages?.find((s: ApplicationStage) => s.type === "interview")
            ?.scheduledAt || 0
        ).getTime();
        const dateB = new Date(
          b.stages?.find((s: ApplicationStage) => s.type === "interview")
            ?.scheduledAt || 0
        ).getTime();
        return dateA - dateB;
      });
  }, [jobs]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-50"
        aria-busy="true"
      >
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Upcoming Interviews
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                Persiapkan dirimu untuk tahap wawancara selanjutnya.
              </p>
            </div>
            <div className="bg-orange-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-orange-100 flex items-center gap-3 w-fit">
              <Calendar size={20} aria-hidden="true" />
              <span className="font-black text-lg">
                {interviewJobs.length} Scheduled
              </span>
            </div>
          </div>
        </header>

        {interviewJobs.length > 0 ? (
          <section className="space-y-4" aria-label="Daftar Jadwal Interview">
            <ul className="space-y-4">
              {interviewJobs.map((job) => (
                <li key={job.id}>
                  <InterviewCard
                    job={job}
                    onOpenDetail={() => setSelectedJob(job)}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Modal Detail */}
      {selectedJob && (
        <aside
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl">
            <ApplicationDetailContent
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              isFullPage={false}
            />
          </div>
        </aside>
      )}
    </main>
  );
}

interface CardProps {
  job: JobApplicationPayload;
  onOpenDetail: () => void;
}

function InterviewCard({ job, onOpenDetail }: CardProps) {
  const interviewStage = job.stages?.find((s) => s.type === "interview");
  const isLink = interviewStage?.notes?.startsWith("http");

  return (
    <article className="bg-white rounded-4xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Company Info */}
        <div className="flex items-center gap-5 lg:w-1/3">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
            {job.companyName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-800 text-lg leading-tight truncate">
              {job.companyName}
            </h3>
            <p className="text-slate-500 font-bold text-sm truncate">
              {job.position}
            </p>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="flex flex-wrap gap-4 md:gap-8 lg:w-1/3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Date
              </p>
              <time
                className="text-sm font-bold text-slate-700"
                dateTime={interviewStage?.scheduledAt || ""}
              >
                {formatFullDate(interviewStage?.scheduledAt)}
              </time>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Time
              </p>
              <p className="text-sm font-bold text-slate-700">
                {formatTimeOnly(interviewStage?.scheduledAt)} WIB
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-1/3 border-t lg:border-none pt-4 lg:pt-0">
          {isLink ? (
            <a
              href={interviewStage?.notes || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              <Video size={16} /> Join Meeting
            </a>
          ) : (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold italic">
              <MessageCircle size={16} />{" "}
              {interviewStage?.notes || "No link provided"}
            </div>
          )}
          <button
            onClick={onOpenDetail}
            aria-label="View Details"
            className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-center px-6">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Calendar size={40} className="text-slate-200" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-black text-slate-800">
        No interviews scheduled
      </h2>
      <p className="text-slate-400 font-medium mt-2 max-w-xs">
        Jangan patah semangat! Terus kirim lamaran dan asah kemampuanmu.
      </p>
      <Link
        href="/mytrack"
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
      >
        Check My Tracker
      </Link>
    </div>
  );
}
