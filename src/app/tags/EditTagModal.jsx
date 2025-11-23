"use client";

import { useEffect, useState, useContext } from "react";
import { X } from "lucide-react";
import { updateTag } from "@/api/ticketingApis";
import { alertContext } from "@/hooks/alertContext";

export default function EditTagModal({ editData, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const { setAlertCtx } = useContext(alertContext);

  useEffect(() => {
    if (editData) setName(editData.name);
  }, [editData]);

  if (!editData) return null;

  const handleUpdate = async () => {
    if (!name.trim()) return;

    try {
      await updateTag(editData.id, { name });

      setAlertCtx({
        title: "Success!",
        message: "Tag updated successfully",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update tag. Try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">Edit Tag</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
