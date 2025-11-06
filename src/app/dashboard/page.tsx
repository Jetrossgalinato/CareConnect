import { getUser } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { formatRole } from "@/lib/utils/auth";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CareConnect</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {user.full_name}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Role:</span>{" "}
              {formatRole(user.role)}
            </p>
            {user.school_id && (
              <p className="text-sm text-blue-800 mt-1">
                <span className="font-semibold">School ID:</span>{" "}
                {user.school_id}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            This is your {formatRole(user.role).toLowerCase()} dashboard. The
            following features will be available soon:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            {user.role === "student" && (
              <>
                <li>• Mental Health Screening</li>
                <li>• Self-Referral Form</li>
                <li>• Book Appointments</li>
                <li>• Message PSG Members</li>
                <li>• View Your Progress</li>
              </>
            )}
            {user.role === "psg_member" && (
              <>
                <li>• View Assigned Referrals</li>
                <li>• Manage Appointments</li>
                <li>• Session Notes & Feedback</li>
                <li>• Student Messaging</li>
                <li>• Availability Management</li>
              </>
            )}
            {user.role === "admin" && (
              <>
                <li>• User Management</li>
                <li>• System Reports</li>
                <li>• Audit Logs</li>
                <li>• Analytics Dashboard</li>
                <li>• Configuration Settings</li>
              </>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
