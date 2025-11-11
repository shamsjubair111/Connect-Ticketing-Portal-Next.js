"use client";

import React, { useContext, useState } from "react";
import { Button } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { alertContext } from "@/hooks/alertContext";
import { deleteUser, editUser } from "@/api/ticketingApis";

const UserList = ({ data, getData }) => {
  const { setAlertCtx } = useContext(alertContext);
  const [editMode, setEditMode] = useState("");
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");

  const userTypes = ["cc", "agent", "customer", "iptsp", "rs", "oss_bss"];
  const roles = ["user", "moderator", "support"];
  const users = Array.isArray(data) ? data : [];

  const handleEdit = (item) => {
    setEditMode(item._id);
    setEditData(item);
  };

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleSave = async (id) => {
    try {
      await editUser(id, editData);
      setEditMode("");
      await getData();
      setAlertCtx({
        title: "Success!",
        message: "User updated successfully",
        type: "success",
      });
    } catch (err) {
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Something went wrong while saving changes.",
        type: "error",
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userId);
      await getData();
      setAlertCtx({
        title: "Success!",
        message: "User deleted successfully",
        type: "success",
      });
    } catch (err) {
      setAlertCtx({
        message:
          err.response?.data?.message || "Something went wrong while deleting.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Brilliant Number
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              User Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Role
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Created At
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={user._id}
              className={`border-b border-gray-200 transition-all duration-200 ease-in-out ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 hover:scale-[1.01]`}
            >
              {/* Name */}
              <td className="px-4 py-3 text-sm text-gray-800">
                {editMode === user._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-sm w-full"
                  />
                ) : (
                  <span className="font-medium">{user.name}</span>
                )}
              </td>

              {/* Brilliant Number */}
              <td className="px-4 py-3 text-sm text-gray-700">
                +{user.brilliant_number}
              </td>

              {/* Phone */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {user.phone_number ? `+${user.phone_number}` : "—"}
              </td>

              {/* User Type */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {editMode === user._id ? (
                  <select
                    name="user_type"
                    value={editData.user_type}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {userTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{user.user_type}</span>
                )}
              </td>

              {/* Role */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {editMode === user._id ? (
                  <select
                    name="role"
                    value={editData.role}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{user.role}</span>
                )}
              </td>

              {/* Created At */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {new Date(user.created_at).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                {editMode === user._id ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleSave(user._id)}
                      className="cursor-pointer text-green-600 hover:text-green-700 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode("")}
                      className="text-gray-500 hover:text-gray-600 text-sm cursor-pointer"
                    >
                      Undo
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <FaEdit
                      className="text-primary cursor-pointer hover:text-blue-600"
                      onClick={() => handleEdit(user)}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user._id);
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Delete Confirmation Modal (same as GroupList) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-gray-700">
              Are you sure you want to delete this{" "}
              <span className="font-semibold">user</span>?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDelete();
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
