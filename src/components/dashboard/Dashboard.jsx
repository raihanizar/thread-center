"use client";

import React, { useState } from "react";
import { CreatedThreads } from "@/components/dashboard/CreatedBookmark";
import { SavedBookmarks } from "@/components/dashboard/SavedBookmark";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("created");
  const [reloadThreads, setReloadThreads] = useState(false);
  const [reloadBookmarks, setReloadBookmarks] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "created") {
      setReloadThreads(true);
      setReloadBookmarks(false);
    } else if (tab === "saved") {
      setReloadThreads(false);
      setReloadBookmarks(true);
    }
  };

  return (
    <div className="mt-10">
      {/* Avatar */}
      <div className="w-40 h-40 rounded-full bg-blue-500 mx-auto"></div>

      {/* Username */}
      <h2 className="text-center">John Doe</h2>

      {/* Buttons (Share and Edit Profile) */}
      <div className="flex justify-center mt-4 items-center space-x-2">
        <button className="btn btn-primary text-white">Share</button>
        <button className="btn btn-primary text-white">Edit Profile</button>
      </div>

      {/* Tabs (Created and Saved) */}
      <div className="flex justify-center mt-4 items-center space-x-2">
        <button
          className={`btn btn-primary text-white ${
            activeTab === "created" ? "bg-blue-600" : ""
          }`}
          onClick={() => handleTabChange("created")}
        >
          Created
        </button>
        <button
          className={`btn btn-primary text-white ${
            activeTab === "saved" ? "bg-blue-600" : ""
          }`}
          onClick={() => handleTabChange("saved")}
        >
          Saved
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="mt-8">
        {activeTab === "created" && <CreatedThreads reload={reloadThreads} />}
        {activeTab === "saved" && <SavedBookmarks reload={reloadBookmarks} />}
      </div>
    </div>
  );
}
