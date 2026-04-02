import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { getUser } from "@/lib/actions/auth";
import { Shield, Users, BarChart3, FileText } from "lucide-react";

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar subtitle="Admin workspace" showHomeButton />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section
          className="rounded-lg p-6 mb-8"
          style={{
            background: "var(--bg-light)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6" style={{ color: "var(--primary)" }} />
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Admin Page
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)" }}>
            This admin landing page is ready. You can now add your custom admin
            content here.
          </p>
        </section>

        <section>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: "var(--text)" }}
          >
            Existing Admin Modules
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/dashboard/admin/users"
              className="rounded-lg p-5 transition hover:opacity-90"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
              }}
            >
              <Users
                className="w-5 h-5 mb-2"
                style={{ color: "var(--primary)" }}
              />
              <p className="font-semibold" style={{ color: "var(--text)" }}>
                User Management
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Manage student and PSG member accounts.
              </p>
            </Link>

            <Link
              href="/dashboard/admin/reports"
              className="rounded-lg p-5 transition hover:opacity-90"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
              }}
            >
              <BarChart3
                className="w-5 h-5 mb-2"
                style={{ color: "var(--primary)" }}
              />
              <p className="font-semibold" style={{ color: "var(--text)" }}>
                Reports
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                View summaries and operational analytics.
              </p>
            </Link>

            <Link
              href="/dashboard/admin/audit"
              className="rounded-lg p-5 transition hover:opacity-90"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
              }}
            >
              <FileText
                className="w-5 h-5 mb-2"
                style={{ color: "var(--primary)" }}
              />
              <p className="font-semibold" style={{ color: "var(--text)" }}>
                Audit Logs
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Review tracked actions across the system.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
