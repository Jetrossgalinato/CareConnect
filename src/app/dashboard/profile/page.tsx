"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/Loader";
import { useAlert } from "@/hooks/useAlert";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/lib/actions/auth";
import { formatRole, type Profile } from "@/lib/utils/auth";

type ProfileFormState = {
  full_name: string;
  school_id: string;
  avatar_url: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileFormState>({
    full_name: "",
    school_id: "",
    avatar_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getCurrentUserProfile();

        if (!result.success || !result.data) {
          if (result.error === "Please login first") {
            router.push("/login");
            return;
          }

          showAlert({
            type: "error",
            message: result.error || "Failed to load profile",
            duration: 5000,
          });
          return;
        }

        setProfile(result.data);
        setForm({
          full_name: result.data.full_name || "",
          school_id: result.data.school_id || "",
          avatar_url: result.data.avatar_url || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        showAlert({
          type: "error",
          message: "Failed to load profile",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router, showAlert]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      const result = await updateCurrentUserProfile({
        full_name: form.full_name,
        school_id: form.school_id,
        avatar_url: form.avatar_url,
      });

      if (!result.success || !result.data) {
        showAlert({
          type: "error",
          message: result.error || "Failed to save profile",
          duration: 5000,
        });
        return;
      }

      setProfile(result.data);
      setForm({
        full_name: result.data.full_name || "",
        school_id: result.data.school_id || "",
        avatar_url: result.data.avatar_url || "",
      });

      showAlert({
        type: "success",
        message: "Profile updated successfully",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert({
        type: "error",
        message: "Failed to save profile",
        duration: 5000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="rounded-lg p-6 text-center"
            style={{
              background: "var(--bg-light)",
              border: "1px solid var(--border-muted)",
            }}
          >
            <p style={{ color: "var(--text-muted)" }}>
              Unable to load profile information.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1
            className="text-lg font-bold mb-2"
            style={{ color: "var(--text)" }}
          >
            My Profile
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Update your account information.
          </p>
        </div>

        <div
          className="rounded-lg p-6 mb-6"
          style={{
            background: "var(--bg-light)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: "var(--text-muted)" }}>Email</p>
              <p
                className="font-medium break-all"
                style={{ color: "var(--text)" }}
              >
                {profile.email}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--text-muted)" }}>Role</p>
              <p className="font-medium" style={{ color: "var(--text)" }}>
                {formatRole(profile.role)}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-lg p-6 space-y-5"
          style={{
            background: "var(--bg-light)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg"
              style={{
                border: "1px solid var(--border-muted)",
                background: "var(--bg)",
                color: "var(--text)",
              }}
              required
              minLength={2}
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              School ID (optional)
            </label>
            <input
              type="text"
              value={form.school_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, school_id: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg"
              style={{
                border: "1px solid var(--border-muted)",
                background: "var(--bg)",
                color: "var(--text)",
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg font-medium text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "var(--primary)",
                color: "var(--bg-dark)",
              }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
