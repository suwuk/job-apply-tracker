"use client";

import React, { useMemo } from "react";
import { Calendar, Loader2 } from "lucide-react";
import { useJobs } from "@/context/JobContext";
import { formatEventDate } from "@/utils/date";
import {
  JobApplicationPayload,
  ApplicationStage,
  TimelineEvent,
} from "@/types/applications";

export default function EventPage() {
  const { jobs, loading } = useJobs();

  const upcomingEvents = useMemo<TimelineEvent[]>(() => {
    return jobs
      .filter((job) => job.status !== "rejected")
      .flatMap((job: JobApplicationPayload) => {
        const scheduledStages = (job.stages || []).filter(
          (s: ApplicationStage) =>
            (s.type === "interview" || s.type === "test") && s.scheduledAt
        );

        return scheduledStages.map((stage): TimelineEvent => {
          const eventDate = new Date(stage.scheduledAt!);
          const isToday =
            eventDate.toDateString() === new Date().toDateString();

          return {
            id: stage.id,
            logo: job.companyName?.charAt(0) || "J",
            title: `${job.companyName} - ${
              stage.type === "test" ? "Technical Test" : "Interview"
            }`,
            date: eventDate,
            isoDate: stage.scheduledAt!,
            location: job.location || "Remote",
            isToday,
            color: isToday
              ? "text-orange-500"
              : stage.type === "test"
              ? "text-purple-500"
              : "text-blue-500",
          };
        });
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 4);
  }, [jobs]);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 h-full font-sans">
      <h3 className="text-lg font-bold mb-6 text-gray-800 tracking-tight">
        Upcoming Events
      </h3>

      <div className="space-y-4">
        {loading ? (
          <LoadingState />
        ) : upcomingEvents.length > 0 ? (
          <ul className="space-y-4">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: TimelineEvent }) {
  return (
    <article className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl transition hover:bg-gray-100 group">
      <div
        className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center font-bold text-xl shadow-sm shrink-0 ${event.color}`}
        aria-hidden="true"
      >
        {event.logo}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-gray-800 text-sm md:text-base truncate tracking-tight">
            {event.title}
          </h4>
          {event.isToday && (
            <span className="bg-[#48A98E] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
              Today
            </span>
          )}
        </div>

        <time
          dateTime={event.isoDate}
          className="block text-sm text-gray-500 mt-1 font-medium"
        >
          {formatEventDate(event.date)}
        </time>

        <address className="not-italic text-xs text-gray-400 font-medium">
          {event.location}
        </address>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-10" aria-busy="true">
      <Loader2 className="animate-spin text-blue-500" />
      <span className="sr-only">Loading events...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Calendar size={40} className="text-gray-200 mb-2" aria-hidden="true" />
      <p className="text-xs text-gray-400 font-medium">
        No upcoming tests or interviews.
      </p>
    </div>
  );
}
