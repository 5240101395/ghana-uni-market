"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-2 py-2"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:block">Log Out</span>
    </button>
  );
}