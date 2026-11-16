"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Send, Loader2, MessageSquare } from "lucide-react";

export default function ProductChat({ 
  productId, 
  sellerId, 
  currentUserId,
  buyerId // <-- Add this prop (optional, will be filled when buyer opens chat)
}: { 
  productId: string; 
  sellerId: string; 
  currentUserId: string; 
  buyerId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  // Determine who the receiver is
  const receiverId = currentUserId === sellerId ? buyerId : sellerId;
  const isSeller = currentUserId === sellerId;

  useEffect(() => {
    if (!isOpen || !receiverId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("product_id", productId)
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase.channel("chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isOpen, productId, currentUserId, receiverId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !receiverId) return;
    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      product_id: productId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      content: message.trim(),
    });

    if (error) {
      toast.error("Failed to send message.");
    } else {
      setMessage("");
    }
    setLoading(false);
  };

  if (isSeller && !buyerId) return null; // If seller is on the product page, they need a buyer to chat with

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-medium py-3 rounded-lg transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          {isSeller ? "Chat with Buyer" : "Ask Seller a Question"}
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="bg-slate-100 dark:bg-slate-900 p-3 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-sm dark:text-white">In-App Chat</h3>
            <button onClick={() => setIsOpen(false)} className="text-xs text-red-500 hover:underline">Close</button>
          </div>
          
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-slate-400 mt-10">No messages yet. Say hello!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg p-2 text-sm ${
                    msg.sender_id === currentUserId 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-grow px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none dark:bg-slate-900 dark:text-white"
            />
            <button 
              type="submit" 
              disabled={loading || !message.trim()} 
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}