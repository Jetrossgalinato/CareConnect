"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { UserRole } from "@/types/admin";
import { useUserManagement } from "@/hooks/useUserManagement";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Loader } from "@/components/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { downloadUsersPdf } from "@/lib/utils/admin-users";
import { UsersFilters } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { ArrowLeft, Download } from "lucide-react";

const PAGE_SIZE = 10;

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    filteredUsers,
    loading,
    processing,
    searchQuery,
    roleFilter,
    showEditDialog,
    showDeleteDialog,
    selectedUser,
    editFormData,
    setSearchQuery,
    setRoleFilter,
    setEditFormData,
    handleEditClick,
    handleEditSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
    closeEditDialog,
    closeDeleteDialog,
  } = useUserManagement();

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [effectivePage, filteredUsers]);

  const pageItems = useMemo(
    () => getPaginationItems(effectivePage, totalPages),
    [effectivePage, totalPages],
  );

  const handleExportPdf = () => {
    downloadUsersPdf(filteredUsers, {
      searchQuery,
      roleFilter,
    });
  };

  if (loading) {
    return <Loader fullScreen text="Loading users..." />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <DashboardNavbar subtitle="User account management" />

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
              User Management
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              Manage system users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleExportPdf}
            disabled={filteredUsers.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "var(--primary-20)",
              color: "var(--primary)",
            }}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setCurrentPage(1);
            setSearchQuery(value);
          }}
          roleFilter={roleFilter}
          onRoleFilterChange={(value) => {
            setCurrentPage(1);
            setRoleFilter(value);
          }}
          filteredUsers={filteredUsers}
        />

        <UsersTable
          users={paginatedUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {filteredUsers.length > 0 && (
          <div className="mt-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Showing {(effectivePage - 1) * PAGE_SIZE + 1}-
              {Math.min(effectivePage * PAGE_SIZE, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>

            <Pagination className="justify-end mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    className={
                      effectivePage === 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>

                {pageItems.map((item, idx) => (
                  <PaginationItem key={`${item}-${idx}`}>
                    {item === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={item === effectivePage}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    className={
                      effectivePage === totalPages
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {showEditDialog && selectedUser && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
              }}
            >
              <h3
                className="text-base font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                Edit User
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editFormData.full_name}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      border: "1px solid var(--border-muted)",
                      background: "var(--bg)",
                      color: "var(--text)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Student ID (optional)
                  </label>
                  <input
                    type="text"
                    value={editFormData.school_id}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        school_id: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg"
                    style={{
                      border: "1px solid var(--border-muted)",
                      background: "var(--bg)",
                      color: "var(--text)",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block mb-2 text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Role
                  </label>
                  {selectedUser.role === "admin" ? (
                    <div
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        border: "1px solid var(--border-muted)",
                        background: "var(--bg)",
                        color: "var(--text)",
                      }}
                    >
                      Admin (SQL-managed)
                    </div>
                  ) : (
                    <select
                      value={editFormData.role}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          role: e.target.value as UserRole,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg"
                      style={{
                        border: "1px solid var(--border-muted)",
                        background: "var(--bg)",
                        color: "var(--text)",
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="psg_member">PSG Member</option>
                    </select>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleEditSubmit}
                  disabled={processing}
                  className="flex-1 px-6 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  style={{
                    background: "var(--primary)",
                    color: "var(--bg-dark)",
                  }}
                >
                  {processing ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={closeEditDialog}
                  disabled={processing}
                  className="px-6 py-2 rounded-lg transition-all"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border-muted)",
                    color: "var(--text)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteDialog && selectedUser && (
          <div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ background: "rgba(0, 0, 0, 0.5)" }}
          >
            <div
              className="rounded-lg p-6 max-w-md w-full"
              style={{
                background: "var(--bg-light)",
                border: "1px solid var(--border-muted)",
              }}
            >
              <h3
                className="text-base font-bold mb-4"
                style={{ color: "var(--text)" }}
              >
                Delete User
              </h3>
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                Are you sure you want to delete{" "}
                <strong>{selectedUser.full_name}</strong>? This action cannot be
                undone and will remove all associated data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={processing}
                  className="flex-1 px-6 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                  style={{
                    background: "var(--error)",
                    color: "var(--bg-dark)",
                  }}
                >
                  {processing ? "Deleting..." : "Delete User"}
                </button>
                <button
                  onClick={closeDeleteDialog}
                  disabled={processing}
                  className="px-6 py-2 rounded-lg transition-all"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border-muted)",
                    color: "var(--text)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
