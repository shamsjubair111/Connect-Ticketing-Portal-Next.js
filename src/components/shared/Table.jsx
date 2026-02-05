"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import MyModal from "@/common/MyModal";
import { useContext } from "react";
import { alertContext } from "@/hooks/alertContext";
import { moveTicketToTrash } from "@/api/ticketingApis";
import { jwtDecode } from "jwt-decode";

const Table = ({ data, loading, columns, reload, page }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [trashTicketId, setTrashTicketId] = useState(null);
  const [userType, setUserType] = useState("");
  const router = useRouter();
  const { setAlertCtx } = useContext(alertContext);

  // Get user type from JWT
  useEffect(() => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserType(decoded?.user_type || "");
      }
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }, []);

  // Check if user can see action column
  const canSeeActions =
    userType !== "agent" && userType !== "customer" && userType !== "pbx_user";

  const toggleRow = (id) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const toggleAllRows = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item.ticket_id)));
    }
  };

  return (
    <>
      {/* ====================== TRASH MODAL ====================== */}
      {showTrashModal && (
        <MyModal
          toggle={showTrashModal}
          title="Send to Trash"
          closeMethod={() => setShowTrashModal(false)}
          submitMethod={async () => {
            try {
              const payload = { ticket_id: trashTicketId };
              const res = await moveTicketToTrash(payload);

              setAlertCtx({
                title: "Success",
                message: res?.data?.message || "Ticket moved to trash",
                type: "success",
              });

              setShowTrashModal(false);

              // Optional: refresh parent page if needed
              reload(page);
            } catch (err) {
              console.error("Trash error:", err);
              setAlertCtx({
                title: "Error",
                message:
                  err?.response?.data?.message ||
                  "Failed to move ticket to trash",
                type: "error",
              });
            }
          }}
          body={
            <p className="text-sm text-gray-700 text-center">
              Are you sure you want to move this ticket to trash?
            </p>
          }
        />
      )}

      {/* ====================== TABLE ====================== */}
      <div
        className="w-full bg-white rounded-sm border border-gray-200"
        style={{ overflowX: "scroll" }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={toggleAllRows}
                  className="cursor-pointer"
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

              {/* Only show ACTION column if user has permission */}
              {canSeeActions && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  ACTION
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.ticket_id}
                onClick={() => router.push(`/tickets/${row.ticket_id}`)}
                className="border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.ticket_id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleRow(row.ticket_id)}
                    className="cursor-pointer"
                  />
                </td>

                {columns.map((col) => (
                  <td key={col.value} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.value]}
                  </td>
                ))}

                {/* Only show ACTION cell if user has permission */}
                {canSeeActions && (
                  <td className="px-4 py-3">
                    <button
                      className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrashTicketId(row.ticket_id);
                        setShowTrashModal(true);
                      }}
                    >
                      <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
