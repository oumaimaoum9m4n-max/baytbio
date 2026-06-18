"use client";

import { useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { Check } from "lucide-react";
import { WEEKDAYS, WEEKDAY_LABELS } from "../types/delivery";
import type {
  CreateOrUpdateDeliveryDayDto,
  GetAllDeliveryDaysDto,
} from "../types/delivery.dto";

type Props = {
  onSubmit: (data: CreateOrUpdateDeliveryDayDto) => void;
  isSubmitting: boolean;
  defaultValues?: GetAllDeliveryDaysDto;
  onCancel?: () => void;
  mode?: "create" | "update";
};

const SELECT_CLS = {
  trigger:
    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] data-[open=true]:border-[#2D5A3D] shadow-none",
  label:
    "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
  value: "text-[0.83rem] text-[#2C2C2C]",
};

const HOURS = Array.from({ length: 24 }, (_, h) => h);

const DeliveryDayForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  onCancel,
  mode = "create",
}: Props) => {
  const [deliveryDay, setDeliveryDay] = useState(
    defaultValues?.deliveryDay !== undefined
      ? String(defaultValues.deliveryDay)
      : "",
  );
  const [cutoffHour, setCutoffHour] = useState(
    defaultValues?.cutoffHour !== undefined
      ? String(defaultValues.cutoffHour)
      : "",
  );
  const [errors, setErrors] = useState<{
    deliveryDay?: string;
    cutoffHour?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (deliveryDay === "") next.deliveryDay = "Le jour de livraison est obligatoire";
    if (cutoffHour === "") next.cutoffHour = "L'heure limite est obligatoire";

    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({
      deliveryDay: Number(deliveryDay),
      cutoffHour: Number(cutoffHour),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="Jour de livraison"
        labelPlacement="outside"
        placeholder="Sélectionner un jour"
        size="sm"
        variant="bordered"
        selectedKeys={deliveryDay !== "" ? new Set([deliveryDay]) : new Set()}
        onSelectionChange={(keys) =>
          setDeliveryDay((Array.from(keys)[0] as string) ?? "")
        }
        isInvalid={!!errors.deliveryDay}
        errorMessage={errors.deliveryDay}
        classNames={SELECT_CLS}
      >
        {WEEKDAYS.map((wd) => (
          <SelectItem key={String(wd)}>{WEEKDAY_LABELS[wd]}</SelectItem>
        ))}
      </Select>

      <Select
        label="Heure limite (la veille)"
        labelPlacement="outside"
        placeholder="Sélectionner une heure"
        size="sm"
        variant="bordered"
        description="Dernière heure, la veille, pour commander pour ce jour."
        selectedKeys={cutoffHour !== "" ? new Set([cutoffHour]) : new Set()}
        onSelectionChange={(keys) =>
          setCutoffHour((Array.from(keys)[0] as string) ?? "")
        }
        isInvalid={!!errors.cutoffHour}
        errorMessage={errors.cutoffHour}
        classNames={SELECT_CLS}
      >
        {HOURS.map((h) => {
          const label = `${String(h).padStart(2, "0")}:00`;
          return (
            <SelectItem key={String(h)} textValue={label}>
              {label}
            </SelectItem>
          );
        })}
      </Select>

      <div className="flex items-center justify-end gap-2 pt-4 mt-1 border-t border-[#E8E4DC]">
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
          {mode === "update" ? "Enregistrer" : "Créer le jour"}
        </Button>
      </div>
    </form>
  );
};

export default DeliveryDayForm;
