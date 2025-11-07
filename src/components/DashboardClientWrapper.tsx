"use client";
import { DashboardLoginAlert } from "@/components/DashboardLoginAlert";

export function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardLoginAlert />
      {children}
    </>
  );
}
