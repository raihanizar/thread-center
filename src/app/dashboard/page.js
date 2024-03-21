"use client";

import { Dashboard } from "@/components/dashboard/Dashboard";
import { Header } from "@/components/ui/Header";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    const userDataJson = JSON.parse(userDataStr);
    setUserData(userDataJson);
  }, []);

  return (
    <main>
      <Header userData={userData} />
      <Dashboard userData={userData} />
    </main>
  );
}
