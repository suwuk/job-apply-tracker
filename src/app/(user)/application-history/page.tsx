"use client";

import React, { useState } from "react";
import {
  Trophy,
  Clock,
  FileX,
  Calendar,
  ChevronRight,
  Search,
  Loader2,
} from "lucide-react";
import { useJobs } from "@/context/JobContext";
import ApplicationDetailContent from "@/components/ApplicationDetailContent";
import { formatDateID } from "@/utils/date";
import { JobApplicationPayload, TabButtonProps } from "@/types/applications";

export default function ApplicationHistoryPage() {
  const { jobs, loading, refreshJobs } = useJobs();
  const [activeTab, setActiveTab] = useState<
    "accepted" | "progress" | "rejected"
  >("accepted");
  const [selectedJob, setSelectedJob] = useState<JobApplicationPayload | null>(
    null
  );

  const categories = {
    accepted: jobs.filter((j) => j.status === "accepted"),
    progress: jobs.filter((j) =>
      ["applied", "test", "interview", "offer"].includes(j.status)
    ),
    rejected: jobs.filter((j) => j.status === "rejected"),
  };

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
    <main className="min-h-screen bg-slate-50/50 p-4 sm:p-6 md:p-12 font-sans relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Application History
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">
            Pantau seluruh rekam jejak lamaran kerja Anda.
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="mb-10 w-full lg:w-fit" aria-label="Status lamaran">
          <div className="flex bg-white p-1 md:p-2 rounded-2xl md:rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex w-full items-center gap-1" role="tablist">
              <TabButton
                active={activeTab === "accepted"}
                onClick={() => setActiveTab("accepted")}
                icon={<Trophy size={14} className="sm:w-4 sm:h-4" />}
                label="Diterima"
                count={categories.accepted.length}
                color="emerald"
              />
              <TabButton
                active={activeTab === "progress"}
                onClick={() => setActiveTab("progress")}
                icon={<Clock size={14} className="sm:w-4 sm:h-4" />}
                label="Progress"
                count={categories.progress.length}
                color="blue"
              />
              <TabButton
                active={activeTab === "rejected"}
                onClick={() => setActiveTab("rejected")}
                icon={<FileX size={14} className="sm:w-4 sm:h-4" />}
                label="Rejected"
                count={categories.rejected.length}
                color="red"
              />
            </div>
          </div>
        </nav>

        {/* List Content */}
        <section aria-labelledby="application-list-title">
          <h2 id="application-list-title" className="sr-only">
            Daftar Lamaran Kerja
          </h2>

          {categories[activeTab as keyof typeof categories].length > 0 ? (
            <ul className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {categories[activeTab as keyof typeof categories].map((job) => (
                <li key={job.id}>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full text-left bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 group cursor-pointer"
                    aria-haspopup="dialog"
                  >
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg md:text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0">
                        {job.companyName?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-800 text-sm md:text-lg leading-tight truncate">
                          {job.companyName}
                        </h3>
                        <p className="text-slate-500 font-bold text-[10px] md:text-sm truncate">
                          {job.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-16 border-t sm:border-none pt-3 sm:pt-0">
                      <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Applied Date
                        </p>
                        <time
                          dateTime={job.appliedAt ?? undefined}
                          className="flex items-center gap-1.5 md:gap-2 text-slate-700 font-bold text-[10px] md:text-sm whitespace-nowrap"
                        >
                          <Calendar
                            size={12}
                            className="text-slate-300 sm:w-3.5 sm:h-3.5"
                          />{" "}
                          {formatDateID(job.appliedAt)}
                        </time>
                      </div>
                      <div className="space-y-0.5 md:space-y-1 text-right sm:text-left">
                        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Status
                        </p>
                        <span
                          className={`text-[8px] md:text-[9px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-tighter shadow-sm inline-block ${
                            job.status === "accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : job.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div
                        className="hidden sm:flex items-center"
                        aria-hidden="true"
                      >
                        <ChevronRight
                          size={20}
                          className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl md:rounded-[3rem] border-2 border-dashed border-slate-200 text-center px-6">
              <Search
                size={40}
                className="text-slate-200 mb-4"
                aria-hidden="true"
              />
              <p className="text-lg font-black text-slate-800 underline">
                No applications found
              </p>
              <p className="text-slate-400 font-medium mt-2 text-sm italic">
                &quot;Apply some job bro!&quot;
              </p>
            </div>
          )}
        </section>
      </div>

      {/* MODAL OVERLAY */}
      {selectedJob && (
        <aside
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2.5rem] shadow-2xl">
            <ApplicationDetailContent
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              isFullPage={false}
              refresh={refreshJobs}
            />
          </div>
        </aside>
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  color,
}: TabButtonProps) {
  const colorMap: Record<TabButtonProps["color"], string> = {
    emerald: active
      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
      : "text-slate-400 hover:text-emerald-600",
    blue: active
      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
      : "text-slate-400 hover:text-blue-600",
    red: active
      ? "bg-red-600 text-white shadow-lg shadow-red-100"
      : "text-slate-400 hover:text-red-600",
  };

  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-[1.8rem] font-black text-[9px] sm:text-xs uppercase tracking-tight sm:tracking-widest transition-all duration-300 ${colorMap[color]}`}
    >
      <span className="shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span className="truncate">{label}</span>
      <span
        className={`hidden xs:inline-block px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] ${
          active ? "bg-white/20" : "bg-slate-100 text-slate-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
