"use client";

import { useParams, useRouter } from "next/navigation";
import DetailsPanel from "@/components/DetailsPanel";
import { ChevronLeft, Edit2, FileText, Download } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import TurndownService from "turndown";
import { jwtDecode } from "jwt-decode";
import {
  getTicketById,
  addComment,
  getPresignedPost,
  postAttachmentToS3,
  changeTicketStatus,
} from "@/api/ticketingApis";
import { useTicketContext } from "@/context/TicketContext";
import { alertContext } from "@/hooks/alertContext";
import { useContext } from "react";
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
  const [status, setStatus] = useState("Open");
  const [statusLoading, setStatusLoading] = useState(false);

  const { selectedItem } = useTicketContext();
  const { setAlertCtx } = useContext(alertContext);

  // Helper function to check if URL is an image - STRICT checking
  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    const urlLower = url.toLowerCase();
    const urlWithoutQuery = urlLower.split("?")[0];
    return imageExtensions.some((ext) => urlWithoutQuery.endsWith(ext));
  };

  // Helper function to get file extension
  const getFileExtension = (url) => {
    try {
      const urlWithoutParams = url.split("?")[0];
      const parts = urlWithoutParams.split(".");
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
    } catch {
      return "";
    }
  };

  // Helper function to get file name from URL
  const getFileName = (url) => {
    try {
      const urlWithoutParams = url.split("?")[0];
      const parts = urlWithoutParams.split("/");
      let fileName = decodeURIComponent(parts[parts.length - 1]);

      if (fileName.length > 40) {
        const ext = getFileExtension(url);
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));
        fileName =
          nameWithoutExt.substring(0, 30) + "..." + (ext ? `.${ext}` : "");
      }

      return fileName;
    } catch {
      return "Download File";
    }
  };

  // Helper function to get file icon based on extension
  const getFileIcon = (url) => {
    const ext = getFileExtension(url);

    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
      case "csv":
        return "📊";
      case "zip":
      case "rar":
      case "7z":
        return "🗜️";
      case "txt":
        return "📃";
      case "ppt":
      case "pptx":
        return "📽️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
        return "🎵";
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return "💻";
      case "json":
      case "xml":
        return "📋";
      case "svg":
        return "🎨";
      case "crt":
      case "key":
      case "pem":
        return "🔐";
      default:
        return "📎";
    }
  };

  // Get file type label
  const getFileTypeLabel = (url) => {
    const ext = getFileExtension(url);
    return ext ? ext.toUpperCase() : "FILE";
  };

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

  // Sync status with ticket data
  useEffect(() => {
    if (!ticket?.ticket_status) return;

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
  }, [ticket?.ticket_status]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      setStatusLoading(true);
      setStatus(newStatus);

      let apiStatus = newStatus;
      if (newStatus === "Solved") {
        apiStatus = "closed";
      }

      const payload = {
        ticket_id: id,
        status: apiStatus.toLowerCase().split(" ").join("_"),
      };

      await changeTicketStatus(payload);
      setRefresh(Math.random());

      setAlertCtx({
        title: "Success!",
        message: `Status updated to ${newStatus}`,
        type: "success",
      });
    } catch (err) {
      console.error("Status update failed:", err);
      // Revert status on error
      if (ticket?.ticket_status) {
        let revertStatus = ticket.ticket_status;
        if (revertStatus === "closed") {
          setStatus("Solved");
        } else {
          setStatus(
            revertStatus
              .replace("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          );
        }
      }
      setAlertCtx({
        title: "Error",
        message: err.response?.data?.message || "Failed to update status",
        type: "error",
      });
    } finally {
      setStatusLoading(false);
    }
  };

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

  // 🧩 Submit comment - FIXED to avoid duplicate attachments
  const handleSubmit = async () => {
    try {
      // Don't strip images from the message - keep them embedded
      const htmlMessage = message;

      // Extract image URLs from the HTML
      const imageRegex = /<img[^>]+src="([^">]+)"/g;
      const embeddedImages = [];
      let match;
      while ((match = imageRegex.exec(htmlMessage)) !== null) {
        embeddedImages.push(match[1]);
      }

      // Get non-image attachments (files) - these are NOT embedded in the message
      const nonImageAttachments = attachments.filter(
        (url) => !isImageFile(url),
      );

      const turndownService = new TurndownService();
      const markdownMessage = turndownService.turndown(htmlMessage).trim();

      // Combine all unique attachments using Set to avoid duplicates
      const allAttachments = [
        ...new Set([...embeddedImages, ...nonImageAttachments]),
      ];

      const payload = {
        ticket_id: id,
        is_internal: userType === "agent" ? false : isPrivate,
        message: markdownMessage,
        attachments: allAttachments,
      };

      console.log("Submitting payload:", payload); // Debug log

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

  // 🖼️ Upload file to S3 using API functions
  const uploadToS3 = async (file) => {
    try {
      const presignRes = await getPresignedPost({ object_name: file.name });
      const data = presignRes.data.data;
      const publicUrl = presignRes.data.public_url;

      const formData = new FormData();
      Object.entries(data.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      await postAttachmentToS3(data.url, formData);

      return publicUrl;
    } catch (err) {
      console.error("❌ Error uploading file:", err);
      alert("File upload failed.");
      return null;
    }
  };

  // 🖼️ Custom image handler for multiple files (images only)
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

        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", publicUrl);
        quill.insertText(range.index + 1, "\n");
        quill.setSelection(range.index + 2);

        // Add to attachments for tracking
        setAttachments((prev) => [...prev, publicUrl]);
      }
    };

    input.click();
  };

  // 📎 Custom file handler for non-image files
  const fileHandler = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.multiple = true;

    input.onchange = async () => {
      const files = Array.from(input.files);
      if (files.length === 0) return;

      for (const file of files) {
        const publicUrl = await uploadToS3(file);
        if (!publicUrl) continue;

        setAttachments((prev) => [...prev, publicUrl]);
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

  // Render message with embedded images
  const MessageRenderer = ({ message, attachments }) => {
    if (!message) return null;

    // Check if message contains markdown image syntax
    const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const hasMarkdownImages = markdownImageRegex.test(message);

    if (!hasMarkdownImages) {
      // Simple text message - render normally with attachments below
      return (
        <>
          <p className="text-sm md:text-base text-gray-700 whitespace-pre-line break-words mb-3">
            {message}
          </p>
          {attachments?.length > 0 && (
            <div className="mt-3">
              <AttachmentRenderer attachments={attachments} />
            </div>
          )}
        </>
      );
    }

    // Message has embedded images - parse and render inline
    const parts = [];
    let lastIndex = 0;
    markdownImageRegex.lastIndex = 0; // Reset regex

    message.replace(markdownImageRegex, (match, alt, url, offset) => {
      // Add text before image
      if (offset > lastIndex) {
        parts.push({
          type: "text",
          content: message.slice(lastIndex, offset),
        });
      }

      // Add image
      parts.push({
        type: "image",
        url: url,
        alt: alt,
      });

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < message.length) {
      parts.push({
        type: "text",
        content: message.slice(lastIndex),
      });
    }

    // Get non-image attachments for rendering at the end
    const nonImageAttachments =
      attachments?.filter((url) => !isImageFile(url)) || [];

    return (
      <>
        <div className="text-sm md:text-base text-gray-700 break-words mb-3">
          {parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <span key={index} className="whitespace-pre-line">
                  {part.content}
                </span>
              );
            } else {
              return (
                <img
                  key={index}
                  src={part.url}
                  alt={part.alt}
                  onClick={() =>
                    setPreviewImage(previewImage === part.url ? null : part.url)
                  }
                  className="max-w-full h-auto my-2 rounded border cursor-pointer hover:opacity-80"
                />
              );
            }
          })}
        </div>
        {nonImageAttachments.length > 0 && (
          <div className="mt-3">
            <AttachmentRenderer attachments={nonImageAttachments} />
          </div>
        )}
      </>
    );
  };

  // Component to render attachments (images and files)
  const AttachmentRenderer = ({ attachments }) => {
    if (!attachments || attachments.length === 0) return null;

    const images = attachments.filter(isImageFile);
    const files = attachments.filter((url) => !isImageFile(url));

    return (
      <div className="space-y-4">
        {/* Render Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-4">
            {images.map((url, index) => (
              <img
                key={`img-${index}`}
                src={url}
                alt={`attachment-${index}`}
                onClick={() =>
                  setPreviewImage(previewImage === url ? null : url)
                }
                className={`w-full md:w-40 h-32 md:h-40 object-cover rounded border cursor-pointer transition 
                  ${
                    previewImage === url
                      ? "scale-105 ring-4 ring-blue-400"
                      : "hover:opacity-80"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Render Non-Image Files */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((url, index) => (
              <a
                key={`file-${index}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition group cursor-pointer"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded bg-blue-50 group-hover:bg-blue-100">
                  <span className="text-xl">{getFileIcon(url)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {getFileName(url)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileTypeLabel(url)} • Click to open in new tab
                  </p>
                </div>
                <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 🌀 UI states
  if (loading)
    return (
      <div className="p-6 md:p-10 text-center text-gray-600">
        <h2 className="text-lg md:text-xl font-semibold">Loading ticket...</h2>
      </div>
    );

  if (error)
    return (
      <div className="p-6 md:p-10 text-center text-red-600">
        <h2 className="text-lg md:text-xl font-semibold">Error</h2>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );

  if (!ticket)
    return (
      <div className="p-6 md:p-10 text-center text-gray-600">
        <h2 className="text-lg md:text-xl font-semibold">Ticket not found</h2>
      </div>
    );

  // ✅ Render full page with responsive layout
  return (
    <div className="p-3 md:p-6 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        {/* 🎟️ Left Side - Main Content */}
        <div className="lg:col-span-8 bg-white p-3 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="border-b p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <ChevronLeft
                onClick={() => router.push("/tickets")}
                className="w-5 h-5 cursor-pointer hover:text-blue-600 flex-shrink-0"
              />
              <span className="text-xs md:text-sm text-gray-700 flex-1 font-medium truncate">
                {ticket?.title}
              </span>
              <Edit2 className="w-4 h-4 text-gray-500 cursor-pointer flex-shrink-0" />
            </div>
          </div>

          {/* Info */}
          <div className="p-3 md:p-6 border-b text-xs md:text-sm text-gray-700 leading-relaxed space-y-1">
            <p className="break-words">
              <b>Ticket ID:</b> {ticket.ticket_id}
            </p>
            <p className="break-words">
              <b>Issued To:</b> {ticket.issued_to}
            </p>
            <p className="break-words">
              <b>Issued By:</b> {ticket.issuer_number}
            </p>
            <p className="break-words">
              <b>Problematic Number:</b> {ticket.problematic_number}
            </p>
            <p className="break-words">
              <b>Description:</b> {ticket.description}
            </p>
          </div>

          {/* Attachments (From Ticket Details) */}
          {ticket.attachments?.length > 0 && (
            <div className="p-3 md:p-6 border-b bg-white">
              <h3 className="text-base md:text-lg font-semibold mb-3">
                Attachments
              </h3>
              <AttachmentRenderer attachments={ticket.attachments} />
            </div>
          )}

          {/* Comments */}
          <div className="p-3 md:p-6">
            <h3 className="text-base md:text-lg font-semibold mb-3">
              Comments
            </h3>

            {ticket.comments?.length > 0 ? (
              ticket.comments.map((comment, i) => (
                <div
                  key={comment.id || i}
                  className="mb-4 border rounded-lg p-3 md:p-4 bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-2 sm:items-center">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm md:text-base">
                        {comment.commenter_name || "Unknown"}
                      </span>

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

                  <MessageRenderer
                    message={comment.message}
                    attachments={comment.attachments}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">No comments yet.</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t p-3 md:p-6 bg-white">
            <div className="mb-4 border rounded overflow-hidden">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={message}
                onChange={setMessage}
                placeholder="Write your reply..."
                modules={modules}
                className="bg-white"
                style={{ height: "180px", overflowY: "auto" }}
              />
            </div>

            {/* Show attached non-image files preview */}
            {attachments.filter((url) => !isImageFile(url)).length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-gray-600 font-medium">
                  Attached files (
                  {attachments.filter((url) => !isImageFile(url)).length}):
                </p>
                <AttachmentRenderer
                  attachments={attachments.filter((url) => !isImageFile(url))}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {userType !== "agent" && userType !== "customer" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs md:text-sm text-gray-700">
                      {isPrivate ? "Internal Comment" : "External Comment"}
                    </span>
                  </label>
                )}
              </div>

              {/* Status dropdown and Submit button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Status Dropdown - only visible for certain user types */}
                {userType !== "agent" &&
                  userType !== "customer" &&
                  userType !== "pbx_user" && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
                        Status:
                      </label>
                      <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={statusLoading}
                        className={`rounded border border-gray-300 bg-white px-2 py-1.5 text-xs md:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          statusLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Solved">Solved</option>
                      </select>
                    </div>
                  )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className={`w-full sm:w-auto px-4 md:px-6 py-2 rounded text-white text-sm md:text-base
    ${
      isSubmitDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-gray-900"
    }`}
                  style={{ cursor: "pointer" }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Details Panel */}
        <div className="lg:col-span-4 bg-white p-3 md:p-6 rounded-lg border border-gray-200 shadow-sm">
          <DetailsPanel
            ticket={ticket}
            onTicketUpdated={() => setRefresh(Math.random())}
          />
        </div>
      </div>

      {/* 🖼️ Image Preview Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-lg border border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
