"use client"

import Link from "next/link"
import { useState } from "react"

export function Header({ userData }) {
  const [isClicked, setIsClicked] = [true, false, false]

  return (
    <div className="flex flex-row justify-between border-b border-slate-800 p-4 md:py-4 md:px-16">
      <div className="flex flex-row gap-16">
        <img src="/logo.svg" alt="logo" className="w-12 h-12" />
        <div className="flex flex-row items-center gap-8">
          <Link className={`text-xl font-bold ${isClicked[0] ? "underline" : ""} hover:underline hover:cursor-pointer`}
            onClick={() => setIsClicked([true, false, false])}
            href={"/explore"}>Explore</Link>
          <Link className={`text-xl font-bold ${isClicked[1] ? "underline" : ""} hover:underline hover:cursor-pointer`}
            onClick={() => setIsClicked([false, true, false])}
            href={"/dashboard"}>Dashboard</Link>
          <Link className={`text-xl font-bold ${isClicked[2] ? "underline" : ""} hover:underline hover:cursor-pointer`}
            onClick={() => setIsClicked([false, false, true])}
            href={"/dashboard/new"}>Create</Link>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-bold underline">{userData?.username}</h1>
      </div>
    </div>
  )
}