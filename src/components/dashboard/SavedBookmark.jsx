"use client";

import React, { useEffect, useState } from "react";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { BookmarkX } from "lucide-react";
import { useRouter } from "next/navigation";

export const SavedBookmarks = ({ updateBookmarkCount }) => {
  const [bookmarksByCurrentUser, setBookmarksByCurrentUser] = useState([]);
  const router = useRouter();

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
          setBookmarksByCurrentUser(data.data);
          updateBookmarkCount(data.data.length);

          // Cache threads data in localStorage
          // localStorage.setItem("bookmarks", JSON.stringify(data.data));
        } else {
          console.error(`${res.status} ${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch threads when component mounts
    getBookmarks();
  }, [updateBookmarkCount]);

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
          console.log(deleteData.message);
          updateBookmarkCount(bookmarksByCurrentUser.length - 1);
        } else {
          console.error(`${deleteRes.status} ${deleteData.message}`);
        }
      } else {
        console.error(`${res.status} ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col gap-8 px-4 md:px-20 justify-center items-center">
      {bookmarksByCurrentUser?.length > 0 ? (
        <div className="sm:columns-2 gap-5 max-w-screen-xl  lg:columns-3 mb-10">
          {bookmarksByCurrentUser.map((bookmark) => (
            <div key={bookmark.thread.threadId} className="gap-0 inline-block">
              <span className="p-0">
                <Tweet id={bookmark.thread.threadId} />
              </span>
              <div className="font-semibold -mt-5">
                {bookmarksByCurrentUser.includes(bookmark.threadId) ? (
                  <span></span>
                ) : (
                  <div className="flex items-center justify-between">
                    <div
                    // className="border-gray-400 hover:cursor-pointer object-left-bottom border rounded-md p-0.5 text-xs my-0 tooltip tooltip-warning tooltip-bottom hover:bg-gray-100"
                    // data-tip="delete bookmark"
                    >
                      {/* <BookmarkX
                        color="#c70000"
                        onClick={() => handleUnbookmark(bookmark.threadId)}
                      /> */}
                      <button
                        className="btn btn-outline btn-sm font-sans font-medium"
                        // color="#c70000"
                        onClick={() => handleUnbookmark(bookmark.threadId)}
                      >
                        Unbookmark
                      </button>
                    </div>
                    <div
                      className={`border rounded-lg p-1.5 border-gray-300 text-xs font-sans my-0 ${
                        categoryColors[bookmark.thread.category]
                      }`}
                    >
                      {bookmark.thread.category}
                    </div>
                  </div>
                )}
              </div>
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
