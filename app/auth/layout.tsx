import "../heroui.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Baytbio",
  description: "Sign in to your Baytbio account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {children}
    </div>
  );
}
