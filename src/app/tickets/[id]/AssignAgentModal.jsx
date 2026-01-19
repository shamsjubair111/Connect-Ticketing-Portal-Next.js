"use client";

import { useState, useEffect, useContext } from "react";
import MyModal from "@/common/MyModal";
import { alertContext } from "@/hooks/alertContext";
import { getUser, assignAgentToTicket } from "@/api/ticketingApis";

export default function AssignAgentModal({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}) {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const { setAlertCtx } = useContext(alertContext);

  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await getUser();
        setAgents(res?.data || []);
      } catch (err) {
        console.error("Failed to load agents", err);
        setAlertCtx({
          title: "Error",
          message: "Failed to load agents",
          type: "error",
        });
      }
    }

    if (isOpen) loadAgents();
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ticket_id: ticket.ticket_id,
        agent: selectedAgent,
      };

      await assignAgentToTicket(payload);

      setAlertCtx({
        title: "Success!",
        message: "Agent assigned successfully",
        type: "success",
      });

      setSelectedAgent("");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Assign agent failed", err);
      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to assign agent",
        type: "error",
      });
    }
  };

  return (
    <MyModal
      toggle={isOpen}
      title="Assign Agent"
      closeMethod={onClose}
      submitMethod={handleSubmit}
      disabled={!selectedAgent}
      body={
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Agent
          </label>

          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Choose agent</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      }
    />
  );
}
