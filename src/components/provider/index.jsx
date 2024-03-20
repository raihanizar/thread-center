"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

export const Provider = ({ children }) => {
  const [toastShown, setToastShown] = useState(false);
  return (
    <>
      {children}
      <Toaster
        // duration="4000"
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: { boxShadow: "none", border: "solid 1px #E5E7EB" },
          error: { style: { backgroundColor: "red", color: "white" } },
        }}
        toastFn={({ message }) => {
          // Show the toast only if it hasn't been shown before
          if (!toastShown) {
            setToastShown(true);
            return message;
          }
        }}
      />
    </>
  );
};
