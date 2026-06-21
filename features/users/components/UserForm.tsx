"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { Check, User as UserIcon, Lock, Mail } from "lucide-react";

import { FormInput } from "@/components/ui";
import { useShowFormError } from "@/hooks/use-show-form-error";
import {
  CreateOrUpdateUserSchema,
  type CreateOrUpdateUserDto,
  type GetSingleUserDto,
} from "../types/user.dto";

type Props = {
  onSubmit: (data: CreateOrUpdateUserDto) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<GetSingleUserDto>;
  onCancel?: () => void;
  mode?: "create" | "update";
};

const UserForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  onCancel,
  mode = "create",
}: Props) => {
  const isEdit = mode === "update";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrUpdateUserDto>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateOrUpdateUserSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      password: "",
      role: defaultValues?.role ?? "ADMIN",
      image: defaultValues?.image ?? "",
    },
  });

  useShowFormError(errors);

  const handleFormSubmit = (data: CreateOrUpdateUserDto) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-0"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="flex flex-col gap-4">
        {/* ── Section: Identité ── */}
        <div>
          <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
            <UserIcon size={12} />
            <span>Identité</span>
          </div>

          <div className="flex flex-col gap-3.5">
            <FormInput
              control={control}
              name="name"
              label="Nom complet *"
              placeholder="Ahmed El Fassi"
            />

            <FormInput
              control={control}
              name="email"
              label="Email *"
              placeholder="ahmed@example.com"
              autoComplete="email"
              props={{
                startContent: (
                  <Mail
                    size={13}
                    className="text-[#888880] pointer-events-none"
                  />
                ),
              }}
            />

            <FormInput
              control={control}
              name="image"
              label="URL de l'avatar (optionnel)"
              placeholder="https://…"
            />
          </div>
        </div>

        {/* ── Section: Sécurité ── */}
        <div>
          <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
            <Lock size={12} />
            <span>Sécurité</span>
          </div>

          <FormInput
            control={control}
            name="password"
            label={
              isEdit
                ? "Mot de passe (laisser vide pour conserver)"
                : "Mot de passe *"
            }
            placeholder={isEdit ? "••••••••" : "Min. 6 caractères"}
            autoComplete="new-password"
            props={{
              type: "password",
              startContent: (
                <Lock
                  size={13}
                  className="text-[#888880] pointer-events-none"
                />
              ),
              className: "mt-3",
            }}
          />
        </div>

      </div>

      {/* ── Footer actions ── */}
      <div className="flex items-center justify-end gap-2 pt-5 mt-5 border-t border-[#E8E4DC]">
        {onCancel && (
          <Button
            type="button"
            variant="bordered"
            size="sm"
            onPress={onCancel}
            isDisabled={isSubmitting}
            className="border-[#E8E4DC] text-[#555550] h-9 text-[0.81rem]"
          >
            Annuler
          </Button>
        )}
        <Button
          type="submit"
          color="primary"
          size="sm"
          isLoading={isSubmitting}
          startContent={!isSubmitting ? <Check size={13} /> : undefined}
          className="h-9 text-[0.81rem] px-5"
        >
          {isEdit ? "Enregistrer" : "Créer l'utilisateur"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
