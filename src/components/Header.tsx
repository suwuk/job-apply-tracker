"use client";

import { useSession } from "next-auth/react";

export default function Header() {
  const {data: session} = useSession()
  const username = session?.user?.fullname
  return (
    <header className="flex justify-between items-center mb-8 px-4 lg:px-0">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Welcome back, {username}</h1>
      {/* <div className="flex items-center gap-3">
        <img 
          src="" 
          alt="Profile" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-sm"
        />
        <span className="font-medium text-sm md:text-base text-gray-700">{username} ▾</span>
      </div> */}
    </header>
  );
}