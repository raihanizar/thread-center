"use client";

import React, { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { BookmarkX } from "lucide-react";

export const CreatedThreads = () => {
  const [threads, setThreads] = useState([]);

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
          console.log(data.message);
          setThreads(data.data);
          // Cache threads data in localStorage
          localStorage.setItem("threads", JSON.stringify(data.data));
        } else {
          console.error(`${res.status} ${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <main className="flex flex-col gap-8 px-4 md:px-20 justify-center items-center min-h-dvh">
      {threads?.length > 0 ? (
        <div className="sm:columns-3 gap-5 w-[1200px] mx-auto columns-2 mb-10">
          {threads.map((thread) => (
            <div key={thread.threadId} className="gap-0 inline-block">
              <span className="p-0">
                <Tweet id={thread.threadId} />
              </span>
              <div className="font-semibold -mt-5">
                {threads.includes(thread.threadId) ? (
                  <span></span>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="badge badge-outline text-xs my-0">
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
