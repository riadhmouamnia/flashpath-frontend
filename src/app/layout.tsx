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
      <body>
        <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl}>
          <QueryClientProvider client={queryClient}>
            <header className="p-6 bg-slate-800 flex gap-4 justify-end">
              <Link className="underline" href="/">
                Home
              </Link>
              <Link className="underline" href="/pages">
                Pages (protected)
              </Link>
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
