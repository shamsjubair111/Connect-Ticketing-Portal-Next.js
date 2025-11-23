"use client";

import { useState, useEffect, useContext } from "react";
import { getAllTags, addTagToTicket } from "@/api/ticketingApis";
import MyModal from "@/common/MyModal";
import { alertContext } from "@/hooks/alertContext";

export default function AddTagToTicketModal({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  const { setAlertCtx } = useContext(alertContext);

  useEffect(() => {
    async function loadTags() {
      try {
        const res = await getAllTags(1, 100);
        setTags(res?.data?.data || []);
      } catch (err) {
        console.error("Error loading tags:", err);
        setAlertCtx({
          title: "Error",
          message: "Failed to load tags",
          type: "error",
        });
      }
    }

    if (isOpen) loadTags();
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ticket_id: ticket.ticket_id,
        tag_id: selectedTag,
      };

      await addTagToTicket(payload);

      setAlertCtx({
        title: "Success!",
        message: "Tag added successfully",
        type: "success",
      });

      setSelectedTag("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Add tag failed:", err);

      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to add tag. Try again.",
        type: "error",
      });
    }
  };

  return (
    <MyModal
      toggle={isOpen}
      title="Add Tag to Ticket"
      closeMethod={onClose}
      submitMethod={handleSubmit}
      disabled={!selectedTag}
      body={
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Tag
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm mt-2"
          >
            <option value="">Choose tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
}
