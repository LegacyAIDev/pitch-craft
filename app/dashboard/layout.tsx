import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | PitchCraft",
  description: "Create proposals from discovery calls and Fireflies recordings.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-beige/20">
      {children}
    </div>
  );
}
