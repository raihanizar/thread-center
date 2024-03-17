"use client";

import React, { useState, useEffect } from "react";
import { CategoryBtn } from "./CategoryBtn";
import { Tweet } from "react-tweet";
import toast from "react-hot-toast";

export const ExploreThreads = () => {
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
  const [isClicked, setIsClicked] = useState([true, ...Array(categories.length - 1).fill(false)]); // trending is clicked by default
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState([]);

  async function getTrendingThreads() {
    try {
      const res = await fetch("/api/v1/threads?trending=true")
      const data = await res.json()
      toast.success(data.message);
      setThreads(data.data)
    } catch (error) {
      console.error(error);
      toast.error(`${data.status} ${data.message}`);
    }
  }

  async function getThreads(category = null, query = null, user = null) {
    setThreads([]) // reset thread upon click
    let fetchParams = "";
    if (category) {
      fetchParams = `?category=${category}`
    }
    if (query) {
      fetchParams = `?q=${query}`
    }
    if (user) {
      fetchParams = `?userid=${user}`
    }
    const fetchUrl = `/api/v1/threads${fetchParams}`;
    try {
      const res = await fetch(fetchUrl)
      const data = await res.json()
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

  // shows trending threads by default
  useEffect(() => {
    getTrendingThreads();
  }, []);

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
        <button className="bg-slate-800 text-white p-4 rounded-full" onClick={() => handleSearch(searchQuery)}>Go</button>
      </div>
      <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-full max-w-screen-md">
        {categories.map((category, index) => (
          <CategoryBtn key={index} isTrending={index === 0} onClick={() => handleCategoryClick(index, category)} isClicked={isClicked[index]} categoryName={category} />
        ))}
      </div>
      {threads?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {threads.map((thread) => (
            <Tweet key={thread.threadId} id={thread.threadId} />
          ))}
        </div>
      ) : (
        <div className="border rounded-md flex justify-center items-center p-4">
          <p className="text-xl font-bold">No threads found.</p>
        </div>
      )}
    </main>
  )
}