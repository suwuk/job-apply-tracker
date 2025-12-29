"use client";

import { useJobs } from "@/context/JobContext";

export default function DashboardMainPage() {
  const { jobs, loading } = useJobs();

  const getCount = (status: string) =>
    jobs.filter((job) => job.status === status).length;

  return (
    <section>
      <h2 className="text-xl font-bold mb-5 text-gray-800 font-sans">
        Total Applications
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Applied"
          count={loading ? 0 : getCount("applied")}
          color="bg-blue-500"
        />
        <StatCard
          label="Test"
          count={loading ? 0 : getCount("test")}
          color="bg-slate-500"
        />
        <StatCard
          label="Interviews"
          count={loading ? 0 : getCount("interview")}
          color="bg-orange-500"
        />
        <StatCard
          label="Rejected"
          count={loading ? 0 : getCount("rejected")}
          color="bg-red-500"
        />
        <StatCard
          label="Offer"
          count={loading ? 0 : getCount("offer")}
          color="bg-[#48A98E]"
        />
        <StatCard
          label="Accepted"
          count={loading ? 0 : getCount("accepted")}
          color="bg-emerald-600"
        />
        <StatCard
          label="Ghosted"
          count={loading ? 0 : getCount("ghosted")}
          color="bg-[#C1C9D8]"
        />
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  count: number;
  color: string;
}

function StatCard({ label, count, color }: StatCardProps) {
  return (
    <article
      className={`${color} text-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg transform transition-all hover:scale-105 hover:shadow-xl cursor-default`}
    >
      <header>
        <p className="text-sm md:text-base font-medium opacity-90 mb-1 tracking-wide uppercase">
          {label}
        </p>
      </header>
      <p className="text-3xl md:text-4xl font-bold tabular-nums">{count}</p>
    </article>
  );
}
