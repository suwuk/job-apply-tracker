"use client";

import { JobProvider } from "@/context/JobContext";

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JobProvider>{children}</JobProvider>;
}
