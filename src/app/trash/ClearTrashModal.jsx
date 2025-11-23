"use client";

import { X } from "lucide-react";
import { clearTrash } from "@/api/ticketingApis";
import { useContext } from "react";
import { alertContext } from "@/hooks/alertContext";

export default function ClearTrashModal({ open, onClose, onSuccess }) {
  const { setAlertCtx } = useContext(alertContext);

  if (!open) return null;

  const handleClear = async () => {
    try {
      await clearTrash();

      setAlertCtx({
        title: "Success!",
        message: "All trash tickets cleared successfully.",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message ||
          "Failed to clear trash. Try again later.",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">Clear Trash</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-sm text-gray-700">
          Are you sure you want to permanently delete all trash tickets?
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Trash
          </button>
        </div>
      </div>
    </div>
  );
}
