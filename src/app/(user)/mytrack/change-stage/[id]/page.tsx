"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Loader2,
  ChevronDown,
  ClipboardList,
  FileX,
  Calendar,
} from "lucide-react";
import {
  ApplicationStatus,
  EmploymentType,
  JobApplicationPayload,
  ApplicationStage,
} from "@/types/applications";

import { patchApplication } from "@/services/firebase";
import { useJobs } from "@/context/JobContext";

enum ApplicationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const { jobs } = useJobs();

  const [loading, setLoading] = useState(false);

  const currentJob = useMemo(() => {
    return (
      jobs?.find(
        (j: JobApplicationPayload) => j.id === (params?.id as string)
      ) || null
    );
  }, [jobs, params?.id]);

  const [form, setForm] = useState({
    employmentType: currentJob?.employmentType || EmploymentType.FULL_TIME,
    status:
      (currentJob?.status as ApplicationStatus) || ApplicationStatus.APPLIED,
    priority:
      (currentJob?.priority as ApplicationPriority) ||
      ApplicationPriority.MEDIUM,
    notes: currentJob?.notes || "",
    stageTitle: "",
    stageNotes: "",
    scheduledAt: "",
    rejectionReason: "",
    rejectedAt: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id || !currentJob) return;

    setLoading(true);

    try {
      const oldStages: ApplicationStage[] = currentJob.stages || [];
      const updatedStages: ApplicationStage[] = [...oldStages];
      const now = new Date().toISOString();

      if (form.status !== currentJob.status) {
        if (form.status === ApplicationStatus.REJECTED) {
          updatedStages.push({
            id: `stage-rejected-${Date.now()}`,
            type: "rejected",
            title: "Application Rejected",
            status: "failed",
            scheduledAt: null,
            completedAt: new Date(form.rejectedAt).toISOString(),
            notes: form.rejectionReason || "No specific reason provided",
            createdAt: now,
          });
        } else {
          updatedStages.push({
            id: `stage-${form.status}-${Date.now()}`,
            type: form.status as string,
            title:
              form.stageTitle ||
              (form.status === "offer"
                ? "Job Offer Received"
                : form.status === "accepted"
                ? "Onboarding"
                : `Update to ${form.status}`),
            status:
              form.status === "offer"
                ? "received"
                : form.status === "accepted"
                ? "passed"
                : "pending",
            scheduledAt: form.scheduledAt
              ? new Date(form.scheduledAt).toISOString()
              : null,
            completedAt: ["offer", "accepted"].includes(form.status)
              ? now
              : null,
            notes: form.stageNotes || "",
            createdAt: now,
          });
        }
      }

      const payload = {
        employmentType: form.employmentType,
        status: form.status,
        priority: form.priority,
        notes: form.notes,
        stages: updatedStages,
        updatedAt: now,
      };

      await patchApplication(params.id as string, payload);
      window.location.href = "/mytrack";
    } catch (error) {
      console.error(error);
      alert("Gagal memperbarui data");
      setLoading(false);
    }
  };

  if (!currentJob)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );

  const isStatusChanged = form.status !== currentJob.status;
  const showStageInput = ["test", "interview", "offer", "accepted"].includes(
    form.status
  );

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "medium":
        return "bg-amber-50 border-amber-200 text-amber-700";
      default:
        return "bg-slate-100 border-slate-200 text-slate-700";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 text-slate-900">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 mb-6 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-bold uppercase tracking-widest">
          Back
        </span>
      </button>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Edit Application
        </h1>
        <p className="text-slate-500 text-sm mt-1">{currentJob.companyName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-5 md:p-10 shadow-sm border border-slate-100 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-base md:text-lg">
                Main Info
              </h3>
              {isStatusChanged && (
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">
                  STATUS CHANGED
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">
                  Current Status
                </label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ApplicationStatus,
                      })
                    }
                    className={`w-full h-14 pl-5 pr-12 rounded-2xl border appearance-none outline-none font-bold text-sm transition-all shadow-sm ${
                      form.status === "rejected"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : ["offer", "accepted"].includes(form.status)
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-blue-50 border-blue-200 text-blue-700"
                    }`}
                  >
                    {Object.values(ApplicationStatus).map((s) => (
                      <option key={s} value={s} className="text-black">
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900"
                    size={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">
                  Priority Level
                </label>
                <div className="relative">
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: e.target.value as ApplicationPriority,
                      })
                    }
                    className={`w-full h-14 pl-5 pr-12 rounded-2xl border appearance-none outline-none font-bold text-sm transition-all shadow-sm ${getPriorityColor(
                      form.priority
                    )}`}
                  >
                    {Object.values(ApplicationPriority).map((p) => (
                      <option key={p} value={p} className="text-black">
                        {p.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900"
                    size={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">
                  Employment Type
                </label>
                <div className="relative">
                  <select
                    value={form.employmentType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        employmentType: e.target.value as EmploymentType,
                      })
                    }
                    className="w-full h-14 pl-5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl appearance-none outline-none font-bold text-sm text-slate-900 shadow-sm"
                  >
                    {Object.values(EmploymentType).map((e) => (
                      <option key={e} value={e} className="text-black">
                        {e.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* New Stage Inputs */}
          {isStatusChanged && showStageInput && (
            <div
              className={`p-5 md:p-8 rounded-2xl border-2 border-dashed animate-in slide-in-from-top-4 duration-500 ${
                ["offer", "accepted"].includes(form.status)
                  ? "bg-emerald-50/40 border-emerald-100"
                  : "bg-blue-50/40 border-blue-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-6 font-bold text-[10px] md:text-xs uppercase tracking-widest text-slate-500">
                <ClipboardList size={14} /> New Stage Details
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Stage Title
                  </label>
                  <input
                    value={form.stageTitle}
                    onChange={(e) =>
                      setForm({ ...form, stageTitle: e.target.value })
                    }
                    placeholder="e.g. Technical Interview"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-900 font-medium focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Calendar size={12} /> Schedule Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) =>
                      setForm({ ...form, scheduledAt: e.target.value })
                    }
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-900 font-medium focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Stage Notes
                  </label>
                  <textarea
                    value={form.stageNotes}
                    onChange={(e) =>
                      setForm({ ...form, stageNotes: e.target.value })
                    }
                    placeholder="Add meeting links or notes..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none text-sm min-h-25 resize-none text-slate-900 font-medium focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {isStatusChanged && form.status === ApplicationStatus.REJECTED && (
            <div className="p-5 md:p-8 bg-red-50/40 border-2 border-dashed border-red-100 rounded-2xl animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-6 font-bold text-[10px] uppercase tracking-widest text-red-500">
                <FileX size={14} /> Rejection Info
              </div>
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Rejection Date
                  </label>
                  <input
                    type="datetime-local"
                    value={form.rejectedAt}
                    onChange={(e) =>
                      setForm({ ...form, rejectedAt: e.target.value })
                    }
                    className="w-full h-12 px-4 bg-white border border-red-200 rounded-xl outline-none text-sm text-slate-900 font-medium focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">
                    Reason
                  </label>
                  <textarea
                    value={form.rejectionReason}
                    onChange={(e) =>
                      setForm({ ...form, rejectionReason: e.target.value })
                    }
                    placeholder="Provide details..."
                    className="w-full p-4 bg-white border border-red-200 rounded-xl outline-none text-sm min-h-25 resize-none text-slate-900 font-medium focus:border-red-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-500 ml-1">
              General Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Add general notes about this application..."
              className="w-full p-5 md:p-8 bg-slate-50 border border-slate-200 rounded-3xl outline-none min-h-45 text-slate-900 text-sm md:text-base font-semibold transition-all focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </section>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-end pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-14 px-8 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all"
          >
            Discard Changes
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-bold text-sm md:text-base flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {loading ? "Saving..." : "Update Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
