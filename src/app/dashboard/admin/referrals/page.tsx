import { redirect } from "next/navigation";
import { getAdminForwardedReferrals } from "@/actions/referrals";
import {
  REFERRAL_SOURCE_LABELS,
  REFERRAL_STATUS_LABELS,
  SEVERITY_COLORS,
  type ReferralStatus,
} from "@/types/referrals";
import { ClipboardList, Calendar, User, ShieldCheck } from "lucide-react";

function getStatusColor(status: ReferralStatus): string {
  const colors: Record<ReferralStatus, string> = {
    pending: "var(--warning)",
    reviewed: "var(--info)",
    assigned: "var(--primary)",
    in_progress: "var(--info)",
    completed: "var(--success)",
    escalated: "var(--error)",
  };
  return colors[status];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminReferralQueuePage() {
  const result = await getAdminForwardedReferrals();

  if (!result.success) {
    if (result.error === "Please login first") {
      redirect("/login");
    }

    if (result.error === "Unauthorized access") {
      redirect("/dashboard");
    }
  }

  const referrals = result.success ? result.data || [] : [];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1
            className="text-lg font-bold mb-2"
            style={{ color: "var(--text)" }}
          >
            Referral Queue
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Referrals forwarded by PSG members for admin review.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div
            className="rounded-lg p-4"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Total Forwarded
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {referrals.length}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Awaiting Admin Action
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--warning)" }}
            >
              {
                referrals.filter(
                  (referral) =>
                    referral.status === "reviewed" ||
                    referral.status === "assigned" ||
                    referral.status === "in_progress",
                ).length
              }
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Closed Cases
            </p>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--success)" }}
            >
              {
                referrals.filter(
                  (referral) =>
                    referral.status === "completed" ||
                    referral.status === "escalated",
                ).length
              }
            </p>
          </div>
        </div>

        {referrals.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
            }}
          >
            <ClipboardList
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "var(--text-muted)" }}
            />
            <h2
              className="text-base font-semibold mb-2"
              style={{ color: "var(--text)" }}
            >
              No Forwarded Referrals Yet
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Only referrals moved forward by PSG members will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="rounded-lg p-5"
                style={{
                  background: "var(--bg-light)",
                  border: "1px solid var(--border-muted)",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="space-y-1">
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {referral.student.full_name}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {REFERRAL_SOURCE_LABELS[referral.source]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {referral.severity && (
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          background: SEVERITY_COLORS[referral.severity],
                          color: "var(--bg-dark)",
                        }}
                      >
                        {referral.severity.toUpperCase()}
                      </span>
                    )}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: getStatusColor(referral.status),
                        color: "var(--bg-dark)",
                      }}
                    >
                      {REFERRAL_STATUS_LABELS[referral.status]}
                    </span>
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: "var(--text)" }}>
                  {referral.reason || "No reason provided"}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Forwarded by{" "}
                    {referral.reviewed_by_profile?.full_name || "PSG Member"}
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Calendar className="w-4 h-4" />
                    {formatDate(referral.reviewed_at)}
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <User className="w-4 h-4" />
                    Student ID: {referral.student.school_id || "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
