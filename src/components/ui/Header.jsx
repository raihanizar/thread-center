"use client"

import Link from "next/link"
import { CircleUserRound } from 'lucide-react';

export function Header({ userData }) {

  return (
    <div className="flex flex-row justify-between border-b border-slate-800 p-2 md:py-2 md:px-12">
      <div className="flex flex-row gap-10">
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
        <div className="flex flex-row items-center gap-8">
          <Link className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/explore"}>Explore</Link>
          <Link className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/dashboard"}>Dashboard</Link>
          <Link className={`text-lg font-bold hover:underline hover:cursor-pointer`}
            href={"/dashboard/new"}>Create</Link>
        </div>
      </div>
      <div className="flex flex-row items-center">
        {userData ? (
          <Link 
            className="flex flex-row justify-center items-center gap-2 rounded-lg p-2 border border-slate-800 hover:bg-slate-200 hover:cursor-pointer"
            href={"/profile"}>
            <CircleUserRound />
            <h1 className="text-lg font-bold underline">{userData?.username}</h1>
          </Link>
        )
          : (<Link className="bg-blue-500 text-white hover:bg-blue-600 p-2 rounded" href={"/login"}>Login</Link>)
        }
      </div>
    </div>
  )
}