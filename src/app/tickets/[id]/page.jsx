"use client";

import { useParams, useRouter } from "next/navigation";
import DetailsPanel from "@/components/DetailsPanel";
import { ChevronLeft, Edit2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import TurndownService from "turndown";
import { jwtDecode } from "jwt-decode";
import {
  getTicketById,
  addComment,
  getPresignedPost,
  postAttachmentToS3,
} from "@/api/ticketingApis";
import { useTicketContext } from "@/context/TicketContext";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function TicketDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const quillRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userType, setUserType] = useState("");

  const { selectedItem } = useTicketContext();

  // Get user type from JWT
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUserType(decoded?.user_type);
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }, []);

  // 🧩 Fetch ticket data + comments
  useEffect(() => {
    async function fetchTicket() {
      try {
        setLoading(true);
        const res = await getTicketById(id);
        const ticketData = res?.data?.data?.[0];
        setTicket(ticketData || null);
      } catch (err) {
        console.error("❌ Error fetching ticket:", err);
        setError("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTicket();
  }, [id, refresh]);

  // Check if editor is empty
  const isEditorEmpty = (html) => {
    const clean = html
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p><\/p>/g, "")
      .replace(/<br>/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();

    return clean.length === 0;
  };

  // 🧩 Submit comment
  const handleSubmit = async () => {
    try {
      const latestAttachments = [...attachments];

      const turndownService = new TurndownService();
      const cleanedMessage = message.replace(/<img[^>]*>/g, "");
      const markdownMessage = turndownService.turndown(cleanedMessage).trim();

      const payload = {
        ticket_id: id,
        is_internal: userType === "agent" ? false : isPrivate,
        message: markdownMessage,
        attachments: latestAttachments,
      };

      await addComment(payload);

      setMessage("");
      setAttachments([]);
      setRefresh(Math.random());
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert("Failed to submit comment. Please try again.");
    }
  };

  const isSubmitDisabled =
    (attachments.length > 0 && isEditorEmpty(message)) || loading;

  // 🖼️ Upload image to S3 using API functions
  const uploadToS3 = async (file) => {
    try {
      // 1️⃣ Get presigned data using the API function
      const presignRes = await getPresignedPost({ object_name: file.name });
      const data = presignRes.data.data;
      const publicUrl = presignRes.data.public_url;

      // 2️⃣ Build FormData
      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      // 3️⃣ Upload using helper function
      await postAttachmentToS3(data.url, formData);

      // 4️⃣ Return uploaded file URL
      return publicUrl;
    } catch (err) {
      console.error("❌ Error uploading image:", err);
      alert("Image upload failed.");
      return null;
    }
  };

  // 🖼️ Custom image handler for multiple files
  const imageHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    input.onchange = async () => {
      const files = Array.from(input.files);
      if (files.length === 0) return;
      const quill = quillRef.current.getEditor();

      for (const file of files) {
        const publicUrl = await uploadToS3(file);
        if (!publicUrl) continue;

        // Insert image into editor
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", publicUrl);
        quill.insertText(range.index + 1, "\n");
        quill.setSelection(range.index + 2);

        // Save to attachments
        setAttachments((prev) => {
          const updated = [...prev, publicUrl];
          console.log("Updated attachments:", updated);
          return updated;
        });
      }
    };

    input.click();
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image", "code-block"],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [],
  );

  // 🌀 UI states
  if (loading)
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Loading ticket...</h2>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );

  if (!ticket)
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Ticket not found</h2>
      </div>
    );

  // ✅ Render full page
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 🎟️ Left Side */}
        <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <ChevronLeft
                onClick={() => router.push("/tickets")}
                className="w-5 h-5 cursor-pointer hover:text-blue-600"
              />
              <span className="text-sm text-gray-700 flex-1 font-medium">
                {ticket?.title}
              </span>
              <Edit2 className="w-4 h-4 text-gray-500 cursor-pointer" />
            </div>
          </div>

          {/* Info */}
          <div className="p-6 border-b text-sm text-gray-700 leading-relaxed">
            <p>
              <b>Ticket ID:</b> {ticket.ticket_id}
            </p>
            <p>
              <b>Issued To:</b> {ticket.issued_to}
            </p>
            <p>
              <b>Issued By:</b> {ticket.issuer_number}
            </p>
          </div>

          {/* Attachments (From Ticket Details) */}
          {ticket.attachments?.length > 0 && (
            <div className="p-6 border-b bg-white">
              <h3 className="text-lg font-semibold mb-3">Attachments</h3>

              <div className="flex flex-wrap gap-4">
                {ticket.attachments.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`attachment-${index}`}
                    onClick={() =>
                      setPreviewImage(previewImage === url ? null : url)
                    }
                    className={`w-40 h-40 object-cover rounded border cursor-pointer transition 
            ${
              previewImage === url
                ? "scale-105 ring-4 ring-blue-400"
                : "hover:opacity-80"
            }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Comments</h3>

            {ticket.comments?.length > 0 ? (
              ticket.comments.map((comment, i) => (
                <div
                  key={comment.id || i}
                  className="mb-4 border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between mb-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {comment.commenter_name || "Unknown"}
                      </span>

                      {/* 🔥 INTERNAL / EXTERNAL BADGE */}
                      {comment.is_internal && (
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-600 text-white">
                          Internal
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-700 whitespace-pre-line">
                    {comment.message || ""}
                  </p>

                  {comment.attachments?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {comment.attachments.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`attachment-${index}`}
                          onClick={() =>
                            setPreviewImage(previewImage === url ? null : url)
                          }
                          className={`w-40 h-40 object-cover rounded border cursor-pointer transition ${
                            previewImage === url
                              ? "scale-105 ring-4 ring-blue-400"
                              : "hover:opacity-80"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">No comments yet.</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t p-6 bg-white">
            <div className="mb-4 border rounded overflow-hidden">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={message}
                onChange={setMessage}
                placeholder="Write your reply..."
                modules={modules}
                className="bg-white"
                style={{ height: "220px", overflowY: "auto" }}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              {userType !== "agent" && userType !== "customer" && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    {isPrivate ? "Internal Comment" : "External Comment"}
                  </span>
                </label>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={`px-6 py-2 rounded text-white 
    ${
      isSubmitDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-gray-900"
    }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <DetailsPanel
            ticket={ticket}
            onTicketUpdated={() => setRefresh(Math.random())}
          />
        </div>
      </div>

      {/* 🖼️ Image Preview Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg border border-white cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
