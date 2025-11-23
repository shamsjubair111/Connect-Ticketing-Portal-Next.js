"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

export default function PriorityList({ data, setEditData, setDeleteData }) {
  const priorities = Array.isArray(data) ? data : [];

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-[80%]">
              Name
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 w-[20%]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {priorities.map((item, idx) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 transition-all duration-200 ease-in-out ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 hover:scale-[1.01]`}
            >
              {/* Name fully left */}
              <td className="px-4 py-3 text-sm text-gray-800">
                <span className="font-medium">{item.name}</span>
              </td>

              {/* Actions fully right */}
              <td className="px-4 py-3 text-sm">
                <div className="flex justify-end gap-4 pr-1">
                  <FaEdit
                    className="text-primary cursor-pointer hover:text-blue-600"
                    onClick={() => setEditData(item)}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer hover:text-red-700"
                    onClick={() => setDeleteData(item)}
                  />
                </div>
              </td>
            </tr>
          ))}

          {priorities.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-6 text-gray-500 italic">
                No priorities found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
