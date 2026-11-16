"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { X, MessageCircle, Mail, Phone, Loader2, HeadphonesIcon } from "lucide-react";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("support_messages").insert({
      user_id: user?.id || null,
      name,
      email,
      message,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent! We will reply shortly.");
      setIsOpen(false);
      setName("");
      setEmail("");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#f0f4f8] text-slate-700 p-4 rounded-full shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] transition-all duration-300 group"
      >
        <HeadphonesIcon className="w-7 h-7 group-hover:text-indigo-600 transition-colors" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-slate-100">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">Customer Support</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">We're here to help you 24/7</p>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <a href="https://wa.me/233595391134" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 py-2.5 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                <MessageCircle className="w-4 h-4 text-green-500" /> WHATSAPP
              </a>
              <a href="tel:+233595391134" className="flex items-center justify-center gap-1.5 py-2.5 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Phone className="w-4 h-4 text-red-500" /> CALL US
              </a>
              <a href="mailto:sampsonantwi96@.com" className="flex items-center justify-center gap-1.5 py-2.5 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Mail className="w-4 h-4 text-blue-500" /> EMAIL
              </a>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2 mb-4">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Or send a message</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name" 
                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
              />
              
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email (optional)" 
                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
              />

              <textarea 
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help you?" 
                className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm resize-none transition-all"
              />

              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Response time: &lt; 1 hour
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-6 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#ef445b] hover:bg-[#d93a50] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  SEND MESSAGE
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}