"use client";

import { useState, useRef, useEffect } from "react";
import { Copy, MoreVertical, Info } from "lucide-react";
import { X } from "lucide-react";
import {
  getAssignedAgent,
  removeFollower,
  unassignAgent,
} from "@/api/ticketingApis";
import {
  forwardTicket,
  resolveTicket,
  changeTicketStatus,
  getAllPriorities,
  updatePriority,
  updateTicketPriority,
} from "@/api/ticketingApis";
import { useContext } from "react";
import { alertContext } from "@/hooks/alertContext";
import { jwtDecode } from "jwt-decode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MyModal from "../common/MyModal"; // ✅ Make sure this path is correct
import AddTagToTicketModal from "@/app/tickets/[id]/AddTagToTicketModal";
import RemoveTagFromTicketModal from "@/app/tickets/[id]/RemoveTagFromTicketModal";
import AssignAgentModal from "@/app/tickets/[id]/AssignAgentModal";
import AddFollowersModal from "@/app/tickets/[id]/AddFollowersModal";
import { getTicketFollowers } from "@/api/ticketingApis";

// import { forwardTicket, resolveTicket } from "@/api/ticketingApis"; // ✅ Uncomment if API exists

export default function DetailsPanel({
  ticket,
  onOpenCustomFieldModal,
  onTicketUpdated,
}) {
  const [status, setStatus] = useState("Open");
  const [priority, setPriority] = useState("");
  const { setAlertCtx } = useContext(alertContext);
  const [showMenu, setShowMenu] = useState(false);
  const [action, setAction] = useState("");
  const [resolveToggle, setResolveToggle] = useState(false);
  const [forwardToggle, setForwardToggle] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [loop, setLoop] = useState(false);
  const [cause, setCause] = useState("");
  const [selectedDept, setSelectDept] = useState("");
  const firstLoad = useRef(true);
  const [priorities, setPriorities] = useState([]);
  const [addTagModal, setAddTagModal] = useState(false);
  const [removeTagData, setRemoveTagData] = useState(null);
  const [assignAgentModal, setAssignAgentModal] = useState(false);
  const [followersModal, setFollowersModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [assignedAgent, setAssignedAgent] = useState(null);

  const allUsers = [
    { key: "iptsp", value: "IPTSP" },
    { key: "rs", value: "Retail Sales" },
    { key: "cc", value: "Customer Care" },
    { key: "oss-bss", value: "OSS & BSS" },
  ];

  const userType = jwtDecode(localStorage.getItem("jwt_token")).user_type;

  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    const safeName = String(name || "").trim();
    if (!safeName) return "";
    return safeName
      .split(/\s+/)
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 3);
  };

  const loadFollowers = async () => {
    try {
      const res = await getTicketFollowers(ticket.ticket_id);
      const people = res?.data?.people_in_loop || [];
      setFollowers(Array.isArray(people) ? people : []);
    } catch (err) {
      console.error("Failed to load followers", err);
      setFollowers([]);
    }
  };

  useEffect(() => {
    async function loadAssignedAgent() {
      try {
        const res = await getAssignedAgent(ticket.ticket_id);
        setAssignedAgent(res?.data || null);
      } catch (err) {
        console.error(err);
      }
    }

    if (ticket?.ticket_id) loadAssignedAgent();
  }, [ticket?.ticket_id]);

  useEffect(() => {
    if (ticket?.ticket_id) loadFollowers();
  }, [ticket?.ticket_id]);

  useEffect(() => {
    // If API returns null, undefined, or empty → show "Select Priority"
    if (!ticket?.priority) {
      setPriority("");
      return;
    }

    // Otherwise set the actual priority (ex: "High", "Medium")
    setPriority(ticket.priority?.priority_name);
  }, [ticket]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!ticket?.ticket_status) return;

    if (!firstLoad.current) return; // ⛔ Prevent re-trigger on refresh from parent

    let apiStatus = ticket.ticket_status;

    let formatted;
    if (apiStatus === "closed") {
      formatted = "Solved";
    } else {
      formatted = apiStatus
        .replace("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    setStatus(formatted);
    firstLoad.current = false; // ❗ Only run on first mount
  }, [ticket]);

  useEffect(() => {
    async function fetchPriorities() {
      try {
        const res = await getAllPriorities(); // API call
        setPriorities(res.data.data); // store array of priorities
      } catch (err) {
        console.error("Failed to load priorities", err);
      }
    }

    fetchPriorities();
  }, []);

  // ✅ Forward handler
  const handleForward = async () => {
    try {
      setButtonLoader(true);
      const data = {
        ticket_id: ticket.ticket_id,
        previously_issued_to: ticket.issued_to,
        newly_issued_to: action === "r&f" ? "cc" : selectedDept,
        forward_cause: cause,
        is_in_forward_loop: loop,
      };

      const res = await forwardTicket(data);

      if (action === "r&f") {
        await handleResolve(); // chain resolve after forward
      }

      setButtonLoader(false);
      setForwardToggle(false);
      setAlertCtx({
        title: "Success!",
        message:
          action === "r&f"
            ? "Ticket successfully forwarded and resolved"
            : "Ticket successfully forwarded",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setButtonLoader(false);
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again or refresh.",
        type: "error",
      });
    } finally {
      setForwardToggle(false);
    }
  };

  const handleRemoveAgent = async () => {
    try {
      await unassignAgent(ticket.ticket_id);

      setAssignedAgent(null);

      setAlertCtx({
        title: "Success!",
        message: "Agent removed successfully",
        type: "success",
      });
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to remove agent",
        type: "error",
      });
    }
  };

  const handlePriorityChange = async (newPriorityName) => {
    try {
      setPriority(newPriorityName); // update UI instantly

      // Find selected priority object
      const selectedPriority = priorities.find(
        (p) => p.name === newPriorityName,
      );
      if (!selectedPriority) return;

      await updateTicketPriority(selectedPriority.id, ticket?.ticket_id);

      setAlertCtx({
        title: "Success!",
        message: `Priority updated to ${newPriorityName}`,
        type: "success",
      });

      // notify parent to refresh UI
      onTicketUpdated?.();
    } catch (err) {
      console.error("Priority update failed:", err);
      setAlertCtx({
        message: err.response?.data?.message || "Failed to update priority",
        type: "error",
      });
    }
  };

  const handleResolve = async () => {
    try {
      setButtonLoader(true);
      const data = { ticket_id: ticket.ticket_id };
      await resolveTicket(data);

      setButtonLoader(false);
      setResolveToggle(false);
      setAlertCtx({
        title: "Success!",
        message: "Successfully resolved this ticket",
        type: "success",
      });
      // ✅ Update parent UI immediately without refresh
      onTicketUpdated?.();
    } catch (err) {
      console.error(err);
      setButtonLoader(false);
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again or refresh.",
        type: "error",
      });
    } finally {
      setResolveToggle(false);
    }
  };

  const handleRemoveFollower = async (email) => {
    try {
      await removeFollower(ticket.ticket_id, email);
      setFollowers((prev) => prev.filter((e) => e !== email));
      setAlertCtx({
        title: "Success!",
        message: "Follower removed",
        type: "success",
      });
    } catch (err) {
      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to remove follower",
        type: "error",
      });
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatus(newStatus);

      let apiStatus = newStatus;

      if (newStatus === "Solved") {
        apiStatus = "closed"; // 🔥 convert UI → API
      }

      const payload = {
        ticket_id: ticket.ticket_id,
        status: apiStatus.toLowerCase().split(" ").join("_"),
      };

      await changeTicketStatus(payload);

      setAlertCtx({
        title: "Success!",
        message: `Status updated to ${newStatus}`,
        type: "success",
      });

      onTicketUpdated?.();
    } catch (err) {
      console.error(err);
      setAlertCtx({
        message: err.response?.data?.message || "Failed to update status",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full lg:w-96 bg-white p-6 shadow-none">
      {/* ===== HEADER ===== */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Details</h2>

        {/* ===== DROPDOWN ===== */}
        <div ref={dropdownRef} className="relative">
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <>
              {String(ticket?.is_resolved).toLowerCase() === "true" ? (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <ul className="py-2 flex justify-center">
                    <li>
                      <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-md">
                        ✅ Solved
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <ul className="py-1 text-sm text-gray-700">
                    <li
                      onClick={() => {
                        setForwardToggle(true);
                        setAction("forward");
                        setShowMenu(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                    >
                      Forward
                    </li>

                    <li
                      onClick={() => {
                        setForwardToggle(true);
                        setAction("r&f");
                        setShowMenu(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                    >
                      Resolve & Forward to CC
                    </li>

                    <li
                      onClick={() => {
                        setResolveToggle(true);
                        setAction("resolve");
                        setShowMenu(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                    >
                      Resolve
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {forwardToggle && (
        <MyModal
          toggle={forwardToggle}
          title={
            action === "r&f" ? "Resolve & Forward to CC" : "Forward Ticket"
          }
          disabled={action === "forward" ? !cause || !selectedDept : !cause}
          loader={buttonLoader}
          body={
            <div>
              <div>
                {action === "forward" && (
                  <>
                    <div className="mb-2 block">
                      <label
                        htmlFor="dept"
                        className="text-sm font-medium text-gray-700"
                      >
                        Forward to
                      </label>
                    </div>
                    <select
                      id="dept"
                      required
                      onChange={(e) => setSelectDept(e.target.value)}
                      value={selectedDept}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    >
                      <option value={""}>{""}</option>
                      {allUsers.map((item, i) => (
                        <>
                          {item.key !== userType && (
                            <option key={i} value={item.key}>
                              {item.value}
                            </option>
                          )}
                          {userType === "cc" &&
                            item.key === "cc" &&
                            ticket.issued_to !== "cc" && (
                              <option key={i} value={item.key}>
                                {item.value}
                              </option>
                            )}
                        </>
                      ))}
                    </select>
                  </>
                )}

                {action === "r&f" && (
                  <>
                    <label
                      htmlFor="dept"
                      className="text-sm font-medium text-gray-700"
                    >
                      Forward to
                    </label>
                    <input
                      type="text"
                      id="dept"
                      value={"Corporate Support"}
                      disabled
                      className="w-full border border-gray-300 rounded-md p-2 text-sm bg-gray-50"
                    />
                  </>
                )}
              </div>

              <label
                htmlFor="cause"
                className="block mt-3 text-sm font-medium text-gray-700"
              >
                Cause
              </label>
              <input
                type="text"
                id="cause"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter cause"
                required
              />

              <label className="relative inline-flex items-center cursor-pointer mt-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  value={loop}
                  onChange={() => setLoop(!loop)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {loop ? "Stay in loop" : "Stay out of loop"}
                </span>
              </label>
            </div>
          }
          closeMethod={() => setForwardToggle(false)}
          submitMethod={handleForward}
        />
      )}

      {resolveToggle && (
        <MyModal
          toggle={resolveToggle}
          title="Resolve Ticket"
          closeMethod={() => setResolveToggle(false)}
          submitMethod={handleResolve}
          body={
            <p className="text-sm text-gray-700">
              Are you sure you want to resolve this ticket?
            </p>
          }
        />
      )}

      {/* ===== ACCORDIONS ===== */}
      <Accordion type="single" collapsible className="space-y-4">
        {/* Ticket Info */}
        <AccordionItem value="ticket-info">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Ticket info
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-gray-900">
              <span className="text-gray-600">
                Ticket ID: {ticket?.ticket_id}
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Copy size={16} />
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-900">
                <span className="text-gray-600">Created:</span>{" "}
                {ticket?.created_at
                  ? new Date(ticket.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-900">
              <span className="text-gray-600">Last message:</span>
              {ticket?.comments?.length > 0 ? (
                <>
                  <span>
                    {ticket.comments[ticket.comments.length - 1].message}
                  </span>
                  <span className="text-gray-500 text-xs">
                    by{" "}
                    {ticket.comments[ticket.comments.length - 1].commenter_name}{" "}
                    on{" "}
                    {new Date(
                      ticket.comments[ticket.comments.length - 1].created_at,
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">No comments yet</span>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Status: </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Solved</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Priority: </label>
              <select
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="mt-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900"
              >
                <option value="">Select Priority</option>

                {priorities.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="text-sm text-gray-600">Source:</label>
              <p className="mt-1 text-sm text-gray-900">Email</p>
            </div> */}
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Tags
          </AccordionTrigger>

          <AccordionContent className="pb-4 pt-2 space-y-3">
            {/* 🔹 TAG LIST DISPLAY */}
            <div className="flex flex-wrap gap-2">
              {ticket?.tags?.length > 0 ? (
                ticket.tags.map((tag) => (
                  <div
                    key={tag.tag_id}
                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tag.tag_name}</span>

                    <button
                      className="ml-2 text-blue-700 hover:text-red-600 font-bold"
                      onClick={() =>
                        setRemoveTagData({
                          id: tag.tag_id,
                          name: tag.tag_name,
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No tags added</p>
              )}
            </div>

            {/* 🔹 ADD TAG BUTTON */}
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setAddTagModal(true)}
            >
              + Add tag
            </button>
          </AccordionContent>
        </AccordionItem>

        <AddTagToTicketModal
          isOpen={addTagModal}
          onClose={() => setAddTagModal(false)}
          ticket={ticket}
          onSuccess={onTicketUpdated}
        />

        <RemoveTagFromTicketModal
          isOpen={!!removeTagData}
          onClose={() => setRemoveTagData(null)}
          ticket={ticket}
          tag={removeTagData}
          onSuccess={onTicketUpdated}
        />

        <AssignAgentModal
          isOpen={assignAgentModal}
          onClose={() => setAssignAgentModal(false)}
          ticket={ticket}
          onSuccess={onTicketUpdated}
        />

        <AddFollowersModal
          isOpen={followersModal}
          onClose={() => setFollowersModal(false)}
          ticket={ticket}
          onSuccess={onTicketUpdated}
        />

        {/* Custom Fields */}
        {/* <AccordionItem value="custom-fields">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Custom fields
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2 text-center">
            <p className="text-sm font-semibold text-gray-900">
              No custom fields yet
            </p>
            <p className="mt-2 text-xs text-gray-600">
              Create your first custom field to add more useful details to your
              tickets.
            </p>
            <button
              onClick={onOpenCustomFieldModal}
              className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Create custom field
            </button>
          </AccordionContent>
        </AccordionItem> */}

        {/* Responsibility */}
        <AccordionItem value="responsibility">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Responsibility
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Group</p>
              </div>
              {ticket?.group_name ? (
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500 text-xs font-bold text-white">
                    {getInitials(ticket?.group_name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket?.group_name}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600">No group</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Agent</p>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    onClick={() => setAssignAgentModal(true)}
                  >
                    Assign
                  </button>
                </div>
              </div>
              {assignedAgent?.assigned_agent?.agent_id ? (
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-sm">
                    {getInitials(assignedAgent?.assigned_agent?.agent_name)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {assignedAgent?.assigned_agent?.agent_name}
                      </p>
                    </div>

                    <button
                      onClick={handleRemoveAgent}
                      className="text-red-600 hover:text-red-800"
                      style={{ cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-600 mt-1">
                  No agent assigned to this ticket.
                </p>
              )}
            </div>

            <div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    People in loop
                  </p>
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setFollowersModal(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Edit
                  </button>
                </div>

                {followers.length === 0 ? (
                  <p className="text-xs text-gray-600">
                    No followers added yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {followers.map((email) => (
                      <span
                        key={email}
                        className="flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-xs text-gray-800"
                      >
                        {email}
                        <button
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveFollower(email)}
                          className="hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Requester */}
        {/* <AccordionItem value="requester">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Requester
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-sm">
                {ticket?.requester?.name?.charAt(0) || "R"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {ticket?.requester?.name || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {ticket?.requester?.email || "Not available"}{" "}
                  <Copy size={12} />
                </p>
              </div>
            </div>
            <button className="text-sm text-blue-600 hover:underline">
              + Add more people
            </button>
          </AccordionContent>
        </AccordionItem> */}

        {/* Requester’s Tickets */}
        {/* <AccordionItem value="requester-tickets">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Requester’s tickets
          </AccordionTrigger>
          <AccordionContent className="pb-4 pt-2 text-sm text-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <strong>Recent tickets</strong>
              <span className="text-blue-600 text-xs font-medium cursor-pointer">
                Merge
              </span>
            </div>
            <p className="text-xs text-gray-500">
              No recent requester’s tickets
            </p>
            <div>
              <strong>Archived tickets</strong>
              <p className="text-xs text-gray-500">
                Search{" "}
                <span className="text-blue-600 cursor-pointer">Archive</span> to
                view this requester’s archived tickets.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem> */}

        {/* Similar Tickets */}
        <AccordionItem value="similar-tickets">
          <AccordionTrigger className="py-3 text-base font-semibold text-gray-900 hover:no-underline">
            Similar tickets
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-full border border-blue-500 text-blue-600">
                <Info size={20} />
              </div>
              <p className="font-semibold text-gray-800">
                No similar tickets were found
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                There are no matching tickets available right now. Once you
                resolve a similar case, it'll appear here.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
