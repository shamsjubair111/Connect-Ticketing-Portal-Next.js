"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const Table = () => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const router = useRouter();

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

  const toggleRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item.id)));
    }
  };

  const getStatusColor = (status) => {
    return status === "Open" ? "text-blue-500" : "text-green-500";
  };

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedRows.size === data.length && data.length > 0}
                onChange={toggleAllRows}
                className="rounded"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              REQUESTER
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              SUBJECT
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              AGENT
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              STATUS
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              LAST MESSAGE <ChevronDown className="inline w-4 h-4 ml-1" />
            </th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(`/tickets/${row.id}`)}
              className="border-b border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50 hover:scale-[1.01]"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleRow(row.id)}
                  className="rounded"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${row.requester.color} flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    {row.requester.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {row.requester.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {row.requester.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700 line-clamp-2">
                    {row.subject}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{row.agent}</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {row.hasEye && <Eye className="w-4 h-4 text-gray-400" />}
                  <span className="text-sm text-gray-600">
                    {row.lastMessage}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
