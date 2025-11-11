"use client";

import React from "react";
import { ImCross } from "react-icons/im";
import { AddGroup } from "./AddGroup";

const AddGroupModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800/10 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-6 shadow-lg overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          <ImCross />
        </button>

        {/* Add Group form */}
        <AddGroup onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default AddGroupModal;
