"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAppointmentById, cancelAppointment } from "@/actions/appointments";
import { useAlert } from "@/components/AlertProvider";
import type { AppointmentWithProfiles } from "@/types/appointments";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "@/types/appointments";
import { DashboardNavbar } from "@/components/DashboardNavbar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AppointmentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { showAlert } = useAlert();
  const [appointment, setAppointment] =
    useState<AppointmentWithProfiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    async function load() {
      await loadAppointment();
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const loadAppointment = async () => {
    try {
      const result = await getAppointmentById(resolvedParams.id);

      if (result.success && result.data) {
        setAppointment(result.data);
      } else {
        showAlert({
          message: result.error || "Failed to load appointment",
          type: "error",
          duration: 5000,
        });
        router.push("/dashboard/appointments");
      }
    } catch {
      showAlert({
        message: "An unexpected error occurred",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelReason.trim()) {
      showAlert({
        message: "Please provide a reason for cancellation",
        type: "error",
        duration: 5000,
      });
      return;
    }

    try {
      setCancelling(true);
      const result = await cancelAppointment(resolvedParams.id, cancelReason);

      if (result.success) {
        showAlert({
          message: "Appointment cancelled successfully",
          type: "success",
          duration: 5000,
        });
        await loadAppointment();
        setShowCancelDialog(false);
        setCancelReason("");
      } else {
        showAlert({
          message: result.error || "Failed to cancel appointment",
          type: "error",
          duration: 5000,
        });
      }
    } catch {
      showAlert({
        message: "An unexpected error occurred",
        type: "error",
        duration: 5000,
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancel =
    appointment &&
    appointment.status !== "cancelled" &&
    appointment.status !== "completed" &&
    new Date(appointment.appointment_date) > new Date();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar
        subtitle="Appointment details and actions"
        showHomeButton={true}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard/appointments"
            className="text-primary hover:underline flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Appointments
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold">Appointment Details</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium text-white ${
                APPOINTMENT_STATUS_COLORS[appointment.status]
              }`}
            >
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </span>
          </div>

          {/* PSG Member Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              PSG Member
            </h2>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {appointment.psg_member.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={appointment.psg_member.avatar_url}
                  alt={appointment.psg_member.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-lg">
                  {appointment.psg_member.full_name}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Appointment Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </p>
                  <p className="text-lg font-medium">
                    {formatDate(appointment.appointment_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Time
                  </p>
                  <p className="text-lg font-medium">
                    {formatTime(appointment.appointment_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Duration
                  </p>
                  <p className="text-lg font-medium">
                    {appointment.duration_minutes} minutes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-lg font-medium capitalize">
                    {appointment.location_type}
                  </p>
                </div>
              </div>

              {appointment.meeting_link && (
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Meeting Link
                    </p>
                    <a
                      href={appointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                Notes
              </h2>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-700 dark:text-gray-300">
                  {appointment.notes}
                </p>
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {appointment.cancellation_reason && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                Cancellation Details
              </h2>
              <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Cancelled on:{" "}
                  {appointment.cancelled_at
                    ? formatDate(appointment.cancelled_at)
                    : "N/A"}
                </p>
                <p className="text-red-700 dark:text-red-300">
                  {appointment.cancellation_reason}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {canCancel && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          )}
        </div>

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Cancel Appointment</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for cancelling this appointment:
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCancelAppointment}
                  disabled={cancelling}
                  className="flex-1 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
                <button
                  onClick={() => {
                    setShowCancelDialog(false);
                    setCancelReason("");
                  }}
                  disabled={cancelling}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Keep Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
