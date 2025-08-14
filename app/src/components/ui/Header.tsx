"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import logo from "@/assets/logo.png";
import ThemeSwitcher from "@/components/ide/ThemeSwitcher";
import { logoutUser } from "@/services/auth-services";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="border-b bg-background z-10">
      <div className="container mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Code Collab logo text */}
          <Link href="/" className="flex items-center ">
            <Image
              src={logo}
              alt="Code Collab Logo"
              className="w-10 mr-1 rounded-md"
            />
            <span className="text-xl font-bold">Code Collab</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher theme={theme} onToggle={handleThemeToggle} />
          {status === "authenticated" && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus:outline-none">
                  <Avatar className="w-8 h-8 border border-black bg-black">
                    <AvatarImage src={"/avatar.png"} alt={session.user.name || "User"} />
                    <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/me">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" onClick={() => router.push("/login")}>Log in</Button>
          )}
        </div>
      </div>
    </header>
  );
}
