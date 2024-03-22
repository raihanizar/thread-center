"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export const CreateThreads = ({ userData }) => {
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
    const regex =
      /^https?:\/\/(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d{15,}$/;
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
    window.location.replace("/dashboard");
  }

  return (
    <main className="grow flex flex-col gap-8 p-8 md:p-20 justify-center items-center">
      <h1 className="text-2xl font-semibold">Create New Thread</h1>
      <div className="flex flex-col gap-6 p-6 border border-slate-900 rounded-xl">
        <div className="flex flex-col gap-2">
          <label className="block text-base text-gray-700">Add link here</label>
          <textarea
            name="threadUrl"
            placeholder="example: twitter.com/sosmedkeras/status/1766114939583017046"
            onChange={handleUrlInput}
            className="textarea textarea-info h-40 w-full border rounded-md px-4 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-base text-gray-700">
            Thread category
          </label>
          <select
            name="category"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
            onChange={(event) => handleCategoryChange(event)}
          >
            <option value="">--Choose category--</option>
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
        <button
          onClick={handleSubmitThread}
          className="btn btn-sm w-fit bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 rounded"
        >
          Post Thread
        </button>
      </div>
    </main>
  );
};
