"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Globe,
  Link as LinkIcon,
  Calendar,
  ChevronDown,
  Save,
  Loader2,
  ClipboardList,
  Info,
  AlertCircle,
  FileX,
  PartyPopper,
  Clock,
} from "lucide-react";

import {
  Platform,
  ApplicationStatus,
  EmploymentType,
  ApplicationPriority,
  ApplicationStage,
  CreateApplicationDTO,
} from "@/types/applications";
import { createApply } from "@/services/firebase";
import { useJobs } from "@/context/JobContext";
import { ApplicationFormState } from "@/types/applications";

export default function AddApplicationPage() {
  const { refreshJobs } = useJobs();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [priority, setPriority] = useState<ApplicationPriority>("high");
  const [form, setForm] = useState<ApplicationFormState>({
    companyName: "",
    position: "",
    platform: Platform.LINKEDIN,
    jobUrl: "",
    status: ApplicationStatus.APPLIED, // Berubah dari DRAFT ke APPLIED
    appliedAt: new Date().toISOString().slice(0, 16),
    location: "",
    employmentType: EmploymentType.FULL_TIME,
    notes: "",
    stageTitle: "",
    stageNotes: "",
    scheduledAt: "",
    rejectionReason: "",
    rejectedAt: new Date().toISOString().slice(0, 16),
  });

  const updateForm = <K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    if (!form.appliedAt) {
      alert("Tanggal lamaran (Applied Date) wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const now = new Date().toISOString();

      const initialStages: ApplicationStage[] = [
        {
          id: `stage-applied-${Date.now()}`,
          type: "applied",
          title: "Applied",
          status: "completed" as const,
          scheduledAt: null,
          completedAt: new Date(form.appliedAt).toISOString(),
          notes: "Aplikasi dikirim melalui " + form.platform,
          createdAt: now,
        },
      ];

      const showStageInput = [
        "test",
        "interview",
        "offer",
        "accepted",
      ].includes(form.status);

      if (showStageInput) {
        initialStages.push({
          id: `stage-${form.status}-${Date.now()}`,
          type: form.status,
          title:
            form.stageTitle ||
            (form.status === "offer"
              ? "Job Offer Received"
              : form.status === "accepted"
              ? "Onboarding"
              : `Tahap ${form.status}`),
          status:
            form.status === "offer"
              ? "received"
              : form.status === "accepted"
              ? "passed"
              : "pending",
          scheduledAt: form.scheduledAt
            ? new Date(form.scheduledAt).toISOString()
            : null,
          completedAt:
            form.status === "offer" || form.status === "accepted" ? now : null,
          notes: form.stageNotes || "",
          createdAt: now,
        });
      } else if (form.status === ApplicationStatus.REJECTED) {
        initialStages.push({
          id: `stage-rejected-${Date.now()}`,
          type: "rejected",
          title: "Application Rejected",
          status: "failed" as const,
          scheduledAt: null,
          completedAt: new Date(form.rejectedAt).toISOString(),
          notes: form.rejectionReason || "No specific reason provided",
          createdAt: now,
        });
      }

      const payload: CreateApplicationDTO = {
        userId: session.user.id,
        companyName: form.companyName,
        position: form.position,
        platform: form.platform as Platform,
        jobUrl: form.jobUrl || null,
        status: form.status as ApplicationStatus,
        appliedAt: new Date(form.appliedAt).toISOString(),
        location: form.location || null,
        employmentType: form.employmentType as EmploymentType,
        notes: form.notes || null,
        priority: priority,
        stages: initialStages,
        createdAt: now,
        updatedAt: now,
      };

      await createApply(payload);
      await refreshJobs();
      router.push("/mytrack");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Gagal menyimpan lamaran");
      }
    } finally {
      setLoading(false);
    }
  };

  const showStageInput = ["test", "interview", "offer", "accepted"].includes(
    form.status
  );

  return (
    <div className="max-w-5xl mx-auto py-6 md:py-8 px-4 min-h-screen bg-slate-50/30 font-sans">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 transition group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="font-bold text-[10px] md:text-xs uppercase tracking-widest">
          Back to Board
        </span>
      </button>

      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <span className="text-xl md:text-2xl">📝</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            Add Application
          </h1>
        </div>
        <p className="text-slate-500 text-xs md:text-sm ml-1 w-full md:ml-14">
          Pastikan data terisi lengkap untuk monitoring karir Anda
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 md:space-y-8 bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm border border-slate-50 font-sans"
      >
        {/* BASIC INFORMATION */}
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-md md:text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Company Name *
              </label>
              <div className="relative font-sans">
                <Building2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => updateForm("companyName", e.target.value)}
                  placeholder="e.g. Tokopedia"
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm md:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Position *
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  required
                  value={form.position}
                  onChange={(e) => updateForm("position", e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm md:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Platform
              </label>
              <div className="relative">
                <select
                  value={form.platform}
                  onChange={(e) =>
                    updateForm("platform", e.target.value as Platform)
                  }
                  className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl appearance-none outline-none font-medium text-sm md:text-base"
                >
                  {Object.values(Platform).map((p) => (
                    <option key={p} value={p}>
                      {p.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Job URL
              </label>
              <div className="relative">
                <LinkIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="url"
                  value={form.jobUrl}
                  onChange={(e) => updateForm("jobUrl", e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-sm md:text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS & STAGES */}
        <section className="space-y-4 md:space-y-6 pt-2 md:pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-50 pb-2 gap-2">
            <h3 className="text-md md:text-lg font-bold text-slate-800">
              Application Progress
            </h3>
            <div
              className={`flex items-center self-start gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                form.status === "rejected"
                  ? "bg-red-50 text-red-500"
                  : form.status === "offer" || form.status === "accepted"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-blue-50 text-blue-500"
              }`}
            >
              {form.status === "rejected" ? (
                <AlertCircle size={12} />
              ) : form.status === "accepted" || form.status === "offer" ? (
                <PartyPopper size={12} />
              ) : (
                <Info size={12} />
              )}
              Status: {form.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Current Status *
              </label>
              <div className="relative font-sans">
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as ApplicationStatus)
                  }
                  className={`w-full px-5 py-3.5 md:py-4 border rounded-xl md:rounded-2xl outline-none font-bold cursor-pointer appearance-none text-sm md:text-base ${
                    form.status === "rejected"
                      ? "bg-red-50 border-red-100 text-red-600"
                      : form.status === "offer" || form.status === "accepted"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-blue-50/50 border-blue-100 text-blue-600"
                  }`}
                >
                  {Object.values(ApplicationStatus).map((s) => (
                    <option key={s} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Applied Date *
              </label>
              <div className="relative font-sans">
                <Calendar
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="datetime-local"
                  required
                  value={form.appliedAt}
                  onChange={(e) => updateForm("appliedAt", e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* STAGE INPUT */}
            {showStageInput && (
              <div
                className={`md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-4xl border animate-in fade-in zoom-in-95 duration-300 ${
                  form.status === "offer" || form.status === "accepted"
                    ? "bg-emerald-50/30 border-emerald-100/50"
                    : "bg-blue-50/30 border-blue-100/50"
                }`}
              >
                <div
                  className={`md:col-span-2 flex items-center gap-2 mb-1 md:mb-2 font-bold text-[10px] md:text-sm uppercase tracking-wider ${
                    form.status === "offer" || form.status === "accepted"
                      ? "text-emerald-600"
                      : "text-blue-600"
                  }`}
                >
                  <ClipboardList size={16} />
                  {form.status === "offer"
                    ? "🎁 Job Offer Details"
                    : form.status === "accepted"
                    ? "🎉 Onboarding Details"
                    : `Detail Tahap ${form.status}`}
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-slate-600">
                    {form.status === "offer"
                      ? "Offer Title"
                      : form.status === "accepted"
                      ? "Team / Department"
                      : "Nama Tahap / Judul"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      form.status === "offer"
                        ? "e.g. Senior Frontend Engineer Offer"
                        : "e.g. Engineering Team"
                    }
                    value={form.stageTitle}
                    onChange={(e) => updateForm("stageTitle", e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-white border border-slate-100 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {form.status === "offer" ? <Clock size={14} /> : null}
                      {form.status === "offer"
                        ? "Offer Expiry Date"
                        : form.status === "accepted"
                        ? "Joining Date"
                        : "Jadwal (Scheduled At)"}
                    </div>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => updateForm("scheduledAt", e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-white border border-slate-100 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs md:text-sm font-bold text-slate-600">
                    {form.status === "offer"
                      ? "Package Summary / Notes"
                      : form.status === "accepted"
                      ? "Onboarding Instructions"
                      : "Catatan / Link"}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      form.status === "offer"
                        ? "e.g. Salary package & Benefits"
                        : "e.g. Bring ID card and laptop"
                    }
                    value={form.stageNotes}
                    onChange={(e) => updateForm("stageNotes", e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-white border border-slate-100 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base"
                  />
                </div>
              </div>
            )}

            {/* REJECTED SECTION */}
            {form.status === ApplicationStatus.REJECTED && (
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-red-50/30 rounded-2xl md:rounded-4xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="md:col-span-2 flex items-center gap-2 mb-1 md:mb-2 text-red-600 font-bold text-[10px] md:text-sm uppercase tracking-wider">
                  <FileX size={16} /> Rejection Details
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-slate-600">
                    Tanggal Penolakan *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.rejectedAt}
                    onChange={(e) => updateForm("rejectedAt", e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-white border border-red-100 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs md:text-sm font-bold text-slate-600">
                    Alasan Penolakan
                  </label>
                  <textarea
                    value={form.rejectionReason}
                    onChange={(e) =>
                      updateForm("rejectionReason", e.target.value)
                    }
                    placeholder="Berikan catatan singkat..."
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-white border border-red-100 text-black rounded-xl md:rounded-2xl outline-none font-medium min-h-24 resize-none text-sm md:text-base"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* METADATA */}
        <section className="space-y-4 md:space-y-6 pt-2 md:pt-4">
          <h3 className="text-md md:text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">
            Job Metadata
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Location
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="e.g. Jakarta / Remote"
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none font-medium text-sm md:text-base"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Employment Type
              </label>
              <div className="relative">
                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    updateForm(
                      "employmentType",
                      e.target.value as EmploymentType
                    )
                  }
                  className="w-full px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl appearance-none outline-none font-medium cursor-pointer text-sm md:text-base"
                >
                  {Object.values(EmploymentType).map((e) => (
                    <option key={e} value={e}>
                      {e.replace("_", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRIORITY */}
        <section className="space-y-4 md:space-y-6 pt-2 md:pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                General Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                placeholder="Catatan tambahan..."
                className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 text-black rounded-xl md:rounded-2xl outline-none font-medium min-h-24 md:min-h-30 resize-none text-sm md:text-base"
              />
            </div>
            <div className="space-y-3 md:space-y-4">
              <label className="text-xs md:text-sm font-bold text-slate-600 ml-1">
                Priority Level
              </label>
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-4xl border border-slate-100 flex items-center justify-center">
                <div className="flex bg-white p-1 rounded-xl md:rounded-2xl shadow-inner border border-slate-100 w-full">
                  {(["low", "med", "high"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      className={`flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${
                        priority === lvl
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-3 md:gap-4 pt-6 md:pt-10 border-t border-slate-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full md:w-auto px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#4A85F6] text-white px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-70 text-sm md:text-base"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            {loading ? "Processing..." : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
