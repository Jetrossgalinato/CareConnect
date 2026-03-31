"use client";

import Link from "next/link";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Loader } from "@/components/Loader";
import { AuditFilters } from "./components/AuditFilters";
import { AuditLogsTable } from "./components/AuditLogsTable";
import { AuditInfoPanel } from "./components/AuditInfoPanel";
import { ArrowLeft } from "lucide-react";

export default function AuditLogsPage() {
  const {
    filteredLogs,
    loading,
    searchQuery,
    actionFilter,
    tableFilter,
    limit,
    uniqueActions,
    uniqueTables,
    summary,
    setSearchQuery,
    setActionFilter,
    setTableFilter,
    setLimit,
    loadLogs,
  } = useAuditLogs();

  if (loading) {
    return <Loader fullScreen text="Loading audit logs..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar subtitle="System activity tracking" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 transition-colors"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1
              className="text-lg font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Audit Logs
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Track system activities and data changes
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
              color: "var(--text)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <AuditFilters
          searchQuery={searchQuery}
          actionFilter={actionFilter}
          tableFilter={tableFilter}
          limit={limit}
          uniqueActions={uniqueActions}
          uniqueTables={uniqueTables}
          summary={summary}
          onSearchChange={(value) => setSearchQuery(value)}
          onActionFilterChange={(value) => setActionFilter(value)}
          onTableFilterChange={(value) => setTableFilter(value)}
          onLimitChange={(value) => setLimit(value)}
          onRefresh={loadLogs}
        />

        <AuditLogsTable logs={filteredLogs} />

        <AuditInfoPanel />
      </main>
    </div>
  );
}
