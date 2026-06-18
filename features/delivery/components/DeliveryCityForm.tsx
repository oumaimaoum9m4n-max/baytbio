"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Check } from "lucide-react";
import { MOROCCAN_CITIES } from "../constants/moroccan-cities";
import type {
  CreateOrUpdateDeliveryCityDto,
  GetAllDeliveryCitiesDto,
} from "../types/delivery.dto";

type Props = {
  onSubmit: (data: CreateOrUpdateDeliveryCityDto) => void;
  isSubmitting: boolean;
  defaultValues?: GetAllDeliveryCitiesDto;
  onCancel?: () => void;
  mode?: "create" | "update";
};

const FIELD_CLS = {
  inputWrapper:
    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] shadow-none",
  trigger:
    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] data-[open=true]:border-[#2D5A3D] shadow-none",
  label:
    "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
  input: "text-[0.83rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]",
  value: "text-[0.83rem] text-[#2C2C2C]",
};

const DeliveryCityForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  onCancel,
  mode = "create",
}: Props) => {
  const [cityName, setCityName] = useState(defaultValues?.cityName ?? "");
  const [deliveryTax, setDeliveryTax] = useState(
    defaultValues ? String(defaultValues.deliveryTax) : "",
  );
  const [errors, setErrors] = useState<{
    cityName?: string;
    deliveryTax?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const tax = Number(deliveryTax);
    if (!cityName.trim()) next.cityName = "La ville est obligatoire";
    if (deliveryTax === "" || Number.isNaN(tax) || tax < 0)
      next.deliveryTax = "Frais de livraison invalides";

    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({ cityName: cityName.trim(), deliveryTax: tax });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="Ville"
        labelPlacement="outside"
        placeholder="Sélectionner une ville"
        size="sm"
        variant="bordered"
        selectedKeys={cityName ? new Set([cityName]) : new Set()}
        onSelectionChange={(keys) => {
          setCityName((Array.from(keys)[0] as string) ?? "");
        }}
        isInvalid={!!errors.cityName}
        errorMessage={errors.cityName}
        classNames={FIELD_CLS}
      >
        {MOROCCAN_CITIES.map((city) => (
          <SelectItem key={city}>{city}</SelectItem>
        ))}
      </Select>

      <Input
        label="Frais de livraison (DH)"
        labelPlacement="outside"
        placeholder="Ex: 20"
        type="number"
        min={0}
        size="sm"
        variant="bordered"
        value={deliveryTax}
        onValueChange={setDeliveryTax}
        isInvalid={!!errors.deliveryTax}
        errorMessage={errors.deliveryTax}
        classNames={FIELD_CLS}
      />

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
          {mode === "update" ? "Enregistrer" : "Créer la ville"}
        </Button>
      </div>
    </form>
  );
};

export default DeliveryCityForm;
