"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardClientWrapper } from "@/components/DashboardClientWrapper";
import { DashboardNavbar } from "@/components/DashboardNavbar";
import { ScreeningForm } from "@/components/screening/ScreeningForm";
import {
  ScreeningQuestion,
  QuestionResponse,
  PRESET_SCREENING_QUESTIONS,
} from "@/lib/validations/screening";
import { submitScreening } from "@/lib/actions/screening";
import { Loader2 } from "lucide-react";

export default function TakeScreeningPage() {
  const [questions] = useState<ScreeningQuestion[]>(() => {
    // Initialize questions with IDs on mount
    return PRESET_SCREENING_QUESTIONS.map((q, index) => ({
      ...q,
      id: `preset-${index}`,
    }));
  });
  // In production, this would be true while fetching from Supabase
  const [isLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (responses: QuestionResponse[]) => {
    try {
      // Submit to Supabase
      const response = await submitScreening(responses);

      if (response.error) {
        alert(`Failed to submit screening: ${response.error}`);
        return;
      }

      // Clear any old sessionStorage data
      sessionStorage.removeItem("screeningResult");
      sessionStorage.removeItem("hasCaseAssessment");

      // Navigate to results page
      router.push("/dashboard/screening/results");
    } catch (error) {
      console.error("Error submitting screening:", error);
      alert("Failed to submit screening. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <DashboardClientWrapper>
        <div className="min-h-screen" style={{ background: "var(--bg)" }}>
          <DashboardNavbar showHomeButton={true} />
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--primary)" }}
            />
          </div>
        </div>
      </DashboardClientWrapper>
    );
  }

  return (
    <DashboardClientWrapper>
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <DashboardNavbar showHomeButton={true} />

        <div className="py-12 px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text)" }}
            >
              Mental Health Screening
            </h1>
            <p style={{ color: "var(--text-muted)" }}>
              This confidential screening will help us understand how
              you&apos;ve been feeling recently. Please answer honestly - there
              are no right or wrong answers.
            </p>
          </div>

          {/* Screening Form */}
          <ScreeningForm questions={questions} onSubmit={handleSubmit} />
        </div>
      </div>
    </DashboardClientWrapper>
  );
}
