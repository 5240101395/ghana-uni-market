import SupportWidget from "@/components/SupportWidget";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative transition-colors">
      {children}
      <SupportWidget />
    </div>
  );
}