"use client";
import { toast } from "sonner";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Store, Loader2, CheckCircle } from "lucide-react";

export default function UpgradeToSeller({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // If they are already a seller, show a badge
  if (currentStatus === 'seller') {
    return (
      <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-medium">
        <CheckCircle className="w-5 h-5" />
        You are a verified Seller
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <strong>Request Submitted!</strong> Your payment is being reviewed by the Admin. You will be upgraded to a Seller soon.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("seller_requests").insert({
      user_id: userId,
      transaction_id: txnId,
    });

    if (error) {
  toast.error("Error submitting request.");
  setLoading(false);
} else {
  toast.success("Request submitted! Wait for Admin approval.");
  setSubmitted(true);
  setLoading(false);
  setIsOpen(false);
}
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Store className="w-5 h-5" />
        Become a Seller
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Upgrade to Seller</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              To start selling on Ghana UNI Market, please send <strong>GH₵ 30.00</strong> to our Mobile Money number:
            </p>
            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-center mb-4">
              <p className="font-bold text-lg dark:text-white">0595391134</p>
              <p className="text-sm text-slate-500">Name: Ghana UNI Market</p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-2 text-sm">
              After sending, enter the Transaction ID below:
            </p>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                required
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="e.g. 123456789"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg mb-4 dark:bg-slate-900 dark:text-white"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}