import type { UserProfile } from "@/types/admin";

type DeleteStudentDialogProps = {
  selectedUser: UserProfile;
  processing: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function DeleteStudentDialog({
  selectedUser,
  processing,
  onConfirm,
  onClose,
}: DeleteStudentDialogProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="rounded-lg p-6 max-w-md w-full"
        style={{
          background: "var(--bg-light)",
          border: "1px solid var(--border-muted)",
        }}
      >
        <h3
          className="text-base font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          Delete Student
        </h3>
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>
          Are you sure you want to delete{" "}
          <strong>{selectedUser.full_name}</strong>? This action cannot be
          undone and will remove all associated data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={processing}
            className="flex-1 px-6 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            style={{
              background: "var(--error)",
              color: "var(--bg-dark)",
            }}
          >
            {processing ? "Deleting..." : "Delete Student"}
          </button>
          <button
            onClick={onClose}
            disabled={processing}
            className="px-6 py-2 rounded-lg transition-all"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border-muted)",
              color: "var(--text)",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
