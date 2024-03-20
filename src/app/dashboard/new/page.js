"use client"

import { CreateThreads } from "@/components/CreateThreads";
import { Header } from "@/components/ui/Header";
import React, { useEffect, useState } from "react";

export default function page() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    const userDataJson = JSON.parse(userDataStr);
    setUserData(userDataJson);
  }, []);

  return (
    <>
      <Header userData={userData} />
      <CreateThreads userData={userData} />
    </>
  )
}
