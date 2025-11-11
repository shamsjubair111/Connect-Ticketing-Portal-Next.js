"use client";
import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export function TicketProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState("");
  return (
    <TicketContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  return useContext(TicketContext);
}
