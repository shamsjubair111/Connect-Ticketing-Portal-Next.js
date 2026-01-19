"use client";

import { useState, useContext } from "react";
import MyModal from "@/common/MyModal";
import { alertContext } from "@/hooks/alertContext";
import { addFollowersToTicket } from "@/api/ticketingApis";

export default function AddFollowersModal({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) {
  const [emails, setEmails] = useState("");
  const { setAlertCtx } = useContext(alertContext);

  const handleSubmit = async () => {
    const emailList = emails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (emailList.length === 0) {
      setAlertCtx({
        title: "Error",
        message: "Add at least one email",
        type: "error",
      });
      return;
    }

    try {
      await addFollowersToTicket({
        ticket_id: ticket.ticket_id,
        emails: emailList,
      });

      setAlertCtx({
        title: "Success!",
        message: "Followers added",
        type: "success",
      });

      setEmails("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to add followers",
        type: "error",
      });
    }
  };

  return (
    <MyModal
      toggle={isOpen}
      title="Add Followers"
      closeMethod={onClose}
      submitMethod={handleSubmit}
      disabled={!emails.trim()}
      body={
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Add emails (comma separated)
          </label>
          <textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            rows={4}
            placeholder="example1@company.com, example2@company.com"
          />
        </div>
      }
    />
  );
}
