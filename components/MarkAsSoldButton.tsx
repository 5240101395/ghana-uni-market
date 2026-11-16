"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";

export default function MarkAsSoldButton({ productId, isSold }: { productId: string, isSold: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (isSold) {
    return (
      <div className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium py-3 rounded-lg text-center flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
        <CheckCircle className="w-5 h-5" />
        This item has been sold
      </div>
    );
  }

  const handleMarkSold = async () => {
    if (!confirm("Are you sure you want to mark this item as sold? Other buyers will no longer be able to message you.")) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("products")
      .update({ is_sold: true })
      .eq("id", productId);

    if (error) {
      alert("Error marking as sold: " + error.message);
      setLoading(false);
    } else {
      router.refresh(); // Refresh the page to show the SOLD state
    }
  };

  return (
    <button
      onClick={handleMarkSold}
      disabled={loading}
      className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
      {loading ? "Marking as sold..." : "Mark as Sold"}
    </button>
  );
}