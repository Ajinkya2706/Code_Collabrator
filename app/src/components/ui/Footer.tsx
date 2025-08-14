"use client";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, User, Settings } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";

const dockItems = [
  { title: "Home", icon: <Home />, href: "/" },
  { title: "Profile", icon: <User />, href: "/me" },
  { title: "Settings", icon: <Settings />, href: "/settings" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto flex flex-col items-center">
        <FloatingDock items={dockItems} />
        <p className="mt-4 text-muted-foreground text-sm">© {new Date().getFullYear()} Code Collab. All rights reserved.</p>
      </div>
    </footer>
  );
}