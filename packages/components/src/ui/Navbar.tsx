"use client";

import Link from "next/link";
import Image from 'next/image'
import { motion } from "framer-motion";
import { Button } from "./button";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Settings, LogOut, Home, Menu, X } from "lucide-react";


type NavbarUser = {
  id: number
  name?: string | null
  username: string
  email: string
  avatar?: string | null
}

const links = [
  { name: "Features", href: "/#features" },
  { name: "Docs", href: "/docs" },
  { name: "Open Source", href: "/open-source" },
  { name: "Solutions", href: "/solutions" },
];

export default function Navbar({ user }: { user?: NavbarUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const renderLinks = (onNavigate?: () => void, activeClassName = "") =>
    links.map((link) => {
      const isActive = pathname === link.href || (link.href === "/#features" && pathname === "/");
      return (
        <Link
          key={link.name}
          href={link.href}
          onClick={onNavigate}
          className={`text-sm font-medium transition-colors relative ${
            isActive ? `text-white ${activeClassName}` : "text-zinc-400 hover:text-white"
          }`}
        >
          {link.name}
          {isActive && (
            <motion.div
              layoutId="active-link"
              className="absolute -bottom-2 left-0 right-0 h-px bg-white"
            />
          )}
        </Link>
      );
    });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between h-20 px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <Image
              src="/iconX2.png"
              width={25}
              height={25}
              alt="ZeroZone logo"
              className="transition-transform group-hover:scale-105"
            />
            <span className="font-display text-xl font-normal tracking-tight text-white">Zone</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 ml-8">{renderLinks()}</nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
             <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <button className="relative flex items-center gap-2 rounded-full border border-white/10 p-1 hover:bg-white/5 transition-colors">
                 <Avatar className="h-8 w-8">
                   {user.avatar ? (
                     <AvatarImage 
                       src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.avatar}`} 
                       alt={user.username} 
                     />
                   ) : (
                     <AvatarFallback className="bg-white/10 text-xs text-white">
                       {user.username?.[0]?.toUpperCase()}
                     </AvatarFallback>
                   )}
                 </Avatar>
                 <span className="text-sm font-medium pr-2 hidden sm:block text-zinc-300">{user.username}</span>
               </button>
             </DropdownMenuTrigger>
             <DropdownMenuContent className="w-56 mt-4 glass-dark border-white/10 text-white" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold">{user.name || user.username}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild>
                  <Link href="/zone" className="flex items-center gap-2 py-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="flex items-center gap-2 py-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  className="text-red-400 focus:bg-red-500/10 py-2 cursor-pointer"
                  onClick={async () => {
                    try {
                      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
                        method: 'POST',
                        credentials: 'include',
                      })
                    } catch (err) {
                      console.error('Logout failed:', err)
                    }
                    router.push('/auth')
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
             </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="h-10 px-6 rounded-full bg-white text-black hover:bg-zinc-200 border-0 font-semibold transition-all">
              <Link href="/auth">Get Started</Link>
            </Button>
          )}

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-6 py-6 flex flex-col items-start gap-5">
            {renderLinks(closeMenu)}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

