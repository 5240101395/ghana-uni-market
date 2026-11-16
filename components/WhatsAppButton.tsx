"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { sendSellerSMS } from "@/app/actions/sms";

export default function WhatsAppButton({ 
  whatsappLink, 
  sellerPhone, 
  productTitle 
}: { 
  whatsappLink: string; 
  sellerPhone: string; 
  productTitle: string; 
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Start the loading animation
    setLoading(true);

    // Fire the SMS in the background
    sendSellerSMS(sellerPhone, productTitle).catch(console.error);

    // Let the link open after a tiny delay so the user sees the loading state
    setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds
  };

  return (
    <a 
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 font-medium py-3 rounded-lg transition-all duration-300 ${
        loading 
          ? "bg-green-600 cursor-wait" 
          : "bg-green-500 hover:bg-green-600"
      } text-white`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Opening WhatsApp...
        </>
      ) : (
        <>
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </>
      )}
    </a>
  );
}