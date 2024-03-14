"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

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

    if (res.status === 401 || res.status === 404) {
      const { errorMessage } = await res.json();
      console.log(errorMessage);
      toast.error(errorMessage);
      return;
    }

    const { data, message } = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    toast.success(message);
    window.location.replace("/dashboard");
  }

  return (
    <main className="space-y-6">
      {/* // login baru */}
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-slate-50">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="email@domain.com"
                  onChange={handleChangeInput}
                  className="input input-primary"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                  <Link
                    className="ml-auto inline-block text-sm underline"
                    href="#"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <input
                  required
                  name="password"
                  placeholder="password"
                  type="password"
                  onChange={handleChangeInput}
                  className="input input-primary"
                />
              </div>
              <button
                className="w-full btn btn-active"
                type="submit"
                onClick={handleLogin}
              >
                Login
              </button>
              <button className="w-full btn btn-active" variant="outline">
                Login with Twitter
              </button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?
              <Link className="underline" href="/register">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-twitter lg:block dark:bg-gray-800">
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
      </div>
    </main>
  );
};
