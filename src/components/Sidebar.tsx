"use client";

import { Link } from "./Link";
import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { IcBaselineLogout } from "./icons/Logout";
import { SolarServer2Bold } from "./icons/Server";
import { MaterialSymbolsPerson } from "./icons/Person";
import { MaterialSymbolsArrowRightAltRounded } from "./icons/ArrowRight";
import { MaterialSymbolsArrowLeftAltRounded } from "./icons/ArrowLeft";

interface Props {
  session: Session | null;
}

export function Sidebar({ session }: Props) {
  return (
    <div className="w-64 backdrop-blur-lg border-r h-full border-neutral-100/5 flex flex-col">
      <div className="flex items-center justify-center h-28 text-3xl text-neutral-200 font-semibold">
        BAN PANEL
      </div>

      <div className="w-full flex flex-col flex-1">
        <Link
          href={"/"}
          activeClass="bg-neutral-300 text-black border-r-8 border-indigo-400"
          className="w-full px-4 py-2.5 text-neutral-200 flex items-center gap-2 hover:scale-105 transition-all select-none"
        >
          <MaterialSymbolsPerson className="w-4" />
          Hallinnoi porttikieltoja
        </Link>

        <Link
          href={"/export"}
          activeClass="bg-neutral-300 text-black border-r-8 border-indigo-400"
          className="w-full px-4 py-2.5 text-neutral-200 flex items-center gap-2 hover:scale-105 transition-all select-none"
        >
          <MaterialSymbolsArrowLeftAltRounded className="w-4" />
          <span>Vie porttikieltoja</span>
        </Link>

        <Link
          href={"/servers"}
          activeClass="bg-neutral-300 text-black border-r-8 border-indigo-400"
          className="w-full px-4 py-2.5 text-neutral-200 flex items-center gap-2 hover:scale-105 transition-all select-none"
        >
          <SolarServer2Bold className="w-4" />
          <span>Palvelimesi</span>
        </Link>
      </div>

      {session?.user && (
        <div className="px-2.5 py-4 flex justify-between items-center text-neutral-200">
          <div className="flex items-center gap-2">
            <Image
              width={30}
              height={30}
              src={session.user.image || ""}
              className="rounded-full"
              alt="pfp"
            />

            <span>{session.user.name}</span>
          </div>

          <button onClick={() => signOut()}>
            <IcBaselineLogout className="w-5 text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}
