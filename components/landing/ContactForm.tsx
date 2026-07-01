
"use client";

// components/landing/ContactForm.tsx

import { useState, useRef } from "react";
import Reveal from "./Reveal";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxMIwQ04r42JFDlwvjSfTEMsTmGo13Leh069YPmIKyoSjTtEI0DRn-edwtN2QSJapot/exec";

type FormDataType = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactFormInner() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    setStatus("sending");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error("Erreur");
    }

    setStatus("sent");

    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });

    formRef.current?.reset();

  } catch (error) {
    console.error(error);
    setStatus("error");
  }
}



  const inputClass =
    "w-full bg-white/[0.04] border border-[rgba(160,139,114,0.12)] px-[14px] py-3 font-sans text-[0.85rem] text-cream font-light placeholder:text-cream/30 focus:outline-none focus:border-terracotta/50 transition-colors duration-200";

  if (status === "sent") {
    return (
      <div className="py-16 px-8 flex flex-col gap-5 items-start bg-white/[0.03]">
        <span className="text-3xl">✉️</span>

        <h3
          className="font-cormorant text-cream font-light"
          style={{ fontSize: "2rem" }}
        >
          Message envoyé.
        </h3>

        <p className="font-sans text-[0.85rem] text-sand font-light leading-[1.85] max-w-[340px]">
          Merci de nous avoir contactés. Nous vous répondrons dans la prochaine
          heure.
        </p>

        <button
          onClick={() => setStatus("idle")}
          className="mt-4 font-sans text-[0.75rem] tracking-[0.12em] uppercase text-terracotta border-b border-terracotta/40 pb-0.5 hover:border-terracotta transition-colors duration-200 bg-transparent cursor-pointer"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2
          className="font-cormorant text-cream font-light leading-[0.95]"
          style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}
        >
          Formulaire de{" "}
          <em className="italic text-terra-light">contact</em>
        </h2>
      </div>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        {/* Name + Phone */}
        <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
              Nom complet *
            </label>

            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
              Téléphone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Votre numéro de téléphone"
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[6px] mt-[2px]">
          <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
            Adresse e-mail *
          </label>

          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Votre adresse e-mail"
            className={inputClass}
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-[6px] mt-[2px]">
          <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
            Sujet
          </label>

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Objet de votre demande"
            className={inputClass}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-[6px] mt-[2px] mb-6">
          <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
            Message *
          </label>

          <textarea
            required
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Écrivez votre message..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-6 flex-wrap">
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-8 py-[14px] bg-terracotta text-cream font-sans text-[0.72rem] tracking-[0.12em] uppercase border-none transition-all duration-300 hover:bg-terra-light hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(184,90,40,.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === "sending"
              ? "Envoi..."
              : "Envoyer le message"}
          </button>
        </div>

        {status === "error" && (
          <p className="font-sans text-[0.76rem] text-red-400 font-light mt-3">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </form>
    </>
  );
}

export default function ContactForm() {
  return (
    <section
      id="contact-form"
      className="bg-[#1A1210] px-[72px] py-24 max-md:px-6 max-md:py-14 border-t border-white/[0.04]"
    >
      <div className="max-w-[680px] mx-auto">
        <Reveal>
          <ContactFormInner />
        </Reveal>
      </div>
    </section>
  );
}
