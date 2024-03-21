"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ngintip password
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function handleChangeInput(event) {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleLogin() {
    const { email, password } = loginData;

    if (!email || !password) {
      console.log("all fields must be filed");
      toast.error("all fields must be filed");
      return;
    }

    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });

    if (res.status === 401) {
      const { errorMessage } = await res.json();
      toast.error(errorMessage);
      return;
    }

    const { data, message } = await res.json();

    localStorage.setItem("user", JSON.stringify(data));
    toast.success(message);
    window.location.replace("/dashboard");
  }

  return (
    <main className=" bg-gray-100">
      {/* login baru */}
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-10 py-8 max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-4 dark:text-gray-200">
            Welcome back Threaders!
          </h1>
          <form action="#">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                name="email"
                placeholder="email@domain.com"
                onChange={handleChangeInput}
                required
              ></input>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  name="password"
                  placeholder="password"
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
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link
                  href="/resetpassword"
                  className="hover:btn hover:btn-xs hover:btn-info text-xs text-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Forgot Password?
                </Link>
              </div>
              <Link
                href="/register"
                className="hover:btn hover:btn-xs hover:btn-info text-xs text-indigo-500 hover:text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Account
              </Link>
            </div>
            <button
              onClick={handleLogin}
              type="button"
              className="w-full btn bg-blue-500  text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
