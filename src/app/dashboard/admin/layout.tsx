import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { getUser } from "@/lib/actions/auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <>
      <DashboardNavbar subtitle="Admin workspace" showHomeButton />
      {children}
    </>
  );
}
