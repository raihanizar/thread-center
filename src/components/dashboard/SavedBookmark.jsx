"use client";

import React, { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { BookmarkX } from "lucide-react";

export const SavedBookmarks = () => {
  const [bookmarksByCurrentUser, setBookmarksByCurrentUser] = useState([]);

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userid = user ? user.id : null; // Extract the user ID from localStorage

    // Function to fetch threads
    const getBookmarks = async () => {
      try {
        // Fetch threads using the user ID
        const fetchUrl = userid
          ? `/api/v1/bookmarks?userid=${userid}`
          : "/api/v1/bookmarks";
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (res.status === 200) {
          toast.success(data.message);
          setBookmarksByCurrentUser(data.data);

          // Cache threads data in localStorage
          localStorage.setItem("bookmarks", JSON.stringify(data.data));
        } else {
          toast.error(`${res.status} ${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch threads when component mounts
    getBookmarks();
  }, []);

  // Function to handle unbookmarking of a thread
  const handleUnbookmark = async (threadId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user.id : null;
      if (!userId) {
        // Handle case when user ID is not available
        return;
      }

      // Fetch the bookmark ID based on the user ID and thread ID
      const res = await fetch(
        `/api/v1/bookmarks?userid=${userId}&threadid=${threadId}`
      );
      const data = await res.json();
      if (res.status === 200) {
        // Extract the bookmark ID
        const bookmarkId = data.data[0]?.id;

        if (!bookmarkId) {
          // Handle case when bookmark ID is not available
          return;
        }

        // Send DELETE request to delete the bookmark
        const deleteRes = await fetch(`/api/v1/bookmarks/${bookmarkId}`, {
          method: "DELETE",
        });
        const deleteData = await deleteRes.json();

        if (deleteRes.status === 200) {
          // Update the bookmarksByCurrentUser state to remove the unbookmarked thread
          setBookmarksByCurrentUser((prevBookmarks) =>
            prevBookmarks.filter((bookmark) => bookmark.threadId !== threadId)
          );
          toast.success(deleteData.message);
        } else {
          toast.error(`${deleteRes.status} ${deleteData.message}`);
        }
      } else {
        toast.error(`${res.status} ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col gap-8 px-8 md:px-20 justify-center items-center min-h-dvh">
      {bookmarksByCurrentUser?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bookmarksByCurrentUser.map((bookmark) => (
            <div key={bookmark.thread.threadId} className="flex flex-col gap-0">
              <div>
                {bookmarksByCurrentUser.includes(bookmark.threadId) ? (
                  <span></span>
                ) : (
                  <div className="flex items-center absolute">
                    <div
                      className=" object-left-bottom border rounded-md p-0.5 bg-gray-100 text-xs my-0 tooltip tooltip-warning tooltip-left hover:bg-gray-50"
                      data-tip="delete bookmark"
                    >
                      <BookmarkX
                        onClick={() => handleUnbookmark(bookmark.threadId)}
                      />
                    </div>
                    <div className=" border rounded-md p-0.5 bg-gray-100 text-xs my-0">
                      {bookmark.thread.category} category belum muncul
                    </div>
                  </div>
                )}
              </div>
              <span className="mt-1">
                <Tweet id={bookmark.thread.threadId} />
              </span>
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
