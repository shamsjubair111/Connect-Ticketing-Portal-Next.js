"use client";

import { useParams, useRouter } from "next/navigation";
import DetailsPanel from "@/components/DetailsPanel";
import { ChevronLeft, Edit2, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { getTicketById } from "@/api/ticketingApis";
import { useTicketContext } from "@/context/TicketContext";

export default function TicketDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [isPrivate, setIsPrivate] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
  const [isApiKeyEditable, setIsApiKeyEditable] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const { selectedItem } = useTicketContext();

  useEffect(() => {
    async function fetchTicket() {
      try {
        setLoading(true);
        const response = await getTicketById(id);

        const ticketData = response?.data?.data?.[0];
        console.log("Fetched Ticket Data:", ticketData);
        setTicket(ticketData || null);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTicket();
  }, [id]);

  const handleSubmit = () => {
    console.log("Submitted Message:", message);
    alert("Message submitted! (See console for content)");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Loading ticket...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Ticket not found</h2>
        <p className="text-sm mt-2">No ticket with ID {id} exists.</p>
      </div>
    );
  }

  const CustomFieldModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 shadow-xl p-6 relative flex flex-col md:flex-row gap-6">
        {/* Left side – Form */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Create custom field
            </h3>
            <button
              onClick={() => setShowCustomFieldModal(false)}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Display Name */}
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Display name
          </label>
          <input
            type="text"
            placeholder="Name a custom field, e.g. order number"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />

          {/* Type */}
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 bg-white focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled hidden>
              Choose custom field type
            </option>
            <option value="single-line">Single-line text</option>
            <option value="multi-line">Multi-line text</option>
            <option value="link">Link</option>
            <option value="date">Date</option>
          </select>

          {/* Teams with access */}
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Teams with access
          </label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-3 bg-white focus:ring-1 focus:ring-blue-500">
            <option value="">Select who can see custom field values</option>
            <option value="all">All Teams</option>
            <option value="admin">Admins only</option>
            <option value="support">Support Team</option>
          </select>

          {/* Who can change */}
          <label className="block text-sm text-gray-700 font-medium mb-2">
            Who can change the custom field value?
          </label>
          <div className="space-y-2 text-sm text-gray-900 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="field-change-access"
                value="admin"
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Admins only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="field-change-access"
                value="admin_agent"
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Admins and agents</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="field-change-access"
                value="none"
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>No user (API integration)</span>
            </label>
          </div>

          {/* API Key Name */}
          <div className="flex items-center justify-between mt-3 mb-1">
            <label className="block text-sm text-gray-700 font-medium">
              API Key name
            </label>
            <button
              type="button"
              onClick={() => setIsApiKeyEditable((prev) => !prev)}
              className="text-blue-600 text-xs font-medium hover:underline"
            >
              {isApiKeyEditable ? "Lock" : "Edit"}
            </button>
          </div>
          <input
            type="text"
            placeholder="Type display name first"
            disabled={!isApiKeyEditable}
            className={`w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none ${
              !isApiKeyEditable ? "bg-gray-100 cursor-not-allowed" : "bg-white"
            }`}
          />

          {/* Footer buttons */}
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setShowCustomFieldModal(false)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
              Create
            </button>
          </div>
        </div>

        {/* Right side – Preview */}
        {/* Right side – Preview */}
        <div className="hidden md:block w-[40%] border-l border-gray-200 pl-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Preview</h4>

          {/* Preview cards */}
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-800 mb-3">
                Ticket info
              </h5>

              {selectedType === "single-line" && (
                <div className="space-y-2">
                  <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  <div className="h-2 w-32 bg-gray-200 rounded"></div>
                  <div className="h-2 w-20 bg-blue-500 rounded"></div>
                </div>
              )}

              {selectedType === "multi-line" && (
                <div className="space-y-2">
                  <div className="h-2 w-28 bg-gray-200 rounded"></div>
                  <div className="h-2 w-36 bg-gray-200 rounded"></div>
                  <div className="h-2 w-40 bg-blue-500 rounded"></div>
                  <div className="h-2 w-32 bg-blue-500 rounded"></div>
                </div>
              )}

              {selectedType === "link" && (
                <div className="space-y-2">
                  <div className="h-2 w-24 bg-gray-200 rounded"></div>
                  <div className="h-2 w-32 bg-gray-200 rounded"></div>
                  <div className="h-2 w-40 bg-blue-500 rounded"></div>
                </div>
              )}

              {selectedType === "date" && (
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  <div className="h-2 w-28 bg-gray-200 rounded"></div>
                  <div className="h-2 w-32 bg-blue-500 rounded"></div>
                </div>
              )}

              {!selectedType && (
                <p className="text-xs text-gray-500">
                  Choose a custom field type to see a preview here.
                </p>
              )}
            </div>

            {/* Responsibility */}
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <h5 className="text-sm font-semibold text-gray-800 mb-3">
                Responsibility
              </h5>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-2 w-28 bg-gray-200 rounded"></div>
                  <div className="h-2 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Full grid layout
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 🎟️ Left Grid (8 columns): Ticket Info */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex-1 flex flex-col bg-white min-h-screen">
            {/* 🔹 Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <ChevronLeft
                  onClick={() => router.push("/tickets")}
                  className="w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors"
                />
                <span className="text-sm text-gray-700 flex-1 font-medium">
                  {ticket?.title}
                </span>
                <Edit2 className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
            </div>

            {/* 🔹 Ticket Info Section */}
            <div className="p-6">
              {/* Map comments dynamically */}
              {ticket?.comments?.length > 0 ? (
                ticket.comments.map((comment, index) => (
                  <div
                    key={comment.id || index}
                    className="border border-gray-300 rounded-lg mb-4 bg-white overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gray-300 px-4 py-2 rounded-t-lg flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">
                        {comment.commenter_name || "Unknown"}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {(() => {
                          const created = new Date(comment.created_at);
                          const diffMs = Date.now() - created.getTime();
                          const diffMinutes = Math.floor(diffMs / 60000);
                          const diffHours = Math.floor(diffMs / 3600000);
                          const diffDays = Math.floor(diffHours / 24);

                          if (diffMinutes < 1) return "just now";
                          if (diffMinutes < 60)
                            return `about ${diffMinutes} minute${
                              diffMinutes > 1 ? "s" : ""
                            } ago`;
                          if (diffHours < 24)
                            return `about ${diffHours} hour${
                              diffHours > 1 ? "s" : ""
                            } ago`;
                          return `about ${diffDays} day${
                            diffDays > 1 ? "s" : ""
                          } ago`;
                        })()}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-800 leading-relaxed">
                      <p>
                        <span className="font-medium">From:</span>{" "}
                        <span className="text-gray-800">
                          appticket@brilliant.com.bd
                        </span>
                      </p>
                      <p className="mb-3">
                        <span className="font-medium">Reply to:</span>{" "}
                        <span className="text-gray-800">
                          ratonsarkar17d06a011@gmail.com
                        </span>
                      </p>

                      {/* Message */}
                      <div className="mt-2 whitespace-pre-line text-gray-800">
                        You have received a new enquiry from Brilliant FAQ
                        section:
                        {"\n\n"}IP Address: 182.48.65.10
                        {"\n\n"}Name: Raton Sarkar
                        {"\n"}Email: ratonsarkar17d06a011@gmail.com
                        {"\n"}Brilliant_Registered_Number: 01927355909
                        {"\n"}Issue: NID এর ছবি দিতে পারছি না।
                        {"\n"}gid: 39
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No messages found for this ticket.
                </p>
              )}
            </div>

            {/* 📝 Rich Text Editor */}
            <div className="border-t p-6 bg-white">
              <div className="mb-4 border rounded overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={message}
                  onChange={setMessage}
                  placeholder="Write your reply here..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image", "code-block"],
                      ["clean"],
                    ],
                  }}
                  className="bg-white"
                  style={{
                    height: "220px",
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                />
              </div>

              {/* 🔹 Bottom Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Private</span>
                  </label>
                  <button className="p-2 hover:bg-gray-100 rounded">#</button>
                  <button className="p-2 hover:bg-gray-100 rounded">📎</button>
                  <button className="p-2 hover:bg-gray-100 rounded text-blue-600">
                    A
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">@</button>
                </div>

                {/* Status + Submit */}
                <div className="flex items-center gap-3 relative">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-50 min-w-[120px]"
                    >
                      {status}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                        {["Open", "Pending", "Resolved", "Closed"].map(
                          (option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setStatus(option);
                                setDropdownOpen(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                status === option
                                  ? "bg-gray-50 font-semibold"
                                  : ""
                              }`}
                            >
                              {option}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 💬 Right Grid (4 columns): DetailsPanel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <DetailsPanel
            ticket={ticket}
            onOpenCustomFieldModal={() => setShowCustomFieldModal(true)}
            onTicketUpdated={() => {
              // ✅ Update the state immediately
              setTicket((prev) => ({ ...prev, is_resolved: "True" }));
            }}
          />
        </div>
      </div>

      {showCustomFieldModal && <CustomFieldModal />}
    </div>
  );
}
