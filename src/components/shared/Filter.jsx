"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const Filter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const filterOptions = [
    { id: 1, label: "Status" },
    { id: 2, label: "Agent" },
    { id: 3, label: "Date" },
    { id: 4, label: "Priority" },
  ];

  const handleSelect = (option) => {
    setSelectedFilter(option);
    setIsOpen(false);
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

        {selectedFilter && (
          <div className="ml-4 text-sm text-gray-600">
            Selected:{" "}
            <span className="font-medium text-gray-800">
              {selectedFilter.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
