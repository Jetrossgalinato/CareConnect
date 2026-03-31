"use client";

import Link from "next/link";
import type { UserRole } from "@/types/admin";
import { useUserManagement } from "@/hooks/useUserManagement";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { Loader } from "@/components/Loader";
import { UsersFilters } from "./components/UsersFilters";
import { UsersTable } from "./components/UsersTable";
import { ArrowLeft } from "lucide-react";

export default function UserManagementPage() {
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

        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
          roleFilter={roleFilter}
          onRoleFilterChange={(value) => setRoleFilter(value)}
          filteredUsers={filteredUsers}
        />

        <UsersTable
          users={filteredUsers}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

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
