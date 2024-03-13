"use client";

import { Toaster } from "react-hot-toast";

export const Provider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: { boxShadow: "none", border: "solid 1px #E5E7EB" },
          error: { style: { backgroundColor: "red", color: "white" } },
        }}
      />
    </>
  );
};
