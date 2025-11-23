"use client";

import React, { useEffect, useState, useRef } from "react";
import { Label, TextInput, Textarea, FileInput, Button } from "flowbite-react";
import ReCAPTCHA from "react-google-recaptcha";
import { IoIosCreate } from "react-icons/io";
import { useRouter } from "next/navigation";

import {
  getAllGroups,
  getSubGroups,
  createCustomerTicket,
} from "@/api/ticketingApis";

import { checkPhoneFormatEleven, handleFileUpload } from "@/common/functions";
import { isValidEmail } from "@/utils";

export default function CreateCustomerTicketPage() {
  const [title, setTitle] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [subgroups, setSubgroups] = useState([]);
  const [selectedSubgroup, setSelectedSubgroup] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [emailError, setEmailError] = useState("");

  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");

  const router = useRouter();
  const userType = "customer";

  // FETCH GROUPS
  useEffect(() => {
    getAllGroups()
      .then((res) => setGroups(res?.data?.data || []))
      .catch((err) =>
        setErrorText(
          err?.response?.data?.message ||
            "Sorry, something went wrong. Please refresh."
        )
      );
  }, []);

  // FETCH SUBGROUPS
  const fetchSubgroups = (groupId) => {
    if (!groupId) return setSubgroups([]);

    getSubGroups(groupId)
      .then((res) => setSubgroups(res?.data?.sub_groups || []))
      .catch((err) =>
        setErrorText(
          err?.response?.data?.message ||
            "Failed to load subgroups. Please try again."
        )
      );
  };

  // HANDLERS
  const onFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleGroupChange = (e) => {
    const groupId = e.target.value;
    const selected = groups.find((g) => g._id === groupId);
    setSelectedGroup(selected || "");
    setSelectedSubgroup("");
    fetchSubgroups(groupId);
  };

  const handleSubgroupChange = (e) => {
    const subId = e.target.value;
    const selected = subgroups.find((s) => s._id === subId);
    setSelectedSubgroup(selected || "");
  };

  const handleEmailBlur = () => {
    if (clientEmail && !isValidEmail(clientEmail)) {
      setEmailError("Please enter a valid email address");
    } else setEmailError("");
  };

  const clearAll = () => {
    setTitle("");
    setPNumber("");
    setDesc("");
    setClientEmail("");
    setSelectedGroup("");
    setSelectedSubgroup("");
    setSelectedFiles([]);
    const fileInput = document.getElementById("file");
    if (fileInput) fileInput.value = null;
  };

  // SUBMIT TICKET
  const submitTicket = async (_attachments, token) => {
    const data = {
      title,
      problematic_number: "88" + pNumber,
      description: desc,
      client_email: clientEmail,
      group_id: selectedGroup?._id,
      group_name: selectedGroup?.group_name,
      sub_group_id: selectedSubgroup?._id,
      sub_group_name: selectedSubgroup?.sub_group_bn,
      issuer_user_type: userType,
      token: token || captchaToken,
      ...(Array.isArray(_attachments) && _attachments.length
        ? { attachments: _attachments }
        : {}),
    };

    setButtonLoader(true);
    setErrorText("");

    createCustomerTicket(data)
      .then(() => {
        setButtonLoader(false);
        clearAll();
        setIsSuccess(true);
      })
      .catch((err) => {
        setButtonLoader(false);
        setErrorText(
          err?.response?.data?.message ||
            "Sorry, something went wrong. Please try again."
        );
      });
  };

  const handleSubmit = async () => {
    try {
      setButtonLoader(true);

      const token = await recaptchaRef.current.executeAsync();
      setCaptchaToken(token);
      recaptchaRef.current.reset();

      const attachments = selectedFiles.length
        ? await handleFileUpload(selectedFiles)
        : [];

      await submitTicket(attachments, token);
    } finally {
      setButtonLoader(false);
    }
  };

  // VALIDATION
  const isDisabled =
    !title ||
    !pNumber ||
    !desc ||
    !isValidEmail(clientEmail) ||
    !checkPhoneFormatEleven("88" + pNumber) ||
    !selectedGroup ||
    (subgroups.length > 0 && !selectedSubgroup);

  // UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* MAIN WRAPPER */}
      <div className="flex-1 flex justify-center items-start py-12 px-4">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
          {/* SHOW ONLY WHEN NOT SUCCESS */}
          {!isSuccess ? (
            <>
              {/* TITLE SECTION */}
              <div className="flex flex-col items-center mb-8">
                <IoIosCreate className="text-4xl text-blue-600 mb-2" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Create a New Ticket
                </h2>
                <p className="text-gray-500 text-sm mt-1 text-center">
                  Fill the form below to submit your issue
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {errorText && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {errorText}
                </div>
              )}

              {/* GROUP */}
              <div className="mb-6">
                <Label value="Group Name" className="text-gray-700" />
                <select
                  value={selectedGroup?._id || ""}
                  onChange={handleGroupChange}
                  className="mt-2 w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a group</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.group_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBGROUP */}
              {subgroups.length > 0 && (
                <div className="mb-6">
                  <Label value="Subgroup" className="text-gray-700" />
                  <select
                    value={selectedSubgroup?._id || ""}
                    onChange={handleSubgroupChange}
                    className="mt-2 w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-blue-500 focus:border-blue-500"
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

              {/* TITLE */}
              <div className="mb-6">
                <Label value="Title" className="text-gray-700" />
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2"
                  placeholder="Short summary of the issue"
                />
              </div>

              {/* PHONE */}
              <div className="mb-6">
                <Label value="Problematic Number" className="text-gray-700" />
                <TextInput
                  type="text"
                  addon="+88"
                  value={pNumber}
                  onChange={(e) => setPNumber(e.target.value)}
                  className="mt-2"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              {/* EMAIL */}
              <div className="mb-6">
                <Label value="Email" className="text-gray-700" />
                <TextInput
                  type="email"
                  value={clientEmail}
                  onChange={(e) => {
                    setClientEmail(e.target.value);
                    setEmailError("");
                  }}
                  onBlur={handleEmailBlur}
                  color={emailError ? "failure" : undefined}
                  className="mt-2"
                  placeholder="example@domain.com"
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="mb-6">
                <Label value="Description" className="text-gray-700" />
                <Textarea
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="mt-2"
                  placeholder="Explain your issue in detail..."
                />
              </div>

              {/* FILE UPLOAD */}
              <div className="mb-8">
                <Label value="Upload Attachment(s)" className="text-gray-700" />
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
                  <FileInput
                    id="file"
                    multiple
                    accept="image/*"
                    onChange={onFileInputChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload screenshots or related images (optional)
                  </p>
                </div>
              </div>

              {/* SUBMIT */}
              <Button
                onClick={handleSubmit}
                disabled={isDisabled || buttonLoader}
                className={`w-full py-3 text-base font-semibold rounded-lg transition ${
                  isDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {buttonLoader ? "Processing..." : "Submit Ticket"}
              </Button>
            </>
          ) : (
            // SUCCESS SCREEN ONLY
            <div className="text-center py-16">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Ticket Submitted!
              </h2>
              <p className="text-gray-500 mt-2">
                Our support team will contact you soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RECAPTCHA */}
      <div className="absolute bottom-4 right-4">
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          badge="inline"
          sitekey="6LezOigmAAAAAMsKcNE0mcdAlgBxEZDA3n_s1BkZ"
        />
      </div>
    </div>
  );
}
