"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Loader2, Save } from "lucide-react";

export default function EditWhatsApp({ userId, currentNumber }: { userId: string, currentNumber: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [number, setNumber] = useState(currentNumber || "");
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ whatsapp_number: number })
      .eq("id", userId);

    if (error) {
      toast.error("Failed to update number.");
    } else {
      toast.success("WhatsApp number updated!");
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-1"
      >
        Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-500" />
              Update WhatsApp
            </h3>
            
            <form onSubmit={handleUpdate}>
              <input 
                type="tel" 
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 0241234567"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white mb-4"
              />
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex justify-center items-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}