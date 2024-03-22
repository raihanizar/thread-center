"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function Profile({ userData }) {
  const [userProfile, setUserProfile] = useState({
    newUsername: userData?.username,
    newEmail: userData?.email,
  });

  // Function to handle input change
  function handleChangeInput(event) {
    setUserProfile({
      ...userProfile,
      [event.target.name]: event.target.value,
    });
  }

  // Function to handle login
  async function handleChangeProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;

    const res = await fetch(`/api/v1/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userProfile),
    });

    if (res.status === 401 || res.status === 404) {
      const { errorMessage } = await res.json();
      toast.error(errorMessage);
      return;
    }

    const { data, message } = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    toast.success(message);
    setTimeout(() => {
      window.location.replace("/dashboard");
    }, 2000);
  }

  return (
    <main className="grow flex flex-col gap-8 p-8 md:p-20 justify-center items-center">
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <div className="flex flex-col gap-6 p-6 border border-slate-900 rounded-xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="newUsername"
            className="input input-primary"
            defaultValue={userData?.username}
            onChange={handleChangeInput}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="newEmail"
            className="input input-primary"
            defaultValue={userData?.email}
            onChange={handleChangeInput}
          />
        </div>
        <button
          className="w-full btn btn-active bg-blue-500 hover:bg-blue-600 text-white"
          type="submit"
          onClick={handleChangeProfile}
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
