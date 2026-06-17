"use client";

import "../heroui.css";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, ShieldCheck } from "lucide-react";

import { toast } from "@/components/ui";
import LoginForm from "@/features/auth/components/LoginForm";
import type { LoginDto } from "@/features/auth/types/auth.dto";

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get("reason") !== "forbidden") return;

    signOut({ redirect: false }).then(() => {
      toast.error({
        title: "Accès refusé",
        description:
          "Ce compte n'a pas les droits d'accès au tableau de bord.",
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (data: LoginDto) => {
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res || res.error) {
        toast.error({
          title: "Connexion échouée",
          description: res?.error ?? "Vérifiez vos identifiants",
        });

        return;
      }

      const session = await getSession();

      if (session?.user?.role !== "ADMIN") {
        await signOut({ redirect: false });

        toast.error({
          title: "Accès refusé",
          description:
            "Le rôle utilisateur n'est pas autorisé à accéder au tableau de bord.",
        });

        return;
      }

      toast.success({
        title: "Connexion réussie",
        description: "Bienvenue dans le tableau de bord",
      });

      router.push(callbackUrl);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoSrc = "/images/logo/logo_baytbio.png";

  return (
    <div
      className="min-h-screen bg-cream flex items-center justify-center p-4"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
      

          <Image
            src={logoSrc}
            alt="BaytBio"
            width={170}
            height={70}
            priority
            className="object-contain"
          />

          <p className="text-[0.78rem] text-[#888880] mt-1 tracking-wide">
            Espace administrateur
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E4DC] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-6">
            <ShieldCheck size={12} />
            <span>Connexion sécurisée</span>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <p className="text-center text-[0.72rem] text-[#888880] mt-6">
          Accès réservé aux administrateurs. Les utilisateurs standards seront
          redirigés.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}