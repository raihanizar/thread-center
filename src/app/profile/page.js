"use client";

import { Profile } from "@/components/Profile";
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
    <div className="flex flex-col h-dvh">
      <Header userData={userData} />
      <Profile userData={userData} />
    </div>
  )
}

