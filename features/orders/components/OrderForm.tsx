"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Spinner } from "@heroui/react";
import { Check, Package, Minus, Plus, Wallet, Truck } from "lucide-react";

import { FormInput } from "@/components/ui";
import { useGetAllProducts } from "@/features/products/apis/getAllProducts";
import { useGetDeliveryOptions } from "@/features/delivery/apis/getDeliveryOptions";
import { useShowFormError } from "@/hooks/use-show-form-error";
import formatPrice from "@/utils/format-price";
import {
  CreateOrUpdateOrderSchema,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type CreateOrUpdateOrderDto,
  type GetSingleOrderDto,
} from "../types/order.dto";

type Props = {
  onSubmit: (data: CreateOrUpdateOrderDto) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<GetSingleOrderDto>;
  onCancel?: () => void;
  mode?: "create" | "update";
};

const OrderForm = ({
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateOrUpdateOrderDto>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateOrUpdateOrderSchema) as any,
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      phoneNumber: defaultValues?.phoneNumber ?? "",
      email: defaultValues?.email ?? "",
      fullAddress: defaultValues?.fullAddress ?? "",
      deliveryCity: defaultValues?.deliveryCity ?? "",
      deliveryFee: defaultValues?.deliveryFee ?? 0,
      deliveryDate: defaultValues?.deliveryDate ?? "",
      status: defaultValues?.status ?? "pending",
      items:
        defaultValues?.items?.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
        })) ?? [],
    },
  });

  useShowFormError(errors);

  const watchedItems = watch("items") ?? [];

  /* ── Products catalogue ── */
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllProducts(0, 100, "", "");
  const products = productsData?.data ?? [];

  const productsMap = useMemo(() => {
    const map = new Map<string, (typeof products)[number]>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  /* ── Delivery options (cities + selectable dates) ── */
  const { data: deliveryOptions, isLoading: isLoadingDelivery } =
    useGetDeliveryOptions();
  const cities = deliveryOptions?.cities ?? [];
  const watchedCity = watch("deliveryCity");
  const watchedDeliveryFee = watch("deliveryFee") ?? 0;

  const cityOptions = useMemo(
    () =>
      cities.map((c) => ({
        key: c.cityName,
        label: `${c.cityName} — ${c.deliveryTax} DH`,
      })),
    [cities],
  );

  // Existing order may carry a past delivery date no longer in the options.
  const dateOptions = useMemo(() => {
    const opts = (deliveryOptions?.deliveryDates ?? []).map((d) => ({
      key: d.date,
      label: d.label,
    }));
    const existing = defaultValues?.deliveryDate;
    if (existing && !opts.some((o) => o.key === existing)) {
      opts.unshift({ key: existing, label: existing });
    }
    return opts;
  }, [deliveryOptions, defaultValues?.deliveryDate]);

  // Keep the delivery fee in sync with the chosen city.
  useEffect(() => {
    const city = cities.find((c) => c.cityName === watchedCity);
    if (city && city.deliveryTax !== watchedDeliveryFee) {
      setValue("deliveryFee", city.deliveryTax, { shouldValidate: true });
    }
  }, [watchedCity, cities, watchedDeliveryFee, setValue]);

  const getQty = (productId: string) =>
    watchedItems.find((it) => it.productId === productId)?.quantity ?? 0;

  const setQty = (productId: string, qty: number) => {
    const current = watchedItems;
    const idx = current.findIndex((it) => it.productId === productId);
    if (qty <= 0) {
      if (idx >= 0)
        setValue(
          "items",
          current.filter((_, i) => i !== idx),
          { shouldValidate: true },
        );
      return;
    }
    if (idx >= 0) {
      const next = [...current];
      next[idx] = { productId, quantity: qty };
      setValue("items", next, { shouldValidate: true });
    } else {
      setValue("items", [...current, { productId, quantity: qty }], {
        shouldValidate: true,
      });
    }
  };

  /* ── Summary ── */
  const subtotal = watchedItems.reduce((sum, it) => {
    const p = productsMap.get(it.productId);
    return sum + (p?.price ?? 0) * it.quantity;
  }, 0);

  /* ── Submit ── */
  const handleFormSubmit = (data: CreateOrUpdateOrderDto) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-0"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── LEFT — Client + delivery info ── */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC]">
            Informations client
          </div>

          <FormInput
            control={control}
            name="fullName"
            label="Nom complet *"
            placeholder="Ahmed El Fassi"
          />

          <FormInput
            control={control}
            name="phoneNumber"
            label="Téléphone *"
            placeholder="06 XX XX XX XX"
          />

          <FormInput
            control={control}
            name="email"
            label="Email (optionnel)"
            placeholder="ahmed@example.com"
          />

          <FormInput
            control={control}
            name="fullAddress"
            type="textarea"
            label="Adresse complète *"
            placeholder="Rue, numéro, quartier, ville…"
            minRows={2}
          />

          {isEdit && (
            <FormInput
              control={control}
              name="status"
              type="select"
              label="Statut"
              options={ORDER_STATUSES.map((s) => ({
                key: s,
                label: ORDER_STATUS_LABELS[s],
              }))}
            />
          )}

          {/* ── Livraison ── */}
          <div className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mt-2 flex items-center gap-1.5">
            <Truck size={12} /> Livraison
          </div>

          {isLoadingDelivery ? (
            <div className="flex items-center justify-center py-3">
              <Spinner size="sm" color="primary" />
            </div>
          ) : cities.length === 0 ? (
            <p className="text-[0.75rem] text-[#C44B3C] font-light">
              Aucune ville de livraison configurée.
            </p>
          ) : (
            <FormInput
              control={control}
              name="deliveryCity"
              type="select"
              label="Ville de livraison *"
              placeholder="Sélectionner une ville"
              options={cityOptions}
            />
          )}

          {!isLoadingDelivery &&
            (dateOptions.length === 0 ? (
              <p className="text-[0.75rem] text-[#C44B3C] font-light">
                Aucune date de livraison disponible pour le moment.
              </p>
            ) : (
              <FormInput
                control={control}
                name="deliveryDate"
                type="select"
                label="Date de livraison *"
                placeholder="Sélectionner une date"
                options={dateOptions}
              />
            ))}
        </div>

        {/* ── RIGHT — Products + summary ── */}
        <div className="flex flex-col gap-3.5">
          <div className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC]">
            Produits en stock
          </div>

          <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
            {isLoadingProducts ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" color="primary" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-[0.78rem] text-[#888880] font-light text-center py-6">
                Aucun produit disponible
              </p>
            ) : (
              products.map((p) => {
                const qty = getQty(p.id);
                const isSelected = qty > 0;
                const stock = p.stock ?? 0;
                const stockColor =
                  stock <= 15
                    ? "text-[#C44B3C]"
                    : stock <= 35
                      ? "text-[#D4883C]"
                      : "text-[#888880]";

                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-2.5 border rounded-md transition-all ${
                      isSelected
                        ? "border-[#2D5A3D] bg-[#E8F0E8]"
                        : "border-[#E8E4DC] bg-white hover:border-[#2D5A3D] hover:bg-[#F2F7F2]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-md overflow-hidden border border-[#E8E4DC] bg-[#FAF8F5] flex items-center justify-center shrink-0">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={14} className="text-[#C8C8C0]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.81rem] font-medium text-[#2C2C2C] truncate">
                        {p.name}
                      </p>
                      <p className={`text-[0.65rem] font-light ${stockColor}`}>
                        Stock: {stock}
                      </p>
                    </div>
                    <p className="text-[0.78rem] font-mono text-[#555550] shrink-0">
                      {formatPrice(p.price, false)}
                    </p>
                    <div className="flex items-center border border-[#E8E4DC] rounded-md overflow-hidden bg-white shrink-0">
                      <button
                        type="button"
                        onClick={() => setQty(p.id, Math.max(0, qty - 1))}
                        className="w-7 h-7 flex items-center justify-center text-[#555550] hover:bg-[#E8F0E8] hover:text-[#2D5A3D] transition-colors"
                        aria-label="Diminuer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center font-mono text-[0.78rem] font-semibold text-[#2C2C2C]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(p.id, qty + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#555550] hover:bg-[#E8F0E8] hover:text-[#2D5A3D] transition-colors"
                        aria-label="Augmenter"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mt-1">
            Récapitulatif
          </div>

          <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-md p-3.5 flex flex-col gap-2">
            <div className="flex justify-between text-[0.78rem]">
              <span className="text-[#888880] font-light">Articles</span>
              <span className="text-[#2C2C2C] font-medium">
                {watchedItems.reduce((s, it) => s + it.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between text-[0.78rem]">
              <span className="text-[#888880] font-light">Sous-total</span>
              <span className="text-[#2C2C2C] font-medium font-mono">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[0.78rem]">
              <span className="text-[#888880] font-light">Livraison</span>
              <span className="text-[#2C2C2C] font-medium font-mono">
                {formatPrice(watchedDeliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-[#E8E4DC]">
              <span className="text-[0.72rem] tracking-[0.1em] uppercase text-[#888880] font-semibold">
                Total
              </span>
              <span
                className="text-[1.5rem] font-normal text-[#2C2C2C]"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                {formatPrice(subtotal + watchedDeliveryFee)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-[#E8F0E8] rounded-md px-3 py-2.5">
            <Wallet size={14} className="text-[#2D5A3D] shrink-0" />
            <span className="text-[0.74rem] text-[#2D5A3D] font-medium">
              Paiement en espèces à la livraison
            </span>
          </div>
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
          {isEdit ? "Enregistrer" : "Créer la commande"}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
