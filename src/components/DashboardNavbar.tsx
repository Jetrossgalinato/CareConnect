"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggler } from "@/components/ThemeToggler";
import { Home } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
  showHomeButton?: boolean;
}

export function DashboardNavbar({
  title = "CareConnect",
  subtitle,
  showHomeButton = false,
}: DashboardNavbarProps) {
  const router = useRouter();

  return (
    <header
      style={{
        background: "var(--bg-dark)",
        boxShadow: "none",
      }}
      className="sticky top-0 z-50 md:-ml-64 md:w-[calc(100%+16rem)]"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="md:hidden"
            style={{ color: "var(--text)" }}
          />
          <Image
            src="/logo.jpeg"
            alt="CareConnect Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-xs hidden sm:block"
                style={{ color: "var(--text-muted)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {showHomeButton && (
            <>
              <div
                className="h-6 w-px hidden sm:block"
                style={{ background: "var(--border-muted)" }}
              />
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-md transition hover:bg-primary flex items-center gap-2"
                style={{ color: "var(--text)" }}
                title="Back to Dashboard"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--bg-dark)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">
                  Home
                </span>
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggler />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
