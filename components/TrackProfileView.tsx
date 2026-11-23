"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TrackProfileView({ 
  profileId, 
  currentUserId 
}: { 
  profileId: string, 
  currentUserId: string 
}) {
  useEffect(() => {
    const logView = async () => {
      // 1. Strict check: Make sure BOTH are actual strings and not empty
      if (
        typeof profileId !== 'string' || 
        profileId.trim() === '' || 
        typeof currentUserId !== 'string' || 
        currentUserId.trim() === ''
      ) {
        return; 
      }

      // 2. Don't log a view if the user is looking at their own profile
      if (profileId === currentUserId) return;

      const supabase = createClient();

      // 3. Use "upsert" (Insert or Update). 
      // If the user already viewed this profile, it just updates the date.
      const { error } = await supabase
        .from("profile_views")
        .upsert(
          { 
            viewer_id: currentUserId, 
            viewed_id: profileId,
            created_at: new Date().toISOString()
          },
          { 
            onConflict: 'viewer_id,viewed_id' // Tell it which columns to check for duplicates
          }
        );

      if (error) {
        console.error("Error logging view:", error.message);
      }
    };

    // Wait 1 second before trying, to let the page fully load
    const timer = setTimeout(() => {
      logView();
    }, 1000);

    return () => clearTimeout(timer);
  }, [profileId, currentUserId]);

  return null;
}