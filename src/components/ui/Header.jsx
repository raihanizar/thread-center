"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header({ userData }) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("user");
    Cookies.remove("token");
    router.push("/explore");
  }

  return (
    <div className="flex flex-row justify-between border-b border-slate-800 p-2 md:py-2 md:px-12">
      <div className="flex flex-row gap-10">
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
        <div className="flex flex-row items-center gap-8">
          <Link
            className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/explore"}
          >
            Explore
          </Link>
          <Link
            className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/dashboard"}
          >
            Dashboard
          </Link>
          <Link
            className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/dashboard/new"}
          >
            Create
          </Link>
        </div>
      </div>
      <div className="flex flex-row items-center">
        {userData ? (
          <div className=" dropdown dropdown-end dropdown-hover">
            <Link
              tabIndex={0}
              role="button"
              className="flex flex-row justify-center items-center gap-2 rounded-lg p-2 border border-slate-800 hover:bg-slate-200 hover:cursor-pointer"
              href={"#"}
            >
              <CircleUserRound />
              <h1 className="text-lg font-bold underline">
                {userData?.username}
              </h1>
            </Link>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/dashboard/changepassword">Change Password</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded"
            href={"/login"}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
