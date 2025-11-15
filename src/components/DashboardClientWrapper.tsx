"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DashboardLoginAlert } from "@/components/DashboardLoginAlert";
import { ChatWidget } from "@/components/ChatWidget";
import { ChatWidgetPSG } from "@/components/ChatWidgetPSG";

export function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
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
