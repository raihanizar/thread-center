"use client";

import React, { useState, useEffect } from "react";
import { CategoryBtn } from "./CategoryBtn";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BookmarkX, Bookmark } from "lucide-react";

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

  function replaceUnderscoreWithSpace(category) {
    return category.replace(/_/g, " ");
  }

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
        const threadIds = data.data.map((bookmark) => bookmark.threadId);
        setBookmarksByCurrentUser(threadIds);
      } else if (res.status === 404) {
        setBookmarksByCurrentUser([]);
      } else {
        console.error(`${res.status} ${data.message}`);
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

    // Fetch bookmarked threads
    if (userData) {
      getBookmarksByUser(userData.id);
    }
  }, [userData]);

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
            categoryName={replaceUnderscoreWithSpace(category)}
          />
        ))}
      </div>
      {threads?.length > 0 ? (
        <div className="sm:columns-2 gap-5 max-w-screen-xl mx-auto lg:columns-3 mb-10">
          {threads.map((thread) => (
            <div key={thread.threadId} className="gap-0 inline-block">
              <span className="p-0">
                <Tweet id={thread.threadId} />
              </span>
              <div className="font-semibold -mt-5">
                {bookmarksByCurrentUser.includes(thread.id) ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div
                      // className="border-gray-400 hover:cursor-pointer object-left-bottom border rounded-md p-0.5 text-xs my-0 tooltip tooltip-warning tooltip-bottom hover:bg-gray-100"
                      // data-tip="delete bookmark"
                      >
                        <button
                          className="btn btn-outline btn-sm font-sans font-medium"
                          // color="#c70000"
                          onClick={() => handleUnbookmark(thread.id)}
                        >
                          unbookmark
                        </button>
                      </div>
                      <div
                        className={`border rounded-lg p-1.5 border-gray-300 text-xs font-sans my-0 ${
                          categoryColors[thread.category]
                        }`}
                      >
                        {thread.category}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div
                      // className="border-gray-100 hover:cursor-pointer object-left-bottom border rounded-md p-0.5  text-xs my-0 tooltip tooltip-warning tooltip-bottom hover:bg-gray-100"
                      // data-tip="bookmark thread"
                      >
                        <button
                          className="btn btn-info btn-sm text-white font-sans font-normal"
                          // color="#26a7de"
                          onClick={() => handleBookmark(thread.id)}
                        >
                          bookmark
                        </button>
                      </div>
                      <div
                        className={`border rounded-lg p-1.5 border-gray-300 text-xs font-sans my-0 ${
                          categoryColors[thread.category]
                        }`}
                      >
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
