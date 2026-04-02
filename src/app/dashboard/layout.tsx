import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { getUser } from "@/lib/actions/auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg)" }}>
      <div className="[&_main]:lg:pl-72 [&_main]:!max-w-[90rem]">
        {children}
      </div>
      <Sidebar
        userRole={user.role}
        className="hidden lg:block fixed left-0 top-20 h-[calc(100vh-5rem)] min-h-0 overflow-y-auto z-30"
      />
    </div>
  );
}
