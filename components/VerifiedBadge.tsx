import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
      <BadgeCheck className="w-3 h-3" />
      <span>Verified Student</span>
    </div>
  );
}