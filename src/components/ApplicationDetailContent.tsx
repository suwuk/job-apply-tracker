"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Edit3,
  Trash2,
  MapPin,
  Briefcase,
  Calendar,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  Globe,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { deleteApplication } from "@/services/firebase";

export default function ApplicationDetailContent({
  job,
  onClose,
  refresh,
  isFullPage = false,
}: any) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== "undefined" && window.history.length > 1) {
        setCanGoBack(true);
      } else {
        setCanGoBack(false);
      }
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  if (!job) return null;

  const handleBackNavigation = () => {
    if (onClose) onClose();
    else if (canGoBack) router.back();
    else router.push("/mytrack");
  };

  const formatString = (str: string) =>
    str
      ?.split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteApplication(job.id);
      await refresh();

      if (onClose) {
        onClose();
      } else {
        router.replace("/mytrack");
        // router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-white ${
        !isFullPage ? "rounded-3xl md:rounded-[2.5rem]" : "rounded-2xl"
      } overflow-hidden relative border border-slate-100 shadow-xl max-h-[90vh] flex flex-col`}
    >
      {/* OVERLAY KONFIRMASI DELETE */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-[100] bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-6 transition-all">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl scale-in-center border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center">
              Hapus Lamaran?
            </h3>
            <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Semua data lamaran di{" "}
              <strong>{job.companyName}</strong> akan hilang.
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-200 text-sm disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER & CLOSE BUTTON */}
      {!isFullPage ? (
        <button
          onClick={handleBackNavigation}
          className="absolute right-4 top-4 md:right-6 md:top-6 text-slate-400 hover:text-slate-600 z-10 p-1"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>
      ) : (
        <div className="px-4 pt-4 md:px-10 md:pt-10">
          <button
            onClick={handleBackNavigation}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-all group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">
              Back
            </span>
          </button>
        </div>
      )}

      <div className="p-5 md:p-10 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-4 mb-6 md:mb-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-2xl md:rounded-3xl flex items-center justify-center text-white text-xl md:text-3xl font-black uppercase shrink-0 shadow-lg shadow-emerald-100">
              {job.companyName?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight truncate leading-tight">
                {job.companyName}
              </h2>
              <p className="text-xs md:text-base text-slate-500 font-bold truncate">
                {job.position}
              </p>
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 flex items-center gap-1 text-[10px] font-bold mt-1 hover:underline"
                >
                  <LinkIcon size={10} /> Listing
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-[10px] md:text-sm">
              <Edit3 size={14} className="md:w-4 md:h-4" /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1 bg-red-50 text-red-500 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors text-[10px] md:text-sm"
            >
              <Trash2 size={14} className="md:w-4 md:h-4" /> Delete
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-5">
              <h4 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                Job Details
              </h4>
              <DetailRow
                icon={<Globe size={16} />}
                label="Platform"
                value={formatString(job.platform)}
              />
              <DetailRow
                icon={<MapPin size={16} />}
                label="Location"
                value={job.location || "Remote"}
              />
              <DetailRow
                icon={<Briefcase size={16} />}
                label="Type"
                value={formatString(job.employmentType)}
              />
              <DetailRow
                icon={<Calendar size={16} />}
                label="Applied"
                value={formatDate(job.appliedAt)}
              />
            </div>
            <div>
              <h4 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3">
                Notes
              </h4>
              <p className="text-xs md:text-sm text-slate-600 bg-slate-50/50 p-3 md:p-5 rounded-xl md:rounded-3xl border border-slate-100 leading-relaxed italic">
                &quot;{job.notes || "Tidak ada catatan."}&quot;
              </p>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div>
              <h4 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 md:mb-3">
                Current Status
              </h4>
              <div className="bg-orange-50 border border-orange-100 p-3 md:p-4 rounded-xl md:rounded-2xl inline-flex items-center gap-2 md:gap-3">
                <div className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-orange-500"></span>
                </div>
                <span className="text-orange-700 font-black text-[10px] md:text-sm uppercase tracking-wider">
                  {job.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                Activities
              </h4>
              <div className="space-y-6 border-l-2 border-slate-100 ml-3 md:ml-4 pl-6 md:pl-10 relative">
                {job.stages?.map((stage: any) => {
                  const isCurrentStatus = stage.type === job.status;
                  return (
                    <div key={stage.id} className="relative group">
                      <div
                        className={`absolute -left-[33px] md:-left-[58px] top-0 p-1 rounded-full border-2 md:border-4 border-white shadow-sm transition-all z-10 
                        ${
                          isCurrentStatus
                            ? "bg-blue-600 text-white scale-110"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <CheckCircle2
                          size={12}
                          className="md:w-4 md:h-4"
                          strokeWidth={isCurrentStatus ? 3 : 2}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md 
                            ${
                              isCurrentStatus
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {stage.type}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock size={10} />
                            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-tight">
                              {formatDate(
                                stage.completedAt || stage.scheduledAt
                              )}
                            </p>
                          </div>
                        </div>
                        <h5
                          className={`text-xs md:text-sm font-bold leading-tight ${
                            isCurrentStatus
                              ? "text-slate-900"
                              : "text-slate-700"
                          }`}
                        >
                          {stage.title}
                        </h5>
                        {stage.notes && (
                          <div
                            className={`mt-0.5 p-2 md:p-3 rounded-lg md:rounded-2xl border transition-colors
                            ${
                              isCurrentStatus
                                ? "bg-blue-50/50 border-blue-100"
                                : "bg-slate-50 border-slate-100"
                            }`}
                          >
                            <p className="text-[9px] md:text-[11px] font-semibold leading-relaxed italic text-slate-600">
                              &ldquo;{stage.notes}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3 md:gap-4 text-slate-600 group">
      <div className="text-slate-300 group-hover:text-blue-500 transition-colors pt-0.5 shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-tight text-slate-400 mb-0.5">
          {label}
        </div>
        <div className="text-[11px] md:text-sm font-bold text-slate-700 truncate">
          {value}
        </div>
      </div>
    </div>
  );
}
