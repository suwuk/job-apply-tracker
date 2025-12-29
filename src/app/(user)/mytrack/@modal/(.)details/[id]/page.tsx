"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/core/Modal";
import ApplicationDetailContent from "@/components/ApplicationDetailContent";
import { useJobs } from "@/context/JobContext";
import { useParams } from "next/navigation";

export default function DetailModalPage() {
  const router = useRouter();
  const { id } = useParams();
  const { jobs } = useJobs();

  const job = jobs.find((j) => j.id === id);

  return (
    <Modal isOpen={true} onClose={() => router.back()} maxWidth="max-w-4xl">
      <ApplicationDetailContent job={job} onClose={() => router.back()} />
    </Modal>
  );
}
