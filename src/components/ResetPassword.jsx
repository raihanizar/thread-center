"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const ResetPassword = () => {
  const [resetPassword, setResetPassword] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    passwordMatchError: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ngintip password
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  const router = useRouter();

  // Function to handle input change
  function handleChangeInput(event) {
    const { name, value } = event.target;

    // Check if confirmed password matches the new password
    if (name === "confirmPassword" && value !== resetPassword.newPassword) {
      setResetPassword({
        ...resetPassword,
        passwordMatchError:
          "Confirmed password does not match the new password",
        [name]: value,
      });
    } else {
      setResetPassword({
        ...resetPassword,
        passwordMatchError: "", // Reset the error message
        [name]: value,
      });
    }
  }

  // Function to handle login
  async function handleResetPassword(event) {
    event.preventDefault();

    const { newPassword, confirmPassword } = resetPassword;

    // Check if confirmPassword is empty
    if (!newPassword || !confirmPassword) {
      toast.error("Password field can not be empty");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const res = await fetch(`/api/v1/users/`, {
      method: "PATCH",
      body: JSON.stringify(resetPassword),
    });

    if (res.status === 500 || res.status === 404) {
      const { message } = await res.json();
      toast.error(message);
      return;
    }
    const { message } = await res.json();
    toast.success(message);
    router.push("/login");
  }

  return (
    <main className="bg-gray-100">
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-10 py-8 max-w-md">
          <div className="mx-auto w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold">Reset Password</h1>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-gray-700">Registered Email</label>
                <input
                  placeholder="me@domain.com"
                  className="input input-primary w-full"
                  type="email"
                  name="email"
                  onChange={handleChangeInput}
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="input input-primary w-full"
                    required
                    onChange={handleChangeInput}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center mr-2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="input input-primary"
                  required
                  onChange={handleChangeInput}
                />
                <p className="text-red-500 text-sm">
                  {resetPassword.passwordMatchError}
                </p>
              </div>
              <button
                className="btn btn-primary bg-blue-500 hover:bg-blue-600"
                onClick={handleResetPassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
