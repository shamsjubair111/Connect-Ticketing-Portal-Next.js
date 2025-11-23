"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createPriority } from "@/api/ticketingApis";
import { useContext } from "react";
import { alertContext } from "@/hooks/alertContext";

export default function AddPriorityModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAlertCtx } = useContext(alertContext);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await createPriority({ name });

      setAlertCtx({
        title: "Success!",
        message: "Priority created successfully.",
        type: "success",
      });

      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Priority create error:", err);
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message ||
          "Failed to create priority. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Priority</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-gray-700 text-sm">
          <input
            type="text"
            placeholder="Priority name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className={`px-4 py-2 text-sm text-white rounded 
                ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
