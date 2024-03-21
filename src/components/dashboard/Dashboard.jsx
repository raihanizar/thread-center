"use client";

import React, { useState, useEffect } from "react";
import { CreatedThreads } from "@/components/dashboard/CreatedBookmark";
import { SavedBookmarks } from "@/components/dashboard/SavedBookmark";
import Link from "next/link";
import Avatar from "boring-avatars";
import { Circle, Settings2, BookmarkX, Share } from "lucide-react";

export function Dashboard({ userData }) {
  const [activeTab, setActiveTab] = useState("created");
  const [reloadThreads, setReloadThreads] = useState(false);
  const [reloadBookmarks, setReloadBookmarks] = useState(false);
  const [threadCount, setThreadCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    // Get thread count from localStorage
    const threadsData = JSON.parse(localStorage.getItem("threads"));
    const threadsCount = threadsData ? threadsData.length : 0;
    setThreadCount(threadsCount);

    // Get bookmark count from localStorage
    const bookmarksData = JSON.parse(localStorage.getItem("bookmarks"));
    const bookmarksCount = bookmarksData ? bookmarksData.length : 0;
    setBookmarkCount(bookmarksCount);
  }, []);

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
    <main>
      <section>
        <div className="flex flex-col items-center bg-white px-6 py-2 sm:py-4 lg:px-8">
          <div className="flex flex-col items-center mx-auto max-w-2xl text-center">
            <Avatar
              size={120}
              name={userData?.username}
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-4xl text-balance">
              {userData?.username}
            </h2>
            <div className="flex items-center mt-4 justify-center space-x-1">
              <span>{threadCount} Thread</span>
              <Circle className="bg-black rounded-xl" color="black" size={6} />
              <span>{bookmarkCount} Bookmark</span>
            </div>
            <div className="mt-4 flex justify-center space-x-3">
              <div className="">
                <a
                  href="#"
                  // white button, text-black, bg-balance-600 on hover
                  className="btn btn-outline btn-sm btn-info rounded-full w-32"
                >
                  Share
                  <Share size={16} />
                </a>
              </div>
              <div className="">
                <a
                  href="#"
                  // white button, text-black, bg-balance-600 on hover
                  className="btn btn-outline btn-sm btn-info rounded-full w-32"
                >
                  Edit profile
                  <Settings2 size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-50 bg-white pt-4 space-x-5 flex justify-center items-center">
        <button
          className={`font-semibold text-sm hover:bg-gray-200 px-2 p-1 hover:rounded-lg  ${
            activeTab === "created" ? "border-b border-black" : ""
          }`}
          onClick={() => handleTabChange("created")}
        >
          Created
        </button>
        <button
          className={`font-semibold text-sm hover:bg-gray-200 px-2 p-1 hover:rounded-lg ${
            activeTab === "saved" ? "border-b border-black" : ""
          }`}
          onClick={() => handleTabChange("saved")}
        >
          Saved
        </button>
      </section>
      {/* Content based on active tab */}
      <div className="mt-4">
        {activeTab === "created" && <CreatedThreads reload={reloadThreads} />}
        {activeTab === "saved" && <SavedBookmarks reload={reloadBookmarks} />}
      </div>
    </main>
  );
}
