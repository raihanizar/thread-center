"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ResetPassword = () => {
  const [resetPassword, setResetPassword] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    passwordMatchError: "",
  });

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
    <main className="flex flex-col items-center my-10 space-y-4">
      <div className="text-xl font-bold">Reset Password</div>

      <section className="space-y-4 w-full max-w-md">
        <div className="flex flex-col">
          <label className="text-gray-700">Registered Email</label>
          <input
            placeholder="me@domain.com"
            className="input input-primary"
            type="email"
            name="email"
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
      </section>
    </main>
  );
};
