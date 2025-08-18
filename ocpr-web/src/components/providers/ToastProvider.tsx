"use client";
import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "",
        style: { borderRadius: 8 },
        success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
      }}
    />
  );
}
