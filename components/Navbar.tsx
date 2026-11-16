"use client";

import Link from "next/link";
import { ShoppingBag, PlusCircle, UserCircle, List, MessageSquare, MoreVertical, X } from "lucide-react";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfileAndMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);

        const { count } = await supabase
          .from("messages")
          .select("*", { count: 'exact', head: true })
          .eq("receiver_id", user.id)
          .eq("is_read", false);
        
        setUnreadCount(count || 0);
      }
    };
    fetchProfileAndMessages();
  }, [supabase]);

  return (
    <nav className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-700/50 sticky top-0 z-50 transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* Logo */}
        <Link href="/protected" className="flex items-center justify-center">
          <img 
            src="https://bjuqolzglzzorzctwilw.supabase.co/storage/v1/object/public/product-images/1c8d7644-f24c-420d-8841-13fd69249900.png" 
            alt="Ghana UNI Market Logo" 
            className="h-14 sm:h-16 w-auto object-contain" 
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <Link href="/protected/my-listings" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-2 py-2">
            <List className="w-4 h-4" />
            <span>My Listings</span>
          </Link>

          <Link href="/protected/inbox" className="relative flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-2 py-2">
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <span>Inbox</span>
          </Link>

          <Link href="/protected/upload" className="flex items-center gap-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-[0_5px_15px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_20px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all">
            <PlusCircle className="w-4 h-4" />
            <span>Sell Item</span>
          </Link>
          
          <ThemeToggle />
          
          <Link href="/protected/profile" className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/50 shadow-sm hover:border-indigo-500 transition-all ml-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-7 h-7 text-slate-500" />
            )}
          </Link>
          
          <LogoutButton />
        </div>

        {/* MOBILE MENU BUTTONS */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/protected/profile" className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-white/50 shadow-sm hover:border-indigo-500 transition-all">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-6 h-6 text-slate-500" />
            )}
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-slate-600 hover:text-indigo-600 p-1"
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <MoreVertical className="w-7 h-7" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-800 flex flex-col p-4 space-y-2 md:hidden z-50">
            <Link href="/protected/my-listings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>
              <List className="w-5 h-5 text-indigo-500" /> My Listings
            </Link>
            <Link href="/protected/inbox" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200" onClick={() => setIsMobileMenuOpen(false)}>
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Inbox
              {unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/protected/upload" className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 text-indigo-600 font-bold" onClick={() => setIsMobileMenuOpen(false)}>
              <PlusCircle className="w-5 h-5" /> Sell Item
            </Link>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</span>
              <ThemeToggle />
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <LogoutButton />
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}