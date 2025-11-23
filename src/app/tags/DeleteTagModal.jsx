"use client";

import { useContext } from "react";
import { X } from "lucide-react";
import { deleteTag } from "@/api/ticketingApis";
import { alertContext } from "@/hooks/alertContext";

export default function DeleteTagModal({ deleteData, onClose, onSuccess }) {
  const { setAlertCtx } = useContext(alertContext);

  if (!deleteData) return null;

  const handleDelete = async () => {
    try {
      await deleteTag(deleteData.id);

      setAlertCtx({
        title: "Success!",
        message: "Tag deleted successfully",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to delete tag. Try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">Delete Tag</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{deleteData.name}</span>?
        </div>

        <div className="flex justify-end gap-3 border-t px-5 py-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
