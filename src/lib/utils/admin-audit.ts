import type { AuditLog } from "@/types/admin";

type ActionBadgeStyle = {
  bg: string;
  text: string;
};

export type AuditActionSummary = {
  total: number;
  inserts: number;
  updates: number;
  deletes: number;
};

export const AUDIT_LIMIT_OPTIONS = [
  { value: 50, label: "Last 50" },
  { value: 100, label: "Last 100" },
  { value: 250, label: "Last 250" },
  { value: 500, label: "Last 500" },
] as const;

export function filterAuditLogs(
  logs: AuditLog[],
  searchQuery: string,
  actionFilter: string,
  tableFilter: string,
): AuditLog[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return logs.filter((log) => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesTable =
      tableFilter === "all" || log.table_name === tableFilter;

    if (!normalizedQuery) {
      return matchesAction && matchesTable;
    }

    const matchesQuery =
      log.user_name.toLowerCase().includes(normalizedQuery) ||
      log.user_email.toLowerCase().includes(normalizedQuery) ||
      log.action.toLowerCase().includes(normalizedQuery) ||
      log.table_name.toLowerCase().includes(normalizedQuery);

    return matchesAction && matchesTable && matchesQuery;
  });
}

export function getUniqueAuditActions(logs: AuditLog[]): string[] {
  return Array.from(new Set(logs.map((log) => log.action)));
}

export function getUniqueAuditTables(logs: AuditLog[]): string[] {
  return Array.from(new Set(logs.map((log) => log.table_name)));
}

export function getActionColor(action: string): ActionBadgeStyle {
  switch (action.toUpperCase()) {
    case "INSERT":
      return { bg: "var(--success-20)", text: "var(--success)" };
    case "UPDATE":
      return { bg: "var(--primary-20)", text: "var(--primary)" };
    case "DELETE":
      return { bg: "var(--error-20)", text: "var(--error)" };
    default:
      return { bg: "var(--text-muted)", text: "var(--text)" };
  }
}

export function getAuditActionSummary(logs: AuditLog[]): AuditActionSummary {
  return {
    total: logs.length,
    inserts: logs.filter((log) => log.action === "INSERT").length,
    updates: logs.filter((log) => log.action === "UPDATE").length,
    deletes: logs.filter((log) => log.action === "DELETE").length,
  };
}

export function formatAuditRecordId(recordId?: string): string {
  return recordId ? recordId.substring(0, 8) : "N/A";
}

export function stringifyAuditDetails(
  details?: Record<string, unknown>,
  pretty = false,
): string {
  if (!details) {
    return "N/A";
  }

  return JSON.stringify(details, null, pretty ? 2 : undefined);
}
