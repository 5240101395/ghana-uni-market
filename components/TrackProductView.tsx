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
      // 1. If either ID is missing, do nothing.
      if (!profileId || !currentUserId) return;

      // 2. Don't log a view if the user is looking at their own profile
      if (profileId === currentUserId) return;

      const supabase = createClient();

      // 3. Check if a view already exists
      const { data: existingView } = await supabase
        .from("profile_views")
        .select("*")
        .eq("viewer_id", currentUserId)
        .eq("viewed_id", profileId)
        .single();

      if (existingView) {
        // Update timestamp so they move to the top of the list
        await supabase
          .from("profile_views")
          .update({ created_at: new Date().toISOString() })
          .eq("id", existingView.id);
      } else {
        // Insert a new row
        const { error } = await supabase.from("profile_views").insert({
          viewer_id: currentUserId,
          viewed_id: profileId,
        });

        if (error) {
          console.error("Error logging view:", error.message);
        }
      }
    };

    logView();
  }, [profileId, currentUserId]);

  return null;
}