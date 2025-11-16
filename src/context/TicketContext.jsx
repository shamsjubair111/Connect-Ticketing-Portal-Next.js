"use client";
import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export function TicketProvider({ children }) {
  // ✅ existing state
  const [selectedItem, setSelectedItem] = useState("");

  // ✅ NEW state for Open / In-Progress / Solved filter
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <TicketContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
        selectedStatus,
        setSelectedStatus, // ✅ export setter
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  return useContext(TicketContext);
}
