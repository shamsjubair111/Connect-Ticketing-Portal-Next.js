"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const Filter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filterOptions = [
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
      options: ["cc", "customer", "iptsp"],
    },
    {
      id: 5,
      label: "Ticket Type",
      type: "select",
      options: ["agent", "customer"],
    },
  ];

  const handleSelect = (option) => {
    // prevent duplicate selection
    if (!selectedFilters.some((f) => f.id === option.id)) {
      setSelectedFilters([...selectedFilters, { ...option, value: "" }]);
    }
    setIsOpen(false);
  };

  const handleChange = (id, value) => {
    setSelectedFilters((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, value } : f));
      onFilterChange && onFilterChange(updated);
      return updated;
    });
  };

  const handleRemove = (id) => {
    setSelectedFilters((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilterChange && onFilterChange(updated);
      return updated;
    });
  };

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200">
      {/* Match table's checkbox column offset */}
      <div className="flex items-center py-3 pl-[1rem] pr-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
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
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedFilters.length > 0 && (
          <div className="ml-4 flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 py-1 rounded-md max-w-full">
            {selectedFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs"
              >
                <span className="text-sm text-gray-700 font-medium">
                  {filter.label}:
                </span>

                {filter.type === "text" && (
                  <input
                    type="text"
                    value={filter.value}
                    onChange={(e) => handleChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded px-1.5 py-1 text-xs"
                    placeholder={`Enter ${filter.label.toLowerCase()}`}
                  />
                )}

                {filter.type === "select" && (
                  <select
                    value={filter.value}
                    onChange={(e) => handleChange(filter.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    <option value="">Select</option>
                    {filter.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

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
