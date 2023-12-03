"use client";

import { signIn } from "next-auth/react";

export function Login() {
  return (
    <div className="fixed w-full h-full backdrop-blur-sm flex items-center justify-center z-50">
      <button
        onClick={() => signIn("discord")}
        className="bg-indigo-500 px-3 py-2 text-xl rounded text-neutral-200"
      >
        Kirjaudu sisään discordilla
      </button>
    </div>
  );
}
