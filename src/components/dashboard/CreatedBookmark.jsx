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
          toast.success(data.message);
          setThreads(data.data);
          // Cache threads data in localStorage
          localStorage.setItem("threads", JSON.stringify(data.data));
        } else {
          toast.error(`${res.status} ${data.message}`);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {threads.map((thread) => (
            <div key={thread.threadId} className="flex flex-col gap-0">
              <span className="-mb-5">
                <Tweet id={thread.threadId} />
              </span>
              <div>
                {threads.includes(thread.threadId) ? (
                  <span></span>
                ) : (
                  <div className="flex items-center absolute gap-1">
                    <div
                      className="hover:cursor-pointer object-left-bottom border rounded-md p-0.5 bg-gray-100 text-xs my-0 tooltip tooltip-warning tooltip-left hover:bg-gray-50"
                      data-tip="delete bookmark"
                    >
                      <BookmarkX
                        onClick={() => handleUnbookmark(thread.threadId)}
                      />
                    </div>
                    <div className=" border rounded-md p-0.5 bg-gray-100 text-xs my-0">
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
