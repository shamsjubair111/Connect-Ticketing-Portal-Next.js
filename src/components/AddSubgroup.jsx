"use client";

import { Button, Label, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import { alertContext } from "@/hooks/alertContext";
import { createSubGroup } from "@/api/ticketingApis";

const AddSubgroup = ({
  isOpen,
  onClose,
  groupId,
  getSubgroup,
  resetToFirstPage,
}) => {
  const [subgroupBn, setSubgroupBn] = useState("");
  const [subgroupEn, setSubgroupEn] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAlertCtx } = useContext(alertContext);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!subgroupBn.trim() || !subgroupEn.trim()) {
      setAlertCtx({
        message: "Please fill in both Bangla and English subgroup titles.",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        sub_groups: [
          {
            sub_group_bn: subgroupBn,
            sub_group_en: subgroupEn,
          },
        ],
      };

      const res = await createSubGroup(groupId, payload);
      setAlertCtx({
        title: "Success!",
        message: res.data?.message || "Subgroup created successfully.",
        type: "success",
      });

      await getSubgroup(); // refresh list
      resetToFirstPage();
      setSubgroupBn("");
      setSubgroupEn("");
      onClose(); // close modal
    } catch (err) {
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Something went wrong while creating subgroup.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="relative bg-white w-full max-w-md sm:max-w-lg rounded-lg shadow-lg p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <ImCross size={16} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-blue-700 mb-4 flex items-center justify-center">
          Create A New Subgroup
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="subgroupBn" className="text-gray-700">
              Subgroup Title (Bangla)
            </Label>
            <TextInput
              id="subgroupBn"
              type="text"
              placeholder="বাংলা নাম লিখুন"
              value={subgroupBn}
              onChange={(e) => setSubgroupBn(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="subgroupEn" className="text-gray-700">
              Subgroup Title (English)
            </Label>
            <TextInput
              id="subgroupEn"
              type="text"
              placeholder="Enter English title"
              value={subgroupEn}
              onChange={(e) => setSubgroupEn(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            color="gray"
            onClick={onClose}
            className="hover:bg-gray-200 text-gray-800"
          >
            Cancel
          </Button>

          <Button
            color="blue"
            onClick={handleCreate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <i className="fa fa-refresh fa-spin mr-2"></i> : null}
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSubgroup;
