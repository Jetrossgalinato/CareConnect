import { Shield, Users, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserProfile, UserRole } from "@/types/admin";

export type RoleFilter = UserRole | "all";

type RoleBadgeColor = {
  bg: string;
  text: string;
};

export function filterUsers(
  users: UserProfile[],
  searchQuery: string,
  roleFilter: RoleFilter,
): UserProfile[] {
  const roleFilteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((user) => user.role === roleFilter);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) {
    return roleFilteredUsers;
  }

  return roleFilteredUsers.filter((user) => {
    return (
      user.full_name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery) ||
      user.school_id?.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function getRoleIcon(role: UserRole): LucideIcon {
  switch (role) {
    case "admin":
      return Shield;
    case "psg_member":
      return Users;
    default:
      return GraduationCap;
  }
}

export function getRoleColor(role: UserRole): RoleBadgeColor {
  switch (role) {
    case "admin":
      return { bg: "var(--error-20)", text: "var(--error)" };
    case "psg_member":
      return { bg: "var(--primary-20)", text: "var(--primary)" };
    default:
      return { bg: "var(--success-20)", text: "var(--success)" };
  }
}

export function formatRoleChipLabel(role: UserRole): string {
  return role.replace("_", " ").toUpperCase();
}
