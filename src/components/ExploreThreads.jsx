"use client";

import React, { useState, useEffect } from "react";
import { CategoryBtn } from "./CategoryBtn";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const ExploreThreads = ({ userData }) => {
  const categories = [
    "TRENDING",
    "NEWS",
    "POLITICS",
    "TECHNOLOGY",
    "ENTERTAINMENT",
    "SPORTS",
    "PERSONAL_DEVELOPMENT",
    "CULTURE",
    "EDUCATION",
    "HUMOR",
    "HEALTH_AND_WELLNESS",
  ];
  // const [userData, setUserData] = useState({})
  const [isClicked, setIsClicked] = useState([
    true,
    ...Array(categories.length - 1).fill(false),
  ]); // trending is clicked by default
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState([]);
  const [bookmarkedThreads, setBookmarkedThreads] = useState([]);
  const [unbookmarkedThreads, setUnbookmarkedThreads] = useState([]);
  const [bookmarksByCurrentUser, setBookmarksByCurrentUser] = useState([]);
  const [tokenExists, setTokenExists] = useState(false);
  const router = useRouter();

  async function getTrendingThreads() {
    try {
      const res = await fetch("/api/v1/threads?trending=true");
      const data = await res.json();
      toast.success(data.message);
      setThreads(data.data);
    } catch (error) {
      console.error(error);
      toast.error(`${data.status} ${data.message}`);
    }
  }

  async function getThreads(category = null, query = null, user = null) {
    setThreads([]); // reset thread upon click
    let fetchParams = "";
    if (category) {
      fetchParams = `?category=${category}`;
    }
    if (query) {
      fetchParams = `?q=${query}`;
    }
    if (user) {
      fetchParams = `?userid=${user}`;
    }
    const fetchUrl = `/api/v1/threads${fetchParams}`;
    try {
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
  }

  async function getBookmarkByUserAndThread(userId, threadId) {
    try {
      const res = await fetch(
        `/api/v1/bookmarks?userid=${userId}&threadid=${threadId}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // function getUserData() {
  //   const userData = localStorage.getItem("user");
  //   const userDataJson = JSON.parse(userData);
  //   setUserData(userDataJson);
  // }

  async function bookmarkThread(threadId) {
    setUnbookmarkedThreads([]); // reset unbookmark list helper
    try {
      const res = await fetch("/api/v1/bookmarks", {
        method: "POST",
        body: JSON.stringify({
          userId: userData?.id,
          threadId: threadId,
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        setBookmarkedThreads((prev) => {
          if (!prev.includes(threadId)) {
            return [...prev, threadId];
          }
          return prev;
        });
        toast.success(data.message);
      } else {
        toast.error(`${res.status} ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function unbookmarkThread(threadId) {
    setBookmarkedThreads([]); // reset bookmark list helper
    const bookmarkData = await getBookmarkByUserAndThread(
      userData?.id,
      threadId
    );
    const bookmarkId = bookmarkData.data[0].id;
    try {
      const res = await fetch(`/api/v1/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.status === 200) {
        setUnbookmarkedThreads((prev) => {
          if (!prev.includes(bookmarkId)) {
            return [...prev, bookmarkId];
          }
          return prev;
        });
        toast.success(data.message);
      } else {
        toast.error(`${res.status} ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getBookmarksByUser(userId) {
    try {
      const res = await fetch(`/api/v1/bookmarks?userid=${userId}`);
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
        const threadIds = data.data.map((bookmark) => bookmark.threadId);
        setBookmarksByCurrentUser(threadIds);
      } else if (res.status === 404) {
        setBookmarksByCurrentUser([]);
      } else {
        toast.error(`${res.status} ${data.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // initialization
  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get("token");
    setTokenExists(!!token); // Update state based on the presence of the token

    // Fetch trending threads
    // getUserData();
    getTrendingThreads();
  }, []);

  // trigger update bookmark each time user bookmarks/unbookmarks
  useEffect(() => {
    getBookmarksByUser(userData?.id);
  }, [bookmarkedThreads, unbookmarkedThreads]);

  function handleCategoryClick(categoryIndex, category) {
    setIsClicked(isClicked.map((_, index) => index === categoryIndex));
    if (category === "TRENDING") {
      getTrendingThreads();
      return;
    }
    getThreads(category, null, null);
  }

  function handleSearch(query) {
    getThreads(null, query, null);
  }

  function handleBookmark(threadId) {
    // Check if token exists before allowing bookmark
    if (!tokenExists) {
      toast.error("You must be logged in to bookmark a thread.");
      // Redirect to the login page
      router.push("/login");
      return;
    }
    bookmarkThread(threadId);
  }

  function handleUnbookmark(bookmarkId) {
    unbookmarkThread(bookmarkId);
  }

  return (
    <main className="flex flex-col gap-8 p-8 md:p-20 justify-center items-center min-h-dvh">
      <h1 className="text-3xl font-bold">Explore Threads</h1>
      <div className="flex flex-row justify-center items-center gap-4 w-full max-w-screen-md">
        <input
          type="search"
          className="w-full max-w-screen-sm p-4 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Search for threads..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(searchQuery);
            }
          }}
        ></input>
        <button
          className="bg-slate-800 text-white p-4 rounded-full"
          onClick={() => handleSearch(searchQuery)}
        >
          Go
        </button>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full max-w-screen-md">
        {categories.map((category, index) => (
          <CategoryBtn
            key={index}
            isTrending={index === 0}
            onClick={() => handleCategoryClick(index, category)}
            isClicked={isClicked[index]}
            categoryName={category}
          />
        ))}
      </div>
      {threads?.length > 0 ? (
        <div className="sm:columns-3 gap-5 w-[1200px] mx-auto columns-2 mb-10">
          {threads.map((thread) => (
            <div key={thread.threadId} className="gap-0 inline-block">
              <span className="p-0">
                <Tweet id={thread.threadId} />
              </span>
              <div className="font-semibold -mt-5">
                {bookmarksByCurrentUser.includes(thread.id) ? (
                  <>
                    <div className="flex items-center justify-between">
                      <button
                        className="text-sm font-bold p-2 flex justify-center items-center bg-slate-50 text-slate-800 border rounded"
                        onClick={() => handleUnbookmark(thread.id)}
                      >
                        Unbookmark Tweet
                      </button>
                      <div className="badge badge-outline text-xs my-0">
                        {thread.category}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1 justify-between">
                      <button
                        className="text-sm font-bold p-2 flex justify-center items-center bg-blue-500 text-white border rounded"
                        onClick={() => handleBookmark(thread.id)}
                      >
                        Bookmark Tweet
                      </button>
                      <div className="badge badge-outline text-xs my-0">
                        {thread.category}
                      </div>
                    </div>
                  </>
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
