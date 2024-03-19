"use client";

import React, { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";

export const CreatedThreads = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const USER_ID = user ? user.id : null; // Extract the user ID from localStorage

    // Function to fetch threads
    const getThreads = async () => {
      try {
        // Fetch threads using the user ID
        const fetchUrl = USER_ID
          ? `/api/v1/threads?userid=${USER_ID}`
          : "/api/v1/threads";
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (res.status === 200) {
          toast.success(data.message);
          setThreads(data.data);
        } else {
          toast.error(`${res.status} ${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch threads when component mounts
    getThreads();
  }, []);

  return (
    <main className="flex flex-col gap-8 p-8 md:p-20 justify-center items-center min-h-dvh">
      <h1 className="text-3xl font-bold">Created Threads</h1>
      {threads?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {threads.map((thread) => (
            <div key={thread.threadId} className="flex flex-col gap-0">
              <Tweet id={thread.threadId} />
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md flex justify-center items-center p-4">
          <p className="text-xl font-bold">No threads found.</p>
        </div>
      )}
    </main>
  );
};
