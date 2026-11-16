"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TrackProfileView({ viewedId }: { viewedId: string }) {
  const supabase = createClient();

  useEffect(() => {
    const logView = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id === viewedId) return;

      // First, remove any old view from this user so we don't get a duplicate error
      await supabase
        .from("profile_views")
        .delete()
        .eq("viewer_id", user.id)
        .eq("viewed_id", viewedId);

      // Then insert a fresh view
      const { error } = await supabase
        .from("profile_views")
        .insert({ viewer_id: user.id, viewed_id: viewedId });

      if (error) {
        console.error("Error logging view:", error.message);
      } else {
        console.log("Profile view logged successfully!");
      }
    };

    logView();
  }, [viewedId, supabase]);

  return null;
}