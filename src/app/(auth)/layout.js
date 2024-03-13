import { AuthLayout } from "@/components/auth/AuthLayout";
import React from "react";

export default function Layout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
