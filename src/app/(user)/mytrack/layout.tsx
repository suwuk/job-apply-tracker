"use client";

import { usePathname } from "next/navigation";
import { JobProvider } from "@/context/JobContext";

export default function MyTrackLayout({
  children, applied, test, interview, offer, rejected, modal
}: {
  children: React.ReactNode;
  applied: React.ReactNode;
  test: React.ReactNode;
  interview: React.ReactNode;
  offer: React.ReactNode;
  rejected: React.ReactNode;
  modal: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAddPage = pathname === "/mytrack/add";

  return (
    <JobProvider>
      <div className="max-w-350 mx-auto p-4 md:p-8 min-h-screen ">
        <div className="flex flex-col gap-8">
          {isAddPage ? (
            <div className="w-full">{children}</div>
          ) : (
            <>
              {children}
              {/* Layout Kolom: Selalu Flex-Col (Ke bawah) */}
              <div className="flex flex-col gap-8 pb-20">
                {applied}
                {test}
                {interview}
                {offer}
                {rejected}
              </div>
              {modal}
            </>
          )}
        </div>
      </div>
    </JobProvider>
  );
}