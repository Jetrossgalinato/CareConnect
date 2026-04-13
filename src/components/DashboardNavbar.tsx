"use client";

import Image from "next/image";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggler } from "@/components/ThemeToggler";

interface DashboardNavbarProps {
  title?: string;
}

export function DashboardNavbar({
  title = "CareConnect",
}: DashboardNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 md:-ml-64 md:w-[calc(100%+16rem)]">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.jpeg"
            alt="CareConnect Logo"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <h1 className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggler />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
