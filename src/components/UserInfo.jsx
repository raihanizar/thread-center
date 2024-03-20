"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    newPassword: "",
    newUsername: "",
    confirmPassword: "",
    passwordMatchError: "",
  });

  // Function to handle input change
  function handleChangeInput(event) {
    const { name, value } = event.target;

    // Check if confirmed password matches the new password
    if (name === "confirmPassword" && value !== userInfo.newPassword) {
      setUserInfo({
        ...userInfo,
        passwordMatchError:
          "Confirmed password does not match the new password",
        [name]: value,
      });
    } else {
      setUserInfo({
        ...userInfo,
        passwordMatchError: "", // Reset the error message
        [name]: value,
      });
    }
  }

  // Function to handle login
  async function handleChangeUserInfo(event) {
    event.preventDefault();

    const { newPassword, confirmPassword } = userInfo;

    // Check if confirmPassword is empty
    if (!newPassword || !confirmPassword) {
      toast.error("Password field can not be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;

    const res = await fetch(`/api/v1/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userInfo),
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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  return (
    <main className="flex flex-col items-center my-10 space-y-4">
      <div className="text-xl font-bold">Change User Info</div>

      <section className="space-y-4 w-full max-w-md">
        <div className="flex flex-col">
          <label className="text-gray-700">New Username</label>
          <input
            placeholder={userInfo.username}
            className="input input-primary"
            type="text"
            name="newUsername"
            onChange={handleChangeInput}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            className="input input-primary"
            required
            onChange={handleChangeInput}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="input input-primary"
            required
            onChange={handleChangeInput}
          />
          <p className="text-red-500 text-sm">{userInfo.passwordMatchError}</p>
        </div>

        <button
          className="btn btn-primary bg-blue-500 hover:bg-blue-600"
          onClick={handleChangeUserInfo}
        >
          Update Password
        </button>
      </section>
    </main>
  );
};
