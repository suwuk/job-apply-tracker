import { JobProvider } from "@/context/JobContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activity: React.ReactNode;
  event: React.ReactNode;
}

export default function DashboardLayout({
  children,
  activity,
  event,
}: DashboardLayoutProps) {
  return (
    <JobProvider>
      <main className="flex flex-col gap-8 p-4 md:p-0">
        <div className="w-full">
          {children}
        </div>

      
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-full">
            {event}
          </div>
          <div className="h-full">
            {activity}
          </div>
        </section>
      </main>
    </JobProvider>
  );
}