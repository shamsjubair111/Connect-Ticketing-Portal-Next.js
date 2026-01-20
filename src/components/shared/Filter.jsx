"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { getAllGroups, getSubGroups } from "@/api/ticketingApis";
import { jwtDecode } from "jwt-decode";

const Filter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [userType, setUserType] = useState("");

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedFilters = useDebounce(selectedFilters, 500);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUserType(decoded.user_type);
    } catch (err) {
      console.log(Error);
    }
  }, []);

  // ✅ Load saved filters when Filter component mounts
  useEffect(() => {
    const saved = localStorage.getItem("ticket_filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // restore only if parsed is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedFilters(parsed);

          // If a saved filter includes a group, restore its ID too (so subgroups load correctly)
          const savedGroup = parsed.find((f) => f.label === "Group" && f.value);
          if (savedGroup) {
            setSelectedGroupId(savedGroup.value);
          }
        }
      } catch (err) {
        console.error("Failed to parse saved filters", err);
        localStorage.removeItem("ticket_filters");
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("ticket_filters");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedFilters(parsed);
      } else {
        setSelectedFilters([]);
      }
    };

    // ✅ React to manual "storage" updates from sidebar
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const allFilterOptions = [
    { id: 1, label: "Ticket Id", type: "text" },
    { id: 2, label: "Problematic Number", type: "text" },
    {
      id: 3,
      label: "Status",
      type: "select",
      options: ["open", "in_progress", "closed"],
    },
    {
      id: 4,
      label: "Issued To",
      type: "select",
      options: ["cc", "rs", "oss-bss", "iptsp"],
    },
    {
      id: 5,
      label: "Ticket Type",
      type: "select",
      options: ["agent", "customer", "pbx_user"],
    },
    { id: 6, label: "Group", type: "select", options: [] },
    { id: 7, label: "Subgroup", type: "select", options: [] },
    { id: 8, label: "Start Date", type: "date" },
    { id: 9, label: "End Date", type: "date" },
  ];

  const filterOptions =
    userType === "customer" || userType === "pbx_user"
      ? allFilterOptions.filter((opt) =>
          ["Ticket Id", "Problematic Number", "Status"].includes(opt.label),
        )
      : allFilterOptions;

  // ✅ Fetch groups on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllGroups();
        const list = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setGroups(list);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    })();
  }, []);

  // ✅ Fetch subgroups when selectedGroupId changes
  useEffect(() => {
    if (!selectedGroupId) return;

    let isMounted = true;

    const fetchSubgroups = async () => {
      try {
        const res = await getSubGroups(selectedGroupId);
        const list = Array.isArray(res?.data?.sub_groups)
          ? res.data.sub_groups
          : Array.isArray(res?.data?.data)
            ? res.data.data
            : Array.isArray(res?.data)
              ? res.data
              : [];

        if (isMounted) setSubgroups(list);
      } catch (err) {
        console.error("Error fetching subgroups:", err);
      }
    };

    fetchSubgroups();

    return () => {
      isMounted = false;
    };
  }, [selectedGroupId]);

  // ✅ Notify parent + persist filters
  useEffect(() => {
    if (onFilterChange) onFilterChange(debouncedFilters);
    if (debouncedFilters.length > 0) {
      localStorage.setItem("ticket_filters", JSON.stringify(debouncedFilters));
    }
  }, [debouncedFilters, onFilterChange]);

  // 🧩 Add filter
  const handleSelect = (option) => {
    if (option.label === "Subgroup" && !selectedGroupId) {
      console.warn("Select a group before adding a subgroup filter!");
      setIsOpen(false);
      return;
    }

    if (selectedFilters.some((f) => f.id === option.id)) return;

    const newOption = { ...option, value: "" };

    if (option.label === "Group") {
      newOption.options = (groups || []).map((g) => ({
        label: g.group_name,
        value: g._id,
      }));
    }

    if (option.label === "Subgroup") {
      newOption.options = (subgroups || []).map((sg) => ({
        label:
          sg.sub_group_en || sg.sub_group_bn || sg.name || "Unnamed Subgroup",
        value: sg._id,
      }));
    }

    setSelectedFilters((prev) => [...prev, newOption]);
    setIsOpen(false);
  };

  // 🧩 Handle value changes
  const handleChange = (id, value) => {
    setSelectedFilters((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, value } : f));
      const changed = updated.find((f) => f.id === id);

      if (changed?.label === "Group") {
        setSelectedGroupId(value); // 👈 triggers useEffect for subgroup API
      }

      if (changed?.label === "Subgroup") {
        console.log("Selected Subgroup ID:", value);
      }

      return updated;
    });
  };

  // 🧩 Remove filter + update localStorage
  const handleRemove = (id) => {
    setSelectedFilters((prev) => {
      const removed = prev.find((f) => f.id === id);
      const updated = prev.filter((f) => f.id !== id);

      // If group was removed → reset all subgroup dependencies
      if (removed?.label === "Group") {
        setSelectedGroupId(null);
        setSubgroups([]);
      }

      // If subgroup was removed → just clear subgroup value
      if (removed?.label === "Subgroup") {
        // optional: no need to reset selectedGroupId
      }

      // Update localStorage
      localStorage.setItem("ticket_filters", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200">
      <div className="flex items-center py-3 pl-4 pr-4">
        {/* Add Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Add filter
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  disabled={option.label === "Subgroup" && !selectedGroupId}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    option.label === "Subgroup" && !selectedGroupId
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="ml-4 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-1 max-w-full">
            {selectedFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs"
              >
                <span className="text-sm text-gray-700 font-medium">
                  {filter.label}:
                </span>

                {/* Text Field */}
                {filter.type === "text" && (
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => handleChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded px-1.5 py-1 text-xs"
                    placeholder={`Enter ${filter.label.toLowerCase()}`}
                  />
                )}

                {/* Select Field */}
                {filter.type === "select" && (
                  <select
                    value={filter.value}
                    onChange={(e) => handleChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    disabled={filter.label === "Subgroup" && !selectedGroupId}
                  >
                    <option value="">Select</option>
                    {(filter.options || []).map((opt, i) => (
                      <option key={i} value={opt.value || opt}>
                        {opt.label || opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Date Field */}
                {filter.type === "date" && (
                  <input
                    type="date"
                    value={filter.value}
                    onChange={(e) => handleChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                )}

                {/* Remove Filter */}
                <button
                  onClick={() => handleRemove(filter.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
