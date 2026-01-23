"use client";

import { useEffect } from "react";
import { useAlert } from "@/hooks/useAlert";

export function DashboardLoginAlert() {
  const { showAlert } = useAlert();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const success = sessionStorage.getItem("loginSuccess");
      console.log("DashboardLoginAlert - loginSuccess flag:", success);
      if (success === "true") {
        console.log("Showing login success alert");
        showAlert({
          type: "success",
          message: "Signed in successfully!",
          duration: 4000,
        });
        sessionStorage.removeItem("loginSuccess");
      }
    }
  }, [showAlert]);

  return null;
}
