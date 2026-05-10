import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ThemeToggler } from "@/components/ThemeToggler";
import { getUser } from "@/lib/actions/auth";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Student referrals, screening results, and session notes stay protected behind role-based access.",
  },
  {
    icon: CalendarDays,
    title: "Fast appointments",
    description:
      "Book sessions with PSG availability that updates in real time for a smoother intake flow.",
  },
  {
    icon: MessageSquareText,
    title: "Secure messaging",
    description:
      "Keep follow-ups and coordination in one place with encrypted, low-latency chat.",
  },
];

const stats = [
  { value: "3 roles", label: "Students, PSG members, and admins" },
  { value: "<5 sec", label: "Target booking experience" },
  { value: "24/7", label: "Access to resources and support" },
];

const steps = [
  {
    title: "Create or sign in",
    description:
      "Use your institutional account to access the right experience for your role.",
  },
  {
    title: "Submit or review referrals",
    description:
      "Students start a self-referral while PSG members triage cases and track progress.",
  },
  {
    title: "Book and continue care",
    description:
      "Appointments, messaging, and session documentation stay connected across the process.",
  },
];

export default async function Home() {
  const user = await getUser();

  if (user) {
    if (user.role === "admin") {
      redirect("/dashboard/admin");
    }

    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(111,209,108,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(180deg,var(--bg-dark),var(--bg))] text-[var(--text)]">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
        <ThemeToggler />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[var(--text-muted)] backdrop-blur">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              Caraga State University PSG Referral System
            </div>

            <div className="space-y-5 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                A calmer way to connect students with support.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
                CareConnect helps students submit referrals, schedule sessions,
                and message securely while PSG members and admins keep every
                case moving with less friction.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--bg-dark)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-muted)] bg-[rgba(255,255,255,0.03)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--primary)]"
              >
                Create account
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--border-muted)] bg-[rgba(255,255,255,0.04)] p-4 backdrop-blur"
                >
                  <div className="text-2xl font-bold text-[var(--primary)]">
                    {stat.value}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-[var(--border-muted)] bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur"
                  >
                    <div className="mb-4 inline-flex rounded-2xl bg-[var(--primary-20)] p-3 text-[var(--primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--text)]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="rounded-3xl border border-[var(--border-muted)] bg-[rgba(255,255,255,0.05)] p-5 backdrop-blur">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-lg font-semibold text-[var(--text)]">
                    How it works
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    The flow stays simple: access the right portal, submit or
                    review cases, then keep support moving with appointments and
                    follow-up messaging.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-muted)] px-4 py-2 text-sm text-[var(--text-muted)]">
                  <Users className="h-4 w-4 text-[var(--primary)]" />
                  Built for students and support staff
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-[var(--border-muted)] bg-[rgba(255,255,255,0.03)] p-4"
                  >
                    <div className="mb-3 text-sm font-semibold text-[var(--primary)]">
                      0{index + 1}
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text)]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--warning-bg)] bg-[var(--warning-bg)]/40 p-5">
              <p className="text-sm leading-6 text-[var(--text)]">
                <strong>Emergency:</strong> If a student is in immediate crisis,
                contact the National Mental Health Crisis Hotline at{" "}
                <strong>1553</strong>
                or go to the OCCS office right away.
              </p>
            </div>
          </section>

          <aside className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(111,209,108,0.16),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] blur-2xl" />
            <div className="rounded-[2rem] border border-[var(--border-muted)] bg-[rgba(255,255,255,0.05)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    CareConnect
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">
                    Support that feels organized.
                  </h2>
                </div>
                <div className="rounded-2xl bg-[var(--primary-20)] p-3 text-[var(--primary)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border-muted)] bg-[var(--bg-dark)]/60 p-4">
                <Image
                  src="/authlogo.png"
                  alt="CareConnect"
                  width={720}
                  height={720}
                  priority
                  className="h-auto w-full object-contain"
                  style={{ filter: "var(--auth-image-filter)" }}
                />
              </div>

              <div className="mt-6 grid gap-3">
                {[
                  "Self-referrals for students",
                  "PSG review and triage tools",
                  "Appointment scheduling and follow-up",
                  "Role-based dashboards and audit-ready tracking",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[var(--border-muted)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--text-muted)]"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
