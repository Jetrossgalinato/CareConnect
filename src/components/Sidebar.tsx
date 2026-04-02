"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ClipboardList,
  Calendar,
  CalendarPlus,
  FileText,
  FilePlus,
  Shield,
  Users,
  BarChart3,
  Activity,
  Clock3,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/utils/auth";

type SidebarProps = {
  userRole?: UserRole;
  className?: string;
};

type SidebarMenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STUDENT_MENU: SidebarMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  {
    label: "Take Screening",
    href: "/dashboard/screening/take",
    icon: ClipboardList,
  },
  {
    label: "Screening Results",
    href: "/dashboard/screening/results",
    icon: FileText,
  },
  {
    label: "Create Referral",
    href: "/dashboard/referrals/create",
    icon: FilePlus,
  },
  { label: "My Referrals", href: "/dashboard/referrals", icon: Activity },
  { label: "My Appointments", href: "/dashboard/appointments", icon: Calendar },
  {
    label: "Book Appointment",
    href: "/dashboard/appointments/book",
    icon: CalendarPlus,
  },
];

const PSG_MENU: SidebarMenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  {
    label: "Appointments",
    href: "/dashboard/psg/appointments",
    icon: Calendar,
  },
  { label: "Availability", href: "/dashboard/psg/availability", icon: Clock3 },
  { label: "Referrals", href: "/dashboard/psg/referrals", icon: FileText },
  {
    label: "Screenings",
    href: "/dashboard/psg/screenings",
    icon: ClipboardList,
  },
  { label: "Sessions", href: "/dashboard/psg/sessions", icon: Stethoscope },
];

const ADMIN_MENU: SidebarMenuItem[] = [
  { label: "Admin Home", href: "/dashboard/admin", icon: Shield },
  { label: "User Management", href: "/dashboard/admin/users", icon: Users },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  { label: "Audit Logs", href: "/dashboard/admin/audit", icon: FileText },
];

function getMenusByRole(role: UserRole): SidebarMenuItem[] {
  if (role === "admin") return ADMIN_MENU;
  if (role === "psg_member") return PSG_MENU;
  return STUDENT_MENU;
}

export function Sidebar({ userRole, className }: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const role = userRole ?? profile?.role;
  if (!role) return null;

  const menus = getMenusByRole(role);

  return (
    <aside
      className={cn("w-72 min-h-screen p-4 border-r", className)}
      style={{
        background: "var(--bg-light)",
        borderColor: "var(--border-muted)",
      }}
    >
      <div className="mb-4">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Menu
        </h2>
      </div>

      <nav className="space-y-4">
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive ? "font-medium" : "",
              )}
              style={{
                background: isActive ? "var(--primary-20)" : "transparent",
                color: isActive ? "var(--primary)" : "var(--text)",
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
