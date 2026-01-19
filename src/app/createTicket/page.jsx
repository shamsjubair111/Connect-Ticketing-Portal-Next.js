"use client";

import React, { useEffect, useState, useContext } from "react";
import { FileInput, Label, TextInput, Textarea, Button } from "flowbite-react";
import { IoArrowBack } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { getAllGroups, getSubGroups, issueTicket } from "@/api/ticketingApis";
import { checkPhoneFormatEleven, handleFileUpload } from "@/common/functions";
import { alertContext } from "@/hooks/alertContext";

export default function CreateTicketPage() {
  const [title, setTitle] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [desc, setDesc] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const { setAlertCtx } = useContext(alertContext);
  const router = useRouter();
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");

  const [userType, setUserType] = useState("agent");
  const [userTypeValidation, setUserTypeValidation] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserTypeValidation(decoded?.user_type || "agent");
        } catch (err) {
          console.error("Invalid JWT token:", err);
          setUserTypeValidation("agent");
        }
      }
    }
  }, []);

  // Fetch groups
  useEffect(() => {
    getAllGroups()
      .then((res) => setGroups(res?.data?.data))
      .catch((err) => {
        console.error(err);
        setAlertCtx({
          title: "Error",
          message:
            err.response?.data?.message ||
            "Failed to load groups. Please refresh and try again.",
          type: "error",
        });
      });
  }, []);

  const fetchSubgroups = (id) => {
    getSubGroups(id)
      .then((res) => setSubgroups(res?.data?.sub_groups || []))
      .catch((err) => {
        console.error(err);
        setAlertCtx({
          title: "Error",
          message:
            err.response?.data?.message ||
            "Failed to load subgroups. Please refresh and try again.",
          type: "error",
        });
      });
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    const group = groups.find((g) => g._id === groupId);
    setSelectedGroup(group);
    setSubgroups([]);
    fetchSubgroups(groupId);
  };

  const handleSubgroupChange = (e) => {
    const subId = e.target.value;
    const subgroup = subgroups.find((s) => s._id === subId);
    setSelectedSubgroup(subgroup);
  };

  const onFileInputChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const clearAll = () => {
    setTitle("");
    setPNumber("");
    setDesc("");
    setRequesterName("");
    setRequesterEmail("");
    setSelectedGroup("");
    setSelectedSubgroup("");
    setSelectedFiles([]);
  };

  const submitTicket = async (_attachments) => {
    const data = {
      title,
      problematic_number: "88" + pNumber,
      description: desc,
      group_id: selectedGroup?._id,
      group_name: selectedGroup?.group_name,
      sub_group_id: selectedSubgroup?._id,
      sub_group_name: selectedSubgroup?.sub_group_bn,
      issuer_user_type: userType,
      ...(requesterName && { requester_name: requesterName }),
      ...(requesterEmail && { requester_email: requesterEmail }),
      ...(!!_attachments && { attachments: _attachments }),
    };

    setButtonLoader(true);

    try {
      await issueTicket(data);
      setAlertCtx({
        title: "Success",
        message: "Ticket created successfully!",
        type: "success",
      });
      clearAll();
      router.push("/tickets");
    } catch (err) {
      console.error(err);
      setAlertCtx({
        title: "Error",
        message:
          err.response?.data?.message ||
          "Something went wrong while submitting the ticket.",
        type: "error",
      });
    } finally {
      setButtonLoader(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length > 0) {
      const attachments = await handleFileUpload(selectedFiles);
      submitTicket(attachments);
    } else {
      submitTicket();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <IoArrowBack
            className="text-3xl text-blue-600 cursor-pointer"
            onClick={() => router.push("/tickets")}
          />
          <h1 className="font-bold text-xl text-gray-800">Create New Ticket</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Ticket Details
          </h2>

          {/* Group */}
          <div className="mb-6">
            <Label htmlFor="group" value="Select Group" />
            <select
              id="group"
              value={selectedGroup?._id || ""}
              onChange={handleGroupChange}
              className="mt-2 w-full border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-white"
            >
              <option value="">Select a group</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.group_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subgroup */}
          {subgroups.length > 0 && (
            <div className="mb-6">
              <Label htmlFor="subgroup" value="Select Subgroup" />
              <select
                id="subgroup"
                value={selectedSubgroup?._id || ""}
                onChange={handleSubgroupChange}
                className="mt-2 w-full border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-white"
              >
                <option value="">Select a subgroup</option>
                {subgroups.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sub_group_bn}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div className="mb-6">
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              type="text"
              placeholder="Enter ticket title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Problematic number */}
          <div className="mb-6">
            <Label htmlFor="pNumber" value="Problematic Number" />
            <TextInput
              id="pNumber"
              type="text"
              value={pNumber}
              addon="+88"
              placeholder="01XXXXXXXXX"
              onChange={(e) => setPNumber(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Requester Name */}
          <div className="mb-6">
            <Label htmlFor="requesterName" value="Name" />
            <TextInput
              id="requesterName"
              type="text"
              placeholder="Enter name"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Requester Email */}
          <div className="mb-6">
            <Label htmlFor="requesterEmail" value="Email" />
            <TextInput
              id="requesterEmail"
              type="email"
              placeholder="Enter email"
              value={requesterEmail}
              onChange={(e) => setRequesterEmail(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* User Type */}
          {userTypeValidation !== "customer" && (
            <div className="mb-6">
              <Label htmlFor="userType" value="Select User Type" />
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-2 w-full border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-white"
              >
                <option value="agent">Agent</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <Label htmlFor="desc" value="Description" />
            <Textarea
              id="desc"
              rows={5}
              placeholder="Describe your issue..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* File upload */}
          <div className="mb-8 border-t border-gray-200 pt-6">
            <Label htmlFor="file" value="Attach File(s)" className="mb-2" />
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
              <FileInput
                id="file"
                multiple
                accept="image/*"
                onChange={onFileInputChange}
                className="cursor-pointer w-full max-w-sm"
              />
              <p className="text-sm text-gray-500 mt-3">
                Drag & drop or click to upload images (Max 5MB each)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2 text-sm text-gray-700">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                  >
                    <span className="truncate w-4/5">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={
                !title ||
                !pNumber ||
                !desc ||
                !checkPhoneFormatEleven("88" + pNumber) ||
                !selectedGroup
              }
              className={`w-full py-2.5 text-base font-medium rounded-lg transition-all
  ${buttonLoader ? "cursor-wait bg-blue-500" : "cursor-pointer"}
  ${
    !title ||
    !pNumber ||
    !desc ||
    !checkPhoneFormatEleven("88" + pNumber) ||
    !selectedGroup
      ? "bg-blue-300 text-white cursor-not-allowed opacity-70"
      : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-400"
  }`}
            >
              {buttonLoader && (
                <span className="mr-2 animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              )}
              Submit Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
