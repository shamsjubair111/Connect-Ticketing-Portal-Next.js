"use client";

import { Button, Label, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { ImCross } from "react-icons/im";
import { IoIosCreate } from "react-icons/io";
import { createGroup } from "@/api/ticketingApis";
import { alertContext } from "@/hooks/alertContext";
import { useRouter } from "next/navigation"; // ✅ FIXED — Next.js Router

export const AddGroup = ({ onSuccess }) => {
  const [groupName, setGroupName] = useState("");
  const [subGroups, setSubGroups] = useState([]);
  const [buttonLoader, setButtonLoader] = useState(false);
  const { setAlertCtx } = useContext(alertContext);
  const router = useRouter(); // ✅ replaces useHistory

  const clearAll = () => {
    setGroupName("");
    setSubGroups([]);
  };

  const handleOnClick = async () => {
    setButtonLoader(true);

    const payload = {
      group_name: groupName,
      ...(subGroups.length > 0 && {
        sub_groups: subGroups.map(({ banglaName, englishName }) => ({
          sub_group_bn: banglaName,
          sub_group_en: englishName,
        })),
      }),
    };

    try {
      const res = await createGroup(payload);
      setAlertCtx({
        title: "Success!",
        message: "Successfully created a new group",
        type: "success",
      });

      clearAll();
      setButtonLoader(false);

      // ✅ Close modal or navigate after success
      if (onSuccess) {
        onSuccess(); // parent (page) handles modal close + refresh
      } else {
        router.push("/group-info");
      }
    } catch (err) {
      setButtonLoader(false);
      setAlertCtx({
        message:
          err.response?.data?.message ||
          "Sorry, something went wrong. Please try again or refresh.",
        type: "error",
      });
      clearAll();
    }
  };

  const handleAddSubGroup = () => {
    setSubGroups([
      ...subGroups,
      { id: subGroups.length + 1, banglaName: "", englishName: "" },
    ]);
  };

  const handleSubGroupChange = (id, field, value) => {
    const updatedSubGroups = subGroups.map((subGroup) =>
      subGroup.id === id ? { ...subGroup, [field]: value } : subGroup
    );
    setSubGroups(updatedSubGroups);
  };

  const handleDeleteSubGroup = (id) => {
    setSubGroups(subGroups.filter((subGroup) => subGroup.id !== id));
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center">
      <div className="w-full sm:w-[600px] rounded-lg p-5">
        <div className="w-full px-2 sm:px-6">
          <h1 className="flex flex-col justify-center items-center text-2xl text-blue-700 font-bold mb-2">
            <IoIosCreate className="text-3xl mb-1" />
            Create a New Group
          </h1>

          <Label htmlFor="groupName" className="py-3 text-gray-800">
            Group Name
          </Label>
          <TextInput
            type="text"
            id="groupName"
            placeholder="Name"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          />

          {/* Add subgroup button */}
          <div className="w-full flex justify-center">
            <Button
              type="button"
              onClick={handleAddSubGroup}
              className="text-right mx-auto my-5 bg-blue-600 hover:bg-blue-700"
            >
              {buttonLoader && (
                <i
                  className="fa fa-refresh fa-spin"
                  style={{
                    marginLeft: "-10px",
                    marginRight: "8px",
                    fontSize: "20px",
                  }}
                />
              )}
              {subGroups.length === 0 ? "Add Subgroup" : "Add More"}
            </Button>
          </div>

          {/* Subgroup inputs */}
          {subGroups.map((subGroup) => (
            <div key={subGroup.id} className="py-2 flex items-center">
              <div className="flex-1 mr-4">
                <Label
                  htmlFor={`banglaName${subGroup.id}`}
                  className="py-1 text-gray-800"
                >
                  Bangla Name
                </Label>
                <TextInput
                  type="text"
                  id={`banglaName${subGroup.id}`}
                  placeholder="Bangla Name"
                  value={subGroup.banglaName}
                  onChange={(e) =>
                    handleSubGroupChange(
                      subGroup.id,
                      "banglaName",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="flex-1 mr-4">
                <Label
                  htmlFor={`englishName${subGroup.id}`}
                  className="py-1 text-gray-800"
                >
                  English Name
                </Label>
                <TextInput
                  type="text"
                  id={`englishName${subGroup.id}`}
                  placeholder="English Name"
                  value={subGroup.englishName}
                  onChange={(e) =>
                    handleSubGroupChange(
                      subGroup.id,
                      "englishName",
                      e.target.value
                    )
                  }
                />
              </div>

              <ImCross
                className="mt-6 text-red-600 cursor-pointer"
                onClick={() => handleDeleteSubGroup(subGroup.id)}
              />
            </div>
          ))}

          {/* Submit button */}
          <div className="py-5 flex flex-col justify-center items-center">
            <Button
              type="submit"
              onClick={handleOnClick}
              disabled={
                !groupName ||
                subGroups.length === 0 ||
                subGroups.some(
                  (s) => !s.banglaName.trim() || !s.englishName.trim()
                )
              }
              className="bg-green-600 hover:bg-green-700 rounded-md w-[330px]"
            >
              {buttonLoader && (
                <i
                  className="fa fa-refresh fa-spin"
                  style={{
                    marginLeft: "-10px",
                    marginRight: "8px",
                    fontSize: "20px",
                  }}
                />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
