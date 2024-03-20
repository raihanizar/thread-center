"use client";

import { ExploreThreads } from "@/components/ExploreThreads";
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
    <>
      <Header userData={userData} />
      <ExploreThreads userData={userData} />
    </>
  )
}

