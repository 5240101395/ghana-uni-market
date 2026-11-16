"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function BuyButton({ 
  productId, 
  whatsappLink, 
  sellerPhone, 
  productTitle,
  isSold
}: { 
  productId: string; 
  whatsappLink: string; 
  sellerPhone: string; 
  productTitle: string;
  isSold: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (isSold) {
    return (
      <button disabled className="w-full bg-[#e2e8f0] text-slate-500 font-bold py-3 rounded-xl cursor-not-allowed text-sm shadow-[inset_2px_2px_5px_#cbd5e1,inset_-2px_-2px_5px_#ffffff]">
        Sold Out
      </button>
    );
  }

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from("products").update({ interested_buyer_id: user.id }).eq("id", productId);
    }

    window.open(whatsappLink, "_blank");
    
    setLoading(false);
    setIsOpen(false);
    router.refresh(); 
  };

  return (
    <>
      {/* 3D Gradient Buy Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full relative flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-[0_5px_15px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_8px_20px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="relative z-10">Buy Now</span>
        <div className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {/* 3D Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f0f4f8] rounded-[2rem] p-8 max-w-sm w-full shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] relative">
            <h3 className="text-2xl font-extrabold mb-2 text-slate-900">Interested?</h3>
            <p className="text-slate-600 mb-8 text-sm font-medium">
              Clicking "Confirm" will open WhatsApp so you can arrange payment and delivery with the seller.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsOpen(false)} 
                className="flex-1 py-3 rounded-xl font-bold bg-[#e2e8f0] text-slate-600 shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleBuy} 
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-white flex justify-center items-center gap-2 shadow-[0_5px_15px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_8px_20px_-5px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}