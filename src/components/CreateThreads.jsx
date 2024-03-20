"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export const CreateThreads = ({userData}) => {
  const [threadUrl, setThreadId] = useState("");
  const [category, setCategory] = useState("");

  function handleUrlInput(event) {
    setThreadId(event.target.value);
  }

  function handleCategoryChange(event) {
    setCategory(event.target.value);
  }

  async function handleSubmitThread(event) {
    event.preventDefault();

    // check if url isBlank
    if (!threadUrl) {
      toast.error("input thread url");
      return;
    }

    // check if url valid and contain unnecessary white spaces

    const trimmedUrl = threadUrl.trim();
    const regex = /^https?:\/\/twitter\.com\/[A-Za-z0-9_]+\/status\/\d{15,}$/;
    if (!regex.test(trimmedUrl)) {
      toast.error("Invalid thread URL. Please enter a valid thread URL.");
      return;
    }

    // const user = JSON.parse(localStorage.getItem("user"));
    const userId = userData.id;

    // formData.append("userId", userId);

    const res = await fetch("/api/v1/threads", {
      method: "POST",
      body: JSON.stringify({ threadUrl, category, userId }),
    });

    // check duplicate thread
    if (res.status === 404) {
      const { errorMessage } = await res.json();
      toast.error(errorMessage);
      return;
    }

    const data = await res.json();
    toast.success("Create thread success!");
  }

  return (
    <main className="bg-gray-100 p-6 flex flex-col items-center">
      <div className="text-xl font-bold mb-4">Create Threads</div>

      <section className="mb-4 w-full max-w-md">
        <div className="mb-2">
          <label className="block mb-1 text-gray-700">Add link here</label>
          <input
            name="threadUrl"
            placeholder="example: twitter.com/sosmedkeras/status/1766114939583017046"
            onChange={handleUrlInput}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label className="block mb-1 text-gray-700">Thread category</label>
          <select
            name="category"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
            onChange={handleCategoryChange}
          >
            <option value="NEWS">News</option>
            <option value="POLITICS">Politics</option>
            <option value="TECHNOLOGY">Technology</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="SPORTS">Sports</option>
            <option value="PERSONAL_DEVELOPMENT">Personal Development</option>
            <option value="CULTURE">Culture</option>
            <option value="EDUCATION">Education</option>
            <option value="HUMOR">Humor</option>
            <option value="HEALTH_AND_WELLNESS">Health and Wellness</option>
          </select>
        </div>
      </section>
      <button
        onClick={handleSubmitThread}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Submit Product
      </button>
    </main>
  );
};
