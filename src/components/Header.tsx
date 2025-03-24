import Image from "next/image";
import Link from "next/link";
import React from "react";
import { shadow } from "../styles/utils";
import { Button } from "./ui/button";
import { ModeToggle } from "./DarkModeToggle";
import LogoutButton from "./LogoutButton";

function Header() {
  const user = null;

  return (
    <header
      className="bg-popover flex h-24 items-center justify-between px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/book.png"
          className=""
          alt="AI Notes Logo"
          width={60}
          height={60}
          priority
        />
        <h1 className="flex flex-col text-2xl leading-6 font-semibold">
          AI <span>Notes</span>
        </h1>
      </Link>
      <div className="flex gap-2">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <Button asChild className="hidden sm:block">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

export default Header;
