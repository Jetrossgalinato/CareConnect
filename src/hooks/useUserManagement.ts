"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "@/actions/admin";
import { useAlert } from "@/hooks/useAlert";
import { filterUsers } from "@/lib/utils/admin-users";
import type { UserProfile, UserRole } from "@/types/admin";
import type { RoleFilter } from "@/lib/utils/admin-users";

type EditFormData = {
  full_name: string;
  school_id: string;
  role: UserRole;
};

const EMPTY_EDIT_FORM_DATA: EditFormData = {
  full_name: "",
  school_id: "",
  role: "student",
};

export function useUserManagement() {
  const { showAlert } = useAlert();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] =
    useState<EditFormData>(EMPTY_EDIT_FORM_DATA);

  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery, roleFilter),
    [users, searchQuery, roleFilter],
  );

  const resetSelection = useCallback(() => {
    setSelectedUser(null);
    setEditFormData(EMPTY_EDIT_FORM_DATA);
  }, []);

  const closeEditDialog = useCallback(() => {
    setShowEditDialog(false);
    resetSelection();
  }, [resetSelection]);

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setSelectedUser(null);
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const result = await getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        showAlert({
          message: result.error || "Failed to load users",
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
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const handleEditClick = useCallback((user: UserProfile) => {
    setSelectedUser(user);
    setEditFormData({
      full_name: user.full_name,
      school_id: user.school_id || "",
      role: user.role,
    });
    setShowEditDialog(true);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!selectedUser) return;

    if (!editFormData.full_name.trim()) {
      showAlert({
        message: "Full name is required",
        type: "error",
        duration: 5000,
      });
      return;
    }

    try {
      setProcessing(true);
      const updates = {
        full_name: editFormData.full_name,
        school_id: editFormData.school_id || undefined,
      } as const;

      const result = await updateUser(selectedUser.id, {
        ...updates,
        ...(selectedUser.role !== "admin" ? { role: editFormData.role } : {}),
      });

      if (result.success) {
        showAlert({
          message: "User updated successfully!",
          type: "success",
          duration: 5000,
        });
        setShowEditDialog(false);
        resetSelection();
        await loadUsers();
      } else {
        showAlert({
          message: result.error || "Failed to update user",
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
      setProcessing(false);
    }
  }, [editFormData, loadUsers, resetSelection, selectedUser, showAlert]);

  const handleDeleteClick = useCallback((user: UserProfile) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedUser) return;

    try {
      setProcessing(true);
      const result = await deleteUser(selectedUser.id);

      if (result.success) {
        showAlert({
          message: "User deleted successfully!",
          type: "success",
          duration: 5000,
        });
        closeDeleteDialog();
        await loadUsers();
      } else {
        showAlert({
          message: result.error || "Failed to delete user",
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
      setProcessing(false);
    }
  }, [closeDeleteDialog, loadUsers, selectedUser, showAlert]);

  return {
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
  };
}
