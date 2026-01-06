import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F9FD] overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
}
