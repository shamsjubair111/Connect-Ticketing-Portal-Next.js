"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const Table = ({ data, loading }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const router = useRouter();

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
      setSelectedRows(new Set(data.map((item) => item?.ticket_id)));
    }
  };

  const getStatusColor = (status) => {
    return status === "open"
      ? "text-blue-700"
      : status === "in_progress"
      ? "text-green-700"
      : "text-red-700";
  };

  const getLatestCommentTime = (comments) => {
    if (!comments || comments.length === 0) return "No comments yet";

    const latest = [...comments].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];

    const latestDate = new Date(latest.created_at);
    const now = new Date();
    const diffMs = now - latestDate;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
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
              key={row?.ticket_id}
              onClick={() => router.push(`/tickets/${row.ticket_id}`)}
              className="border-b border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50 hover:scale-[1.01]"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row?.ticket_id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleRow(row?.ticket_id)}
                  className="rounded"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    MI
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Md. Jaidul Islam
                    </div>
                    <div className="text-xs text-gray-500">
                      rimonkhan2872@gmail.com
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  {/* <span className="text-gray-400 mt-1">•</span> */}
                  <span className="text-sm text-gray-700 line-clamp-2">
                    {row?.title}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">Unassigned</span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    row?.ticket_status
                  )}`}
                >
                  {row?.ticket_status === "open"
                    ? "Open"
                    : row?.ticket_status === "in_progress"
                    ? "In\u00A0Progress"
                    : row?.ticket_status === "closed"
                    ? "Solved"
                    : null}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {row.hasEye && <Eye className="w-4 h-4 text-gray-400" />}
                  <span className="text-sm text-gray-600">
                    {getLatestCommentTime(row?.comments)}
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
