"use client";

import { X } from "lucide-react";
import { deletePriority } from "@/api/ticketingApis";
import { useContext } from "react";
import { alertContext } from "@/hooks/alertContext";

export default function DeletePriorityModal({
  deleteData,
  onClose,
  onSuccess,
}) {
  const { setAlertCtx } = useContext(alertContext);

  if (!deleteData) return null;

  const handleDelete = async () => {
    try {
      await deletePriority(deleteData.id);

      setAlertCtx({
        title: "Success!",
        message: "Priority deleted successfully.",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error deleting priority:", err);
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message ||
          "Failed to delete priority. Try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Delete Priority
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-gray-700 text-sm">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteData.name}</span>?
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
