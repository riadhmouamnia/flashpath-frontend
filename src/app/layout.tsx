import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";

const signInUrl = "/sign-in";
const signUpUrl = `/sign-up`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider signInUrl={signInUrl} signUpUrl={signUpUrl}>
      <html lang="en">
        <body>
          <header className="p-6 bg-slate-800 flex gap-4 justify-end">
            <Link className="underline" href="/">
              Home
            </Link>
            <Link className="underline" href="/dashboard">
              Dashboard (protected)
            </Link>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
