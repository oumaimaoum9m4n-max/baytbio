"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import customFetch from "@/utils/custom-fetch";
import type { CartItem } from "@/components/shared/CartContext";
import { CreateOrUpdateOrderSchema } from "@/features/orders/types/order.dto";
import type { CreateOrUpdateOrderDto } from "@/features/orders/types/order.dto";

export type CheckoutSuccessData = {
  orderId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
};

interface CheckoutFormProps {
  items: CartItem[];
  onSuccess: (data: CheckoutSuccessData) => void;
}

interface FieldErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  fullAddress?: string;
}

const inputBase =
  "h-[50px] px-4 border-[1.5px] rounded-[3px] font-sans text-[0.88rem] text-[#1C1208] bg-[#FAF6ED] transition-all duration-[250ms] outline-none w-full placeholder:text-[#A89070] focus:border-[#B85A28] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,90,40,0.08)]";

function fieldCls(hasError?: string) {
  return hasError
    ? `${inputBase} border-[#B85A28] bg-[rgba(240,224,212,0.3)]`
    : `${inputBase} border-[#EBD9B8]`;
}

const textareaBase =
  "px-4 py-3.5 border-[1.5px] rounded-[3px] font-sans text-[0.88rem] text-[#1C1208] bg-[#FAF6ED] leading-[1.6] transition-all duration-[250ms] outline-none w-full resize-none placeholder:text-[#A89070] focus:border-[#B85A28] focus:shadow-[0_0_0_3px_rgba(184,90,40,0.08)]";

function textareaCls(hasError?: string) {
  return hasError
    ? `${textareaBase} border-[#B85A28] bg-[rgba(240,224,212,0.3)]`
    : `${textareaBase} border-[#EBD9B8]`;
}

export default function CheckoutForm({ items, onSuccess }: CheckoutFormProps) {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");

  const mutation = useMutation({
    mutationFn: async (dto: CreateOrUpdateOrderDto) => {
      const res = await customFetch.post<{ msg: string; id: string }>(
        "/api/orders",
        dto,
      );
      return res.data;
    },
    onSuccess: (data) => {
      onSuccess({
        orderId: data.id,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        fullAddress: fullAddress.trim(),
      });
    },
    onError: (err: AxiosError<{ msg?: string }>) => {
      setApiError(
        err.response?.data?.msg ?? "Une erreur est survenue. Veuillez réessayer.",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const dto = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      fullAddress: fullAddress.trim(),
      status: "pending" as const,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    };

    const result = CreateOrUpdateOrderSchema.safeParse(dto);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate(result.data);
  };

  return (
    <div className="px-[72px] py-12 border-r border-[#EBD9B8] max-lg:border-r-0 max-md:px-6">
      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Coordonnées */}
        <div className="mb-9">
          <h2 className="font-cormorant text-[1.5rem] font-light text-[#1C1208] mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#EBD9B8] after:content-['']">
            <span className="w-7 h-7 rounded-full bg-terra-dark text-white flex items-center justify-center text-[0.7rem] font-medium flex-shrink-0">
              1
            </span>
            Vos coordonnées
          </h2>

          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] tracking-[0.14em] uppercase text-[#7A6648] font-normal">
                Nom complet <span className="text-[#B85A28]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Ahmed El Fassi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={fieldCls(errors.fullName)}
              />
              {errors.fullName && (
                <span className="text-[0.7rem] text-[#B85A28]">{errors.fullName}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] tracking-[0.14em] uppercase text-[#7A6648] font-normal">
                Téléphone <span className="text-[#B85A28]">*</span>
              </label>
              <input
                type="tel"
                placeholder="06 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={fieldCls(errors.phoneNumber)}
              />
              {errors.phoneNumber && (
                <span className="text-[0.7rem] text-[#B85A28]">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="mt-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.68rem] tracking-[0.14em] uppercase text-[#7A6648] font-normal">
                Email{" "}
                <span className="text-[0.65rem] text-[#A89070] tracking-normal normal-case font-light ml-1">
                  (optionnel)
                </span>
              </label>
              <input
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldCls(errors.email)}
              />
              {errors.email && (
                <span className="text-[0.7rem] text-[#B85A28]">{errors.email}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Adresse */}
        <div className="mb-9">
          <h2 className="font-cormorant text-[1.5rem] font-light text-[#1C1208] mb-5 flex items-center gap-3 after:flex-1 after:h-px after:bg-[#EBD9B8] after:content-['']">
            <span className="w-7 h-7 rounded-full bg-terra-dark text-white flex items-center justify-center text-[0.7rem] font-medium flex-shrink-0">
              2
            </span>
            Adresse de livraison
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] tracking-[0.14em] uppercase text-[#7A6648] font-normal">
              Adresse complète <span className="text-[#B85A28]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Numéro, rue, quartier, ville — Ex: 12 Rue Ibn Battouta, Maarif, Casablanca"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className={textareaCls(errors.fullAddress)}
            />
            {errors.fullAddress && (
              <span className="text-[0.7rem] text-[#B85A28]">{errors.fullAddress}</span>
            )}
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div className="mb-5 p-3 bg-[rgba(240,224,212,0.5)] border border-[#B85A28] rounded-[3px] text-[0.82rem] text-[#B85A28]">
            {apiError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full h-14 bg-terracotta text-[#F5EDD8] border-none font-sans text-[0.82rem] tracking-[0.14em] uppercase rounded-[3px] transition-all duration-300 flex items-center justify-center gap-2.5 hover:bg-terra-dark hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(184,90,40,0.35)] disabled:opacity-60 disabled:pointer-events-none"
        >
          {mutation.isPending ? (
            "Confirmation en cours…"
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Confirmer ma commande
            </>
          )}
        </button>
      </form>
    </div>
  );
}
