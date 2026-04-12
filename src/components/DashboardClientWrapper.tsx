"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardLoginAlert } from "@/components/DashboardLoginAlert";
import { ChatWidget } from "@/components/ChatWidget";
import { ChatWidgetPSG } from "@/components/ChatWidgetPSG";

export function DashboardClientWrapper({
  children,
  initialRole,
}: {
  children: React.ReactNode;
  initialRole?: string | null;
}) {
  const [userRole, setUserRole] = useState<string | null>(initialRole ?? null);

  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fast fallback so chat renders even if profile query is delayed/fails.
        const metadataRole = user.user_metadata?.role;
        if (
          metadataRole === "student" ||
          metadataRole === "psg_member" ||
          metadataRole === "admin"
        ) {
          setUserRole(metadataRole);
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserRole(profile.role);
        }
      }
    };

    getUserRole();
  }, []);

  return (
    <>
      <DashboardLoginAlert />
      {children}
      {userRole === "student" && <ChatWidget />}
      {(userRole === "psg_member" || userRole === "admin") && <ChatWidgetPSG />}
    </>
  );
}
