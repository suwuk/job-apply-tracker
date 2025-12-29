"use client";

import { JobProvider } from "@/context/JobContext";

export default function ApplicationHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobProvider>{children}</JobProvider>;
}
