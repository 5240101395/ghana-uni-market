"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Camera, Loader2, User } from "lucide-react";

export default function AvatarUploader({ 
  userId, 
  currentAvatarUrl 
}: { 
  userId: string, 
  currentAvatarUrl: string | null 
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (uploadError) {
      alert("Error uploading avatar: " + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // 3. Save to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      alert("Error saving profile picture: " + updateError.message);
    } else {
      router.refresh();
    }
    
    setUploading(false);
  };

  return (
    <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg flex-shrink-0">
      {currentAvatarUrl ? (
        <img 
          src={currentAvatarUrl} 
          alt="Profile" 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
          <User className="w-10 h-10" />
        </div>
      )}

      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
        {uploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <>
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Change</span>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          className="sr-only" 
          disabled={uploading}
        />
      </label>
    </div>
  );
}