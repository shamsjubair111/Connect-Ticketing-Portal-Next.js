"use client";

import React, { useContext, useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { IoIosCreate } from "react-icons/io";
import { createUser } from "@/api/ticketingApis";
import { alertContext } from "@/hooks/alertContext";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState("");
  const [role, setRole] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const { setAlertCtx } = useContext(alertContext);

  const userTypes = ["cc", "agent", "customer", "iptsp", "rs", "oss_bss"];
  const roles = ["user", "moderator", "support"];

  const clearAll = () => {
    setName("");
    setPNumber("");
    setPhoneNumber("");
    setUserType("");
    setRole("");
  };

  const handleSubmit = async () => {
    const data = {
      name,
      brilliant_number: "88" + pNumber,
      phone_number: "88" + phoneNumber,
      user_type: userType,
      role,
    };

    try {
      setButtonLoader(true);
      const res = await createUser(data);
      setButtonLoader(false);
      setAlertCtx({
        title: "Success!",
        message: "Successfully created a new user!",
        type: "success",
      });
      clearAll();
      onSuccess();
      onClose();
    } catch (err) {
      setButtonLoader(false);
      console.error(err);
      setAlertCtx({
        message:
          err?.response?.data ||
          "Sorry, something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-md p-6 relative">
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h1 className="flex items-center text-lg font-semibold text-primary">
            <IoIosCreate className="text-2xl mr-2" />
            Create A New User
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* ---------- Form Fields ---------- */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              Name
            </Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="brilliantNumber" className="text-gray-700">
              Brilliant Number
            </Label>
            <TextInput
              id="brilliantNumber"
              type="text"
              addon="+88"
              placeholder="e.g: 0XXXXXXXXXX"
              value={pNumber}
              onChange={(e) => setPNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="text-gray-700">
              Phone Number
            </Label>
            <TextInput
              id="phoneNumber"
              type="tel"
              addon="+88"
              placeholder="e.g: 01XXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="userType" className="text-gray-700">
              User Type
            </Label>
            <Select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="" disabled>
                Select User Type
              </option>
              {userTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="role" className="text-gray-700">
              Role
            </Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* ---------- Buttons ---------- */}
        <div className="mt-6 flex justify-end gap-2">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="blue"
            disabled={!name || !pNumber || !phoneNumber || !userType || !role}
            onClick={handleSubmit}
          >
            {buttonLoader && <i className="fa fa-refresh fa-spin mr-2" />}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
