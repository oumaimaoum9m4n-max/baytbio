"use client";

import { Avatar, Chip, Divider } from "@heroui/react";
import { Shield, Mail, CheckCircle2, XCircle } from "lucide-react";
import type { GetSingleUserDto } from "../types/user.dto";
import { USER_ROLE_LABELS } from "../types/user.dto";
import { USER_ROLE_STYLE } from "../utils/user.utils";
import formatDate from "@/utils/format-date";

type Props = { user: GetSingleUserDto };

const UserDetails = ({ user }: Props) => {
  const roleStyle = USER_ROLE_STYLE[user.role];
  const isVerified = !!user.emailVerified;

  return (
    <div
      className="flex flex-col gap-5"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* ── Header avec avatar ── */}
      <section className="flex items-center gap-4 pb-4 border-b border-[#E8E4DC]">
        <Avatar
          src={user.image || undefined}
          name={user.name?.charAt(0)?.toUpperCase() ?? "?"}
          className="w-16 h-16 text-[1.2rem] font-semibold shrink-0"
          style={{ background: "#E8F0E8", color: "#2D5A3D" }}
        />
        <div className="flex-1 min-w-0">
          <h2
            className="text-[1.3rem] font-normal text-[#2C2C2C] leading-tight mb-1"
            style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
          >
            {user.name || "Sans nom"}
          </h2>
          <p className="text-[0.78rem] text-[#888880] font-light truncate">
            {user.email}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Chip
              color={roleStyle.chipColor}
              variant="flat"
              size="sm"
              startContent={
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block ml-1"
                  style={{ background: roleStyle.dot }}
                />
              }
              classNames={{
                content: "text-[0.66rem] font-semibold px-1.5",
              }}
            >
              {USER_ROLE_LABELS[user.role]}
            </Chip>
          </div>
        </div>
      </section>

      {/* ── Identifiants ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Identifiants
        </p>
        <div className="flex flex-col">
          <DetailRow label="ID" value={user.id} mono />
          <DetailRow label="Nom" value={user.name || "—"} />
          <DetailRow label="Email" value={user.email || "—"} />
          <DetailRow label="Rôle" value={USER_ROLE_LABELS[user.role]} />
        </div>
      </section>

      {/* ── Permissions ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Permissions
        </p>
        <div className="flex items-start gap-3 bg-[#FAF8F5] rounded-md px-3.5 py-3 border border-[#E8E4DC]">
          <Shield
            size={18}
            className={`shrink-0 mt-0.5 ${
              user.role === "ADMIN" ? "text-[#2D5A3D]" : "text-[#888880]"
            }`}
          />
          <div>
            <p className="text-[0.8rem] font-semibold text-[#2C2C2C]">
              {USER_ROLE_LABELS[user.role]}
            </p>
            <p className="text-[0.7rem] text-[#888880] font-light leading-relaxed">
              {user.role === "ADMIN"
                ? "Accès complet au tableau de bord, à la gestion des produits, commandes et utilisateurs."
                : "Accès limité à la boutique et à son propre profil."}
            </p>
          </div>
        </div>
      </section>

      {/* ── Activité ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Activité
        </p>
        <div className="flex flex-col">
          <DetailRow
            label="Créé le"
            value={formatDate(user.createdAt, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <DetailRow
            label="Modifié le"
            value={formatDate(user.updatedAt, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </div>
      </section>
    </div>
  );
};

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-3 py-2 border-b border-[#E8E4DC] last:border-b-0">
      <span className="text-[0.74rem] text-[#888880] font-normal shrink-0">
        {label}
      </span>
      <span
        className={`text-[0.8rem] text-[#2C2C2C] font-medium text-right break-words max-w-[260px] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default UserDetails;
