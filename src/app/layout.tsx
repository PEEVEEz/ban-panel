import "./globals.css";
import type { Metadata } from "next";
import { twMerge } from "tailwind-merge";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { Login } from "@/components/Login";
import { getServerSession } from "next-auth";
import { NextAuthProvider } from "./providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ban Panel",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={twMerge(
          inter.className,
          "bg-black bg-gradient-to-tl from-black from-60% to-indigo-400/20 h-screen"
        )}
      >
        <NextAuthProvider>
          <div className="flex h-full w-full">
            <Sidebar session={session} />

            {!session?.user && <Login />}

            <div className="flex-1">{children}</div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
