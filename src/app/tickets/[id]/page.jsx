"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DetailsPanel from "@/components/DetailsPanel";
import { ChevronLeft, Edit2, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function TicketDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [isPrivate, setIsPrivate] = useState(false);

  // Dummy ticket data (you can later fetch from API)

  const handleSubmit = () => {
    console.log("Submitted Message:", message);
    alert("Message submitted! (See console for content)");
  };

  const data = [
    {
      id: 1,
      requester: {
        name: "Md. Jaidul Islam",
        email: "rimonkhan2872@gmail.com",
        avatar: "MI",
        color: "bg-purple-500",
      },
      subject:
        "OTP সম্পর্কিত সমস্যা | OTP কোডেই আসেনি | আমাদের বিক্রয় থেকে আপনার বাবুর্চি করছেন না | MNP করা নাই",
      agent: "unassigned",
      status: "Open",
      lastMessage: "less than a minute ago",
    },
    {
      id: 2,
      requester: {
        name: "Miraj",
        email: "mirajhosinmd4@gamil.com",
        avatar: "M",
        color: "bg-green-500",
      },
      subject:
        "OTP সম্পর্কিত সমস্যা | OTP কোডেই আসেনি | আমাদের বিক্রয় থেকে আপনার বাবুর্চি করছেন না | MNP করা আছে",
      agent: "unassigned",
      status: "Open",
      lastMessage: "less than a minute ago",
    },
    {
      id: 3,
      requester: {
        name: "রায় বানা বিদ্যা বিজয়ন",
        email: "ranamilon188@gmail.com",
        avatar: "রা",
        color: "bg-red-500",
      },
      subject: "NID এর ছবি নিতে পারছি না।",
      agent: "unassigned",
      status: "Open",
      lastMessage: "less than a minute ago",
    },
    {
      id: 4,
      requester: {
        name: "MD Hamidur rahman",
        email: "mdhamidurrahman886@...",
        avatar: "MR",
        color: "bg-purple-500",
      },
      subject:
        "রেজিস্ট্রেশন সম্পর্কিত সমস্যাগুলির NID পূর্ণ বিক্রয় হাইলাইট,পূর্বাভাস NID সম্পর্কিত করছে,পূর্বাভাস সাইট NID সম্পর্কিত নাম এর ৮ টা পার হয়েছে",
      agent: "CS-6 : IU",
      status: "Solved",
      lastMessage: "2 minutes ago",
    },
    {
      id: 5,
      requester: {
        name: "Phosil Hossen",
        email: "hossenphosil@gmail.com",
        avatar: "PH",
        color: "bg-purple-500",
      },
      subject: "NID এর ছবি নিতে পারছি না।",
      agent: "CS-18:KA",
      status: "Solved",
      lastMessage: "2 minutes ago",
    },
    {
      id: 6,
      requester: {
        name: "BRILLIANT CONNECT...",
        email: "sabujmahmudd37@gmail...",
        avatar: "BW",
        color: "bg-purple-500",
      },
      subject: "sabuj Mahmud",
      agent: "CS-6 : IU",
      status: "Solved",
      lastMessage: "2 minutes ago",
      hasEye: true,
    },
    {
      id: 7,
      requester: {
        name: "BRILLIANT CONNECT...",
        email: "mmojibur895@gmail.com",
        avatar: "BW",
        color: "bg-purple-500",
      },
      subject: "md mojibur",
      agent: "CS-6 : IU",
      status: "Solved",
      lastMessage: "3 minutes ago",
    },
    {
      id: 8,
      requester: {
        name: "karim Karim",
        email: "mk0911920@gmail.com",
        avatar: "KK",
        color: "bg-purple-500",
      },
      subject: "NID এর ছবি নিতে পারছি না।",
      agent: "CS-18:KA",
      status: "Solved",
      lastMessage: "3 minutes ago",
    },
    {
      id: 9,
      requester: {
        name: "Nieme",
        email: "niemehmed5@gmail.com",
        avatar: "N",
        color: "bg-purple-500",
      },
      subject:
        "OTP সম্পর্কিত সমস্যা | ২৪ ঘন্টা অপেক্ষা করতে বলা হয়েছে। ২৪ ঘন্টা পর ওটিপি পাবেন। অনুগ্রহ করে আমার OTP সিস্টেম করে দিন।",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 10,
      requester: {
        name: "MD Rabby Abraham",
        email: "rabbyabraham63@gmail...",
        avatar: "MA",
        color: "bg-green-500",
      },
      subject:
        "OTP সম্পর্কিত সমস্যা | OTP কোডেই আসেনি | আমাদের বিক্রয় থেকে আপনার বাবুর্চি করছেন না | MNP করা আছে",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 11,
      requester: {
        name: "Md Jahid",
        email: "asrafur2@gmail.com",
        avatar: "MJ",
        color: "bg-green-500",
      },
      subject: "আমার সমস্যাই এখানে বিস্তারিত লিখুন : আমার টাকা বিডিত স্থানে না",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 12,
      requester: {
        name: "Md Jahid",
        email: "asrafur2@gmail.com",
        avatar: "MJ",
        color: "bg-green-500",
      },
      subject: "আমার সমস্যাই এখানে বিস্তারিত লিখুন : আমার টাকা বিডিত স্থানে না",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 13,
      requester: {
        name: "Md Jahid",
        email: "asrafur2@gmail.com",
        avatar: "MJ",
        color: "bg-green-500",
      },
      subject: "আমার সমস্যাই এখানে বিস্তারিত লিখুন : আমার টাকা বিডিত স্থানে না",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 14,
      requester: {
        name: "Md Jahid",
        email: "asrafur2@gmail.com",
        avatar: "MJ",
        color: "bg-green-500",
      },
      subject: "আমার সমস্যাই এখানে বিস্তারিত লিখুন : আমার টাকা বিডিত স্থানে না",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
    {
      id: 15,
      requester: {
        name: "Md Jahid",
        email: "asrafur2@gmail.com",
        avatar: "MJ",
        color: "bg-green-500",
      },
      subject: "আমার সমস্যাই এখানে বিস্তারিত লিখুন : আমার টাকা বিডিত স্থানে না",
      agent: "unassigned",
      status: "Open",
      lastMessage: "5 minutes ago",
    },
  ];

  // ✅ Find matching ticket based on URL ID
  const ticket = useMemo(() => data.find((t) => t.id === Number(id)), [id]);

  if (!ticket) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">Ticket not found</h2>
        <p className="text-sm mt-2">No ticket with ID {id} exists.</p>
      </div>
    );
  }

  // ✅ Full grid layout
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Ticket #{ticket.id}
      </h1>

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
                  Ticket #{ticket.id}
                </span>
                <Edit2 className="w-4 h-4 text-gray-500 cursor-pointer" />
              </div>
            </div>

            {/* 🔹 Ticket Info Section */}
            <div className="p-6">
              <div className="bg-gray-50 border rounded-lg p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Ticket Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
                  <p>
                    <strong>Requester:</strong> {ticket.requester.name}{" "}
                    <span className="text-gray-500">
                      ({ticket.requester.email})
                    </span>
                  </p>
                  <p>
                    <strong>Agent:</strong> {ticket.agent}
                  </p>
                  <p className="col-span-2">
                    <strong>Subject:</strong> {ticket.subject}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-medium ${
                        ticket.status === "Open"
                          ? "text-blue-600"
                          : ticket.status === "Solved"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </p>
                  <p>
                    <strong>Last Message:</strong> {ticket.lastMessage}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {ticket.timestamp}
                  </p>
                </div>
              </div>
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
          <DetailsPanel />
        </div>
      </div>
    </div>
  );
}
