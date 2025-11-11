"use client";
import React, { createContext, useState, useContext } from "react";

// Create Context
export const alertContext = createContext();

// Provider Component
export const AlertProvider = ({ children }) => {
  const [alert, setAlertCtx] = useState({
    title: "",
    message: "",
    type: "", // 'success' | 'error' | 'info' | ''
  });

  // Optional: auto-dismiss alert after a few seconds
  const showAlert = (data) => {
    setAlertCtx(data);
    setTimeout(() => {
      setAlertCtx({ title: "", message: "", type: "" });
    }, 4000);
  };

  return (
    <alertContext.Provider value={{ ...alert, setAlertCtx: showAlert }}>
      {children}

      {/* Floating alert UI */}
      {alert.message && (
        <div
          className={`fixed bottom-6 right-6 rounded-md shadow-lg px-5 py-3 text-white text-sm font-medium transition-all ${
            alert.type === "success"
              ? "bg-green-600"
              : alert.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          <p className="font-semibold">{alert.title}</p>
          <p>{alert.message}</p>
        </div>
      )}
    </alertContext.Provider>
  );
};

// Optional helper hook
export const useAlert = () => useContext(alertContext);
