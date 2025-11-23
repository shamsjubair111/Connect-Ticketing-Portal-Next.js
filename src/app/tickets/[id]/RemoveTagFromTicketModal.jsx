"use client";

import { useContext } from "react";
import { removeTagFromTicket } from "@/api/ticketingApis";
import MyModal from "@/common/MyModal";
import { alertContext } from "@/hooks/alertContext";

export default function RemoveTagFromTicketModal({
  isOpen,
  onClose,
  ticket,
  tag,
  onSuccess,
}) {
  const { setAlertCtx } = useContext(alertContext);

  if (!tag) return null;

  const handleRemove = async () => {
    try {
      const payload = {
        ticket_id: ticket.ticket_id,
        tag_id: tag.id,
      };

      await removeTagFromTicket(payload);

      setAlertCtx({
        title: "Success!",
        message: "Tag removed successfully",
        type: "success",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Remove tag failed:", err);

      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message ||
          "Failed to remove tag. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <MyModal
      toggle={isOpen}
      title="Remove Tag"
      closeMethod={onClose}
      submitMethod={handleRemove}
      body={
        <p className="text-sm text-gray-700">
          Are you sure you want to remove{" "}
          <span className="font-semibold">{tag.name}</span>?
        </p>
      }
    />
  );
}
