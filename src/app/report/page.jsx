"use client";

import React, { useState, useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Button, Select } from "flowbite-react";
import { DocumentViewer } from "react-documents";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { alertContext } from "@/hooks/alertContext";
import {
  getAllGroups,
  getSubGroups,
  getUser,
  report,
} from "@/api/ticketingApis";

export default function ReportPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [buttonLoader, setLoader] = useState(false);
  const [previewUrl, setPrevUrl] = useState(null);
  const { setAlertPopupContext } = useContext(alertContext);
  const uniqueQuery = `?timestamp=${Date.now()}`;

  const [groupData, setGroupData] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [subGroupData, setSubGroupData] = useState([]);
  const [selectedSubGroupId, setSelectedSubGroupId] = useState("");
  const [userData, setUserData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserPhone, setSelectedUserPhone] = useState("");

  const handleOnClick = () => {
    const strDate = moment(startDate).format("yyyy-MM-DD");
    const enDate = moment(endDate).format("yyyy-MM-DD");
    const data = {
      start_date: `${strDate}T00:00:00+00:00`,
      end_date: `${enDate}T23:59:59+00:00`,
    };

    if (selectedGroupId) data.group_id = selectedGroupId;
    if (selectedSubGroupId) data.sub_group_id = selectedSubGroupId;
    if (selectedUserPhone) data.user_phone_number = selectedUserPhone;

    setLoader(true);
    report(data)
      .then((res) => {
        setLoader(false);
        setPrevUrl(res.data.public_url);
        window.open(res.data.public_url, "_blank");
      })
      .catch((err) => {
        console.error(err);
        setLoader(false);
        setAlertPopupContext({
          message: err.response?.data?.message || "An error occurred",
          type: "error",
        });
      });
  };

  const handleGroupSelect = (e) => {
    const id = e.target.value;
    setSelectedGroupId(id);
    setSelectedSubGroupId("");
    setSubGroupData([]);

    if (!id) return;

    getSubGroups(id)
      .then((res) => {
        const subgroups = res?.data?.sub_groups || [];
        setSubGroupData(subgroups);
      })
      .catch((err) => {
        console.error("Error fetching subgroups:", err);
        setAlertPopupContext({
          message: err.response?.data?.message || "Failed to fetch subgroups",
          type: "error",
        });
      });
  };

  const handleSubGroupSelect = (e) => {
    const id = e.target.value;
    setSelectedSubGroupId(id);
  };

  const handleUserSelect = (e) => {
    const id = e.target.value;
    setSelectedUserId(id);

    if (!id) {
      setSelectedUserPhone("");
      return;
    }

    const row = userData.find((u) => u._id === id);
    if (row?.phone_number) {
      setSelectedUserPhone(row.phone_number);
    }
  };

  // ✅ Fetch all groups
  useEffect(() => {
    getAllGroups()
      .then((res) => setGroupData(res?.data?.data || []))
      .catch((err) => {
        console.error(err);
        setAlertPopupContext({
          message: err.response?.data?.message || "Failed to fetch groups",
          type: "error",
        });
      });
  }, []);

  // ✅ Fetch all users
  useEffect(() => {
    getUser()
      .then((res) => setUserData(res?.data || []))
      .catch((err) => {
        console.error(err);
        setAlertPopupContext({
          message: err.response?.data?.message || "Failed to fetch users",
          type: "error",
        });
      });
  }, []);

  return (
    <div className="w-full p-6">
      <div className="w-full">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4">
          {/* User Select */}
          <Select
            id="navUserSelect"
            className="w-56 text-black"
            value={selectedUserId}
            onChange={handleUserSelect}
          >
            <option value="">All Users</option>
            {userData.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </Select>

          {/* Group Select */}
          <Select
            id="navGroupSelect"
            className="w-56 text-black"
            value={selectedGroupId}
            onChange={handleGroupSelect}
          >
            <option value="">All Groups</option>
            {groupData.map((g) => (
              <option key={g._id} value={g._id}>
                {g.group_name}
              </option>
            ))}
          </Select>

          {/* Subgroup Select */}
          <Select
            id="navSubGroupSelect"
            className="w-56 text-black"
            value={selectedSubGroupId}
            onChange={handleSubGroupSelect}
            disabled={!selectedGroupId}
          >
            <option value="">All Subgroups</option>
            {subGroupData.map((sg) => (
              <option key={sg._id} value={sg._id}>
                {sg.sub_group_en || "Unnamed Subgroup"}
              </option>
            ))}
          </Select>

          {/* Start Date */}
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setEndDate(null);
              setPrevUrl("");
            }}
            className="w-56 text-black bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholderText="Select start date"
          />

          <span className="mx-2 text-gray-500">to</span>

          {/* End Date */}
          <DatePicker
            selected={endDate}
            minDate={startDate}
            maxDate={moment()._d}
            onChange={(date) => setEndDate(date)}
            className="w-56 text-black bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholderText="Select end date"
          />
        </div>

        {/* Submit Button */}
        <div className="py-5 flex flex-col justify-center items-center">
          <Button
            type="submit"
            onClick={handleOnClick}
            disabled={!startDate || !endDate}
            className="bg-blue-600 rounded-3xl w-[330px] hover:bg-blue-700 text-white"
          >
            {buttonLoader ? (
              <i className="fa fa-refresh fa-spin mr-2" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {/* Document Preview */}
        {previewUrl && previewUrl.trim() !== "" && (
          <DocumentViewer
            queryParams="hl=EN"
            url={`${previewUrl}${uniqueQuery}`}
            viewer="office"
            style={{ width: "100%", height: "40vh" }}
          />
        )}
      </div>
    </div>
  );
}
