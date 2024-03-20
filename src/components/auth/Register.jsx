"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export const Register = () => {
  const router = useRouter();
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

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
    <main className="space-y-4">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-twitter">
        <div className="hidden lg:block dark:bg-gray-800">
          <img
            alt="Image"
            className="h-full w-full object-cover"
            height="1080"
            src="https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg"
            style={{
              aspectRatio: "1920/1080",
              objectFit: "cover",
            }}
            width="1920"
          />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Register</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your details to create an account
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
              <div className="flex flex-col space-y-2">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="password"
                  onChange={handleChangeInput}
                  required
                  className="input input-primary w-full"
                />
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
              Already have an account?
              <Link className="underline" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
