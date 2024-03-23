"use client";

import React, { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { BookmarkX } from "lucide-react";

export const CreatedThreads = ({ updateThreadCount }) => {
  const [threads, setThreads] = useState([]);

  const categoryColors = {
    NEWS: "bg-red-200",
    POLITICS: "bg-blue-200",
    TECHNOLOGY: "bg-cyan-200",
    ENTERTAINMENT: "bg-purple-200",
    SPORTS: "bg-green-200",
    PERSONAL_DEVELOPMENT: "bg-yellow-200",
    CULTURE: "bg-orange-200",
    EDUCATION: "bg-indigo-200",
    HUMOR: "bg-pink-200",
    HEALTH_AND_WELLNESS: "bg-lime-200",
  };

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        // Fetch user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const USER_ID = user ? user.id : null; // Extract the user ID from localStorage

        // Fetch threads using the user ID
        const fetchUrl = USER_ID
          ? `/api/v1/threads?userid=${USER_ID}`
          : "/api/v1/threads";
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (res.status === 200) {
          setThreads(data.data);
          updateThreadCount(data.data.length);
          // Cache threads data in localStorage
          // localStorage.setItem("threads", JSON.stringify(data.data));
        } else {
          console.error(`${res.status} ${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreads();
  }, [updateThreadCount]);

  return (
    <main className="flex flex-col gap-8 px-4 md:px-20 justify-center items-center">
      {threads?.length > 0 ? (
        <div className="sm:columns-2 gap-5 max-w-screen-xl  lg:columns-3 mb-10">
          {threads.map((thread) => (
            <div key={thread.threadId} className="gap-0 inline-block">
              <span className="p-0">
                <Tweet id={thread.threadId} />
              </span>
              <div className="font-semibold -mt-5">
                {threads.includes(thread.threadId) ? (
                  <span></span>
                ) : (
                  <div className="flex items-center justify-end">
                    <div
                      className={`border rounded-lg p-1.5 border-gray-300 text-xs font-sans my-0 ${
                        categoryColors[thread.category]
                      }`}
                    >
                      {thread.category}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md flex justify-center items-center p-4">
          <p className="text-xl font-bold">No threads created yet.</p>
        </div>
      )}
    </main>
  );
};
