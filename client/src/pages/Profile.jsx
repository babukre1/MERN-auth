import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <form className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
        <img
          className="w-24 h-24 self-center cursor-pointer rounded-full object-cover mt-3"
          src={currentUser.profilePicture}
          alt="profile picture"
        />
        <input
          type="text"
          placeholder="Usename"
          className="bg-slate-100 rounded-lg p-3"
          id="username"
        />
        <input
          type="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-100 rounded-lg p-3"
          id="password"
        />
        <button
          className="p-3 bg-slate-800 rounded-lg text-white
         uppercase hover:opacity-90
         disabled:opacity-80 "
        >
          update
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span className="text-red-500 cursor-pointer font-semibold">
          Delete Account
        </span>
        <span className="text-red-500 cursor-pointer font-semibold">
          Sign Out
        </span>
      </div>
    </div>
  );
}
