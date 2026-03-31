"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Loader } from "@/components/Loader";
import { useAdminReports } from "@/hooks/useAdminReports";
import { ReportsTabs } from "./components/ReportsTabs";
import { ReportsFilters } from "./components/ReportsFilters";
import { ReportResults } from "./components/ReportResults";
import { ReportsEmptyState } from "./components/ReportsEmptyState";

export default function ReportsPage() {
  const {
    activeTab,
    loading,
    dateRange,
    statusFilter,
    appointmentReports,
    referralReports,
    sessionReports,
    usageReport,
    hasData,
    setActiveTab,
    setDateRange,
    setStatusFilter,
    handleGenerateReport,
    handleExport,
    handleDownloadPDF,
  } = useAdminReports();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar subtitle="System reports and analytics" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            Reports & Analytics
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Generate and export system reports
          </p>
        </div>

        <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ReportsFilters
          activeTab={activeTab}
          dateRange={dateRange}
          statusFilter={statusFilter}
          loading={loading}
          onDateRangeChange={setDateRange}
          onStatusFilterChange={setStatusFilter}
          onGenerateReport={handleGenerateReport}
        />

        {loading ? (
          <Loader text="Generating report..." />
        ) : hasData ? (
          <ReportResults
            activeTab={activeTab}
            dateRange={dateRange}
            appointmentReports={appointmentReports}
            referralReports={referralReports}
            sessionReports={sessionReports}
            usageReport={usageReport}
            onDownloadPDF={handleDownloadPDF}
            onExportJSON={handleExport}
          />
        ) : (
          <ReportsEmptyState />
        )}
      </main>
    </div>
  );
}
