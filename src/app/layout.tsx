"use client";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const signInUrl = "/sign-in";
const signUpUrl = `/sign-up`;

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/style.css"
        />
      </head> */}
      <body>
        <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl}>
          <QueryClientProvider client={queryClient}>
            <header className="p-6 border-b border-b-slate-800 flex gap-4 justify-end">
              <div className="flex-1">
                <Link className="text-xl font-bold" href="/">
                  Flashpath.
                </Link>
              </div>
              <Link className="underline" href="/">
                Home
              </Link>
              <Link className="underline" href="/paths">
                All paths
              </Link>
              {/* <Link className="underline" href="/signalR">
                SignalR/Quix Demo
              </Link>
              <Link className="underline" href="/webSocket">
                WebSocket/Quix Demo
              </Link> */}
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <main>{children}</main>
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
