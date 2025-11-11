"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/components/AlertProvider";
import {
  getReferralById,
  getReferralUpdates,
  getReferralAssessment,
  updateReferralStatus,
} from "@/actions/referrals";
import {
  ReferralWithProfiles,
  ReferralUpdateWithProfile,
  ReferralStatus,
  REFERRAL_STATUS_LABELS,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
  REFERRAL_SOURCE_LABELS,
} from "@/types/referrals";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

export default function ReferralDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [referral, setReferral] = useState<ReferralWithProfiles | null>(null);
  const [updates, setUpdates] = useState<ReferralUpdateWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReferralData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load referral details
      const referralResult = await getReferralById(params.id);
      if (referralResult.success && referralResult.data) {
        setReferral(referralResult.data);
      } else {
        showAlert({
          type: "error",
          message: referralResult.error || "Failed to load referral",
          duration: 5000,
        });
        router.push("/dashboard/psg/referrals");
        return;
      }

      // Load updates
      const updatesResult = await getReferralUpdates(params.id);
      if (updatesResult.success && updatesResult.data) {
        setUpdates(updatesResult.data);
      }

      // Load assessment if exists
      const assessmentResult = await getReferralAssessment(params.id);
      if (assessmentResult.success && assessmentResult.data) {
        // Assessment loaded but not displayed yet - for future use
        console.log("Assessment:", assessmentResult.data);
      }
    } catch (err) {
      console.error("Error loading referral data:", err);
      showAlert({
        type: "error",
        message: "An unexpected error occurred",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router, showAlert]);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const handleStatusChange = async (newStatus: ReferralStatus) => {
    if (!referral) return;

    try {
      const result = await updateReferralStatus(referral.id, newStatus);

      if (result.success) {
        showAlert({
          type: "success",
          message: "Referral status updated successfully",
          duration: 4000,
        });
        loadReferralData();
      } else {
        showAlert({
          type: "error",
          message: result.error || "Failed to update status",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showAlert({
        type: "error",
        message: "An unexpected error occurred",
        duration: 5000,
      });
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: "var(--warning)",
      reviewed: "var(--info)",
      assigned: "var(--primary)",
      in_progress: "var(--primary)",
      completed: "var(--success)",
      escalated: "var(--error)",
    };
    return colors[status] || "var(--text-muted)";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <DashboardNavbar subtitle="Loading..." />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p style={{ color: "var(--text-muted)" }}>
              Loading referral details...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!referral) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <DashboardNavbar subtitle="Not Found" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p style={{ color: "var(--text-muted)" }}>Referral not found</p>
          </div>
        </main>
      </div>
    );
  }

  const statusColor = getStatusColor(referral.status);
  const severityColor = referral.severity
    ? SEVERITY_COLORS[referral.severity]
    : null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar subtitle="Referral Details" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard/psg/referrals"
          className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Referrals
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Referral Information */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.015)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="text-lg font-bold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Referral Information
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded"
                      style={{
                        background: `${statusColor}20`,
                        color: statusColor,
                      }}
                    >
                      {REFERRAL_STATUS_LABELS[referral.status]}
                    </span>
                    {severityColor && referral.severity && (
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          background: `${severityColor}20`,
                          color: severityColor,
                        }}
                      >
                        {SEVERITY_LABELS[referral.severity]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Source
                  </p>
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    {REFERRAL_SOURCE_LABELS[referral.source]}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-medium mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Reason for Referral
                  </p>
                  <p className="text-sm" style={{ color: "var(--text)" }}>
                    {referral.reason || "No reason provided"}
                  </p>
                </div>

                {referral.notes && (
                  <div>
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Additional Notes
                    </p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {referral.notes}
                    </p>
                  </div>
                )}

                <div
                  className="grid grid-cols-2 gap-4 pt-4"
                  style={{ borderTop: "1px solid var(--border-muted)" }}
                >
                  <div>
                    <p
                      className="text-xs font-medium mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Created
                    </p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>
                      {new Date(referral.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  {referral.reviewed_at && (
                    <div>
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Reviewed
                      </p>
                      <p className="text-sm" style={{ color: "var(--text)" }}>
                        {new Date(referral.reviewed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.015)",
              }}
            >
              <h2
                className="text-base font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                Activity Timeline
              </h2>

              {updates.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No activity yet
                </p>
              ) : (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div
                      key={update.id}
                      className="flex gap-3"
                      style={{
                        paddingBottom: "1rem",
                        borderBottom: "1px solid var(--border-muted)",
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-2"
                        style={{ background: "var(--primary)" }}
                      />
                      <div className="flex-1">
                        <p className="text-sm" style={{ color: "var(--text)" }}>
                          {update.content}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {update.updated_by_profile.full_name} •{" "}
                          {new Date(update.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Student Info */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.015)",
              }}
            >
              <h3
                className="text-base font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                Student Information
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--primary-20)" }}
                >
                  <User
                    className="w-6 h-6"
                    style={{ color: "var(--primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {referral.student.full_name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {referral.student.school_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-lg p-6"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.015)",
              }}
            >
              <h3
                className="text-base font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                Quick Actions
              </h3>
              <div className="space-y-2">
                {referral.status === "pending" && (
                  <Button
                    onClick={() => handleStatusChange("reviewed")}
                    className="w-full"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                    }}
                  >
                    Mark as Reviewed
                  </Button>
                )}
                {referral.status === "reviewed" && (
                  <Button
                    onClick={() => handleStatusChange("assigned")}
                    className="w-full"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                    }}
                  >
                    Assign to PSG Member
                  </Button>
                )}
                {referral.status === "assigned" && (
                  <Button
                    onClick={() => handleStatusChange("in_progress")}
                    className="w-full"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                    }}
                  >
                    Start Case
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
