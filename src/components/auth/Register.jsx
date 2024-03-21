"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export const Register = () => {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // ngintip password
  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  function handleChangeInput(event) {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleRegister() {
    const { username, email, password } = registerData;

    if (!username || !email || !password) {
      toast.error("all fields must be filed");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(registerData),
    });

    if (res.status === 400 || res.status === 401) {
      const { message } = await res.json();
      toast.error(message);
      return;
    }

    const { data, message } = await res.json();
    toast.success(message);
    // window.location.replace("/login");
    router.push("/login");
  }

  return (
    <main className="bg-gray-100">
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-10 py-8 max-w-md">
          <div className="mx-auto w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold">Register</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Let's post your first thread
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="username">Username</label>
                <input
                  name="username"
                  placeholder="username"
                  onChange={handleChangeInput}
                  required
                  type="text"
                  className="input input-primary w-full"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="email@domain.com"
                  onChange={handleChangeInput}
                  required
                  className="input input-primary w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <div className="relative ">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    onChange={handleChangeInput}
                    required
                    className="input input-primary w-full"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center mr-2"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                  </div>
                </div>
              </div>
              <button
                className="w-full btn bg-blue-500 hover:bg-blue-600 text-white"
                type="submit"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?&nbsp;
              <Link
                className="underline hover:btn hover:btn-xs hover:btn-info hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
