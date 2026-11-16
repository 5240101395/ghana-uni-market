"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert } from "lucide-react";

export default function ReportButton({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("reports").insert({
      product_id: productId,
      reporter_id: user.id,
      reason: reason,
    });

    if (!error) {
  toast.success("Thank you. Listing reported to Admin.");
  setIsOpen(false);
} else {
  toast.error("Failed to submit report.");
}
    setLoading(false);
  };

  if (success) {
    return <p className="text-sm text-green-600 font-medium mt-4">Thank you. This listing has been reported to the Admin.</p>;
  }

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          Report this listing as a scam
        </button>
      ) : (
        <form onSubmit={handleReport} className="bg-red-50 p-4 rounded-lg border border-red-100">
          <label className="block text-sm font-medium text-red-800 mb-2">Why are you reporting this?</label>
          <textarea 
            required 
            rows={2} 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-red-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 mb-2 text-sm"
            placeholder="e.g. The seller is asking for payment before meeting..."
          />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              {loading ? "Submitting..." : "Submit Report"}
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}