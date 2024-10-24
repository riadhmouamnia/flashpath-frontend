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
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle-button";
import { Button } from "@/components/ui/button";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl}>
            <QueryClientProvider client={queryClient}>
              <header className="p-6 border-b border-b-slate-800 flex gap-4 justify-end">
                <div className="flex-1">
                  <Button variant="ghost">
                    <Link className="text-xl font-bold" href="/">
                      flashpath
                    </Link>
                  </Button>
                </div>
                <Button variant="link" className="text-secondary-foreground">
                  <Link href="/">Home</Link>
                </Button>
                {/* <Link className="underline" href="/paths">
                  All paths
                </Link> */}
                {/* <Link className="underline" href="/signalR">
                SignalR/Quix Demo
              </Link>
              <Link className="underline" href="/webSocket">
                WebSocket/Quix Demo
              </Link> */}
                <ModeToggle />
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
        </ThemeProvider>
      </body>
    </html>
  );
}
