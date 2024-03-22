"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const ChangePassword = () => {
  const [userInfo, setUserInfo] = useState({
    newPassword: "",
    confirmPassword: "",
    passwordMatchError: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ngintip password
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

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
  async function handleChangePassword(event) {
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
    <main className="bg-gray-100 space-y-2">
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-10 py-8 max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-4 dark:text-gray-200">
            Change Password
          </h1>
          <form action="#">
            <div className="mb-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  name="newPassword"
                  placeholder="input new password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChangeInput}
                ></input>
                <div
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center mr-2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </div>
              </div>
              <div className="relative">
                <input
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  name="confirmPassword"
                  placeholder="input new password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChangeInput}
                ></input>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              type="button"
              className="w-full btn bg-blue-500  text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
