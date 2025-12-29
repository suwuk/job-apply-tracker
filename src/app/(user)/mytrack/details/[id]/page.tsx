"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useJobs } from "@/context/JobContext";
import ApplicationDetailContent from "@/components/ApplicationDetailContent";

export default function FullDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { jobs, loading } = useJobs();

  const job = useMemo(
    () => jobs.find((j) => j.id === params.id),
    [jobs, params.id]
  );

  const handleBack = () => router.push("/mytrack");

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50"
        aria-busy="true"
        aria-live="polite"
      >
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Memuat detail lamaran...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Data Tidak Ditemukan
          </h1>
          <p className="text-slate-500 mb-6">
            Maaf, detail lamaran yang Anda cari tidak tersedia.
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Kembali ke Tracker
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition group"
            aria-label="Kembali ke Board Tracker"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
              aria-hidden="true"
            />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Kembali ke Board
            </span>
          </button>
        </nav>

        <section
          className="shadow-xl rounded-[2.5rem] overflow-hidden"
          aria-label={`Detail lamaran kerja di ${job.companyName}`}
        >
          <ApplicationDetailContent job={job} isFullPage={true} />
        </section>
      </div>
    </main>
  );
}
