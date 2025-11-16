"use client";

import React, { useContext, useState } from "react";
import { Button } from "flowbite-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import AddSubgroup from "./AddSubgroup";
import { alertContext } from "@/hooks/alertContext";
import {
  deleteGroup,
  deleteSubgroup,
  editGroup,
  editSubgroup,
} from "@/api/ticketingApis";

const GroupList = ({ data, getSubgroup, resetToFirstPage }) => {
  const [editMode, setEditMode] = useState("");
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [subgroupId, setSubgroupId] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const { setAlertCtx } = useContext(alertContext); // ✅ unified alert context
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groups = Array.isArray(data) ? data : [];

  const closeModal = () => {
    setIsModalOpen(false);
    setGroupId("");
  };

  const handleEdit = (item, type) => {
    setEditMode(item._id);
    setEditData(item);
    setDeleteType(type);
  };

  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  // ✅ Edit Group / Subgroup
  const handleSave = async (groupId, subId) => {
    try {
      if (deleteType === "group") {
        const res = await editGroup(groupId, editData.group_name);
        setEditMode("");
        resetToFirstPage();
        await getSubgroup();
        resetToFirstPage();
        setAlertCtx({
          title: "Success!",
          message: res.data?.message || "Group updated successfully",
          type: "success",
        });
      } else {
        const res = await editSubgroup(
          groupId,
          subId,
          editData.sub_group_bn,
          editData.sub_group_en
        );
        setEditMode("");
        await getSubgroup();
        resetToFirstPage();
        setAlertCtx({
          title: "Success!",
          message: res.data?.message || "Subgroup updated successfully",
          type: "success",
        });
      }
    } catch (err) {
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Something went wrong while saving changes.",
        type: "error",
      });
    }
  };

  // ✅ Delete Group / Subgroup
  const confirmDelete = async () => {
    try {
      if (deleteType === "group") {
        await deleteGroup(groupId);
      } else {
        await deleteSubgroup(groupId, subgroupId);
      }
      resetToFirstPage();
      await getSubgroup();
      setAlertCtx({
        title: "Success!",
        message: `Successfully deleted ${
          deleteType === "group" ? "group" : "sub-group"
        }`,
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
              Group Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Sub Groups
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Add Subgroup
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group, index) => (
            <tr
              key={group._id}
              className={`border-b border-gray-200 transition-all duration-200 ease-in-out ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 hover:scale-[1.01]`}
            >
              {/* Group Name */}
              <td className="px-4 py-3 text-sm text-gray-800">
                {editMode === group._id && deleteType === "group" ? (
                  <input
                    type="text"
                    name="group_name"
                    value={editData.group_name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 text-sm w-full"
                  />
                ) : (
                  <span className="font-medium">{group.group_name}</span>
                )}
              </td>

              {/* Sub Groups */}
              <td className="px-4 py-3 text-sm text-gray-700">
                {group?.sub_groups?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {group.sub_groups.map((sub) => (
                      <div
                        key={sub._id}
                        className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                      >
                        {editMode === sub._id && deleteType === "subGroup" ? (
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              name="sub_group_bn"
                              value={editData.sub_group_bn}
                              onChange={handleChange}
                              placeholder="Bangla name"
                              className="border rounded px-1 py-0.5 text-xs w-[100px]"
                            />
                            <input
                              type="text"
                              name="sub_group_en"
                              value={editData.sub_group_en}
                              onChange={handleChange}
                              placeholder="English name"
                              className="border rounded px-1 py-0.5 text-xs w-[100px]"
                            />
                            <button
                              className="text-green-600 text-xs hover:text-green-700 cursor-pointer"
                              onClick={() => handleSave(group._id, sub._id)}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-500 text-xs hover:text-gray-600 cursor-pointer"
                              onClick={() => setEditMode("")}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="mr-2">{sub.sub_group_bn}</span>
                            <FaEdit
                              className="mx-1 text-primary cursor-pointer hover:text-blue-600"
                              onClick={() => handleEdit(sub, "subGroup")}
                            />
                            <FaTrash
                              className="mx-1 text-red-600 cursor-pointer hover:text-red-700"
                              onClick={() => {
                                setShowModal(true);
                                setGroupId(group._id);
                                setSubgroupId(sub._id);
                                setDeleteType("subGroup");
                              }}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    No subgroups
                  </span>
                )}
              </td>

              {/* Add Subgroup */}
              <td className="px-4 py-3">
                <Button
                  className="cursor-pointer"
                  color="blue"
                  size="xs"
                  onClick={() => {
                    setGroupId(group._id);
                    setIsModalOpen(true);
                  }}
                >
                  Add
                  <FaCirclePlus className="ml-2" />
                </Button>
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                {editMode === group._id && deleteType === "group" ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleSave(group._id, "noId")}
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
                      onClick={() => handleEdit(group, "group")}
                    />
                    <FaTrash
                      className="text-red-600 cursor-pointer hover:text-red-700"
                      onClick={() => {
                        setShowModal(true);
                        setGroupId(group._id);
                        setDeleteType("group");
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Delete Confirmation Modal (light background) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="text-gray-700">
              Are you sure you want to delete this{" "}
              <span className="font-semibold">
                {deleteType === "group" ? "group" : "sub-group"}
              </span>
              ?
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

      {/* Add Subgroup Modal */}
      <AddSubgroup
        isOpen={isModalOpen}
        onClose={closeModal}
        groupId={groupId}
        getSubgroup={getSubgroup}
        resetToFirstPage={resetToFirstPage}
      />
    </div>
  );
};

export default GroupList;
