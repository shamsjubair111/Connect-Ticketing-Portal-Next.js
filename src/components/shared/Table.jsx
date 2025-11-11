"use client";

import { useState } from "react";
import { ChevronDown, MoreHorizontal, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

const Table = ({ data, loading, columns }) => {
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
                onChange={() =>
                  setSelectedRows(
                    selectedRows.size === data.length
                      ? new Set()
                      : new Set(data.map((i) => i.ticket_id))
                  )
                }
                className="rounded"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.label}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600"
              >
                {col.label}
                {col.label === "LAST MESSAGE" && (
                  <ChevronDown className="inline w-4 h-4 ml-1" />
                )}
              </th>
            ))}
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.ticket_id}
              onClick={() => router.push(`/tickets/${row.ticket_id}`)}
              className="border-b border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50 hover:scale-[1.01]"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.ticket_id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    const newSel = new Set(selectedRows);
                    newSel.has(row.ticket_id)
                      ? newSel.delete(row.ticket_id)
                      : newSel.add(row.ticket_id);
                    setSelectedRows(newSel);
                  }}
                  className="rounded"
                />
              </td>

              {columns.map((col) => (
                <td key={col.value} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.value]}
                </td>
              ))}

              <td className="px-4 py-3">
                <button
                  className="p-1 hover:bg-gray-200 rounded"
                  onClick={(e) => e.stopPropagation()}
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
