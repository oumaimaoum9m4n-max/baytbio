"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Chip, Spinner } from "@heroui/react";
import Link from "next/link";
import {
  Plus,
  X,
  Info,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Camera,
  ClipboardList,
  Package,
  Truck,
  Settings,
  Lightbulb,
  Check,
  AlertTriangle,
  Link2,
  Search,
  Loader2,
} from "lucide-react";

import { FormInput, toast } from "@/components/ui";
import { useSidebarContext } from "@/components/sidebar-context";
import {
  CreateOrUpdateProductSchema,
  type CreateOrUpdateProductDto,
  type GetSingleProductDto,
} from "../types/product.dto";
import formatPrice from "@/utils/format-price";
import uploadFile from "@/utils/upload-file";
import { useGetAllProducts } from "../apis/getAllProducts";
import type { RelatedProduct } from "../types/product";
import { useShowFormError } from "@/hooks/use-show-form-error";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type ImageItem =
  | { status: "uploading"; preview: string }
  | { status: "done"; url: string; preview: string };

type Props = {
  onSubmit: (data: CreateOrUpdateProductDto) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<GetSingleProductDto>;
  pageHeader?: React.ReactNode;
};

/* ══════════════════════════════════════════
   SUB — FormSection
══════════════════════════════════════════ */
function FormSection({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  counter,
  overflowVisible,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  counter?: string;
  overflowVisible?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white border border-[#E8E4DC] rounded-xl shadow-sm mb-4 ${overflowVisible ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[0.88rem] font-semibold text-[#2C2C2C]">{title}</p>
          <p className="text-[0.72rem] text-[#888880] font-light mt-0.5">
            {subtitle}
          </p>
        </div>
        {counter && (
          <p className="text-[0.72rem] text-[#888880] flex-shrink-0">
            {counter}
          </p>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ProductForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  pageHeader,
}: Props) => {
  const { isCollapsed } = useSidebarContext();
  const sidebarW = isCollapsed ? 64 : 240;
  const isEdit = !!defaultValues;

  /* ── Images state ── */
  const [images, setImages] = useState<ImageItem[]>(
    (defaultValues?.images ?? []).map((url) => ({
      status: "done",
      url,
      preview: url,
    })),
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── RHF ── */
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateOrUpdateProductDto>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateOrUpdateProductSchema) as any,
    defaultValues: {
      name: defaultValues?.name ?? "",
      nameAr: defaultValues?.nameAr ?? "",
      price: defaultValues?.price,
      stock: defaultValues?.stock ?? 0,
      description: defaultValues?.description ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      images: defaultValues?.images ?? [],
      tags: defaultValues?.tags ?? [],
      unit: defaultValues?.unit ?? "",
      alertThreshold: defaultValues?.alertThreshold ?? 0,
      status: defaultValues?.status ?? "enabled",
      deliveryTax: defaultValues?.deliveryTax,
      relatedProducts: defaultValues?.relatedProducts ?? [],
    },
  });

  useShowFormError(errors);

  const watchedName = watch("name");
  const watchedPrice = watch("price");
  const watchedUnit = watch("unit");
  const watchedStatus = watch("status");
  const watchedTags = watch("tags") ?? [];

  /* ── Keep RHF "images" field in sync with local upload state ── */
  useEffect(() => {
    const urls = images
      .filter((i): i is Extract<ImageItem, { status: "done" }> => i.status === "done")
      .map((i) => i.url);
    setValue("images", urls);
  }, [images, setValue]);

  /* ── Image helpers ── */
  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const remaining = 6 - images.length;
      if (remaining <= 0) return;
      const toAdd = Array.from(files).slice(0, remaining);

      const placeholders: ImageItem[] = toAdd.map((f) => ({
        status: "uploading",
        preview: URL.createObjectURL(f),
      }));
      setImages((prev) => [...prev, ...placeholders]);

      await Promise.all(
        toAdd.map(async (file, idx) => {
          try {
            const url = await uploadFile(file, "products");
            setImages((prev) => {
              const next = [...prev];
              const targetIdx = prev.length - toAdd.length + idx;
              next[targetIdx] = { status: "done", url, preview: url };
              return next;
            });
          } catch {
            toast.error({
              title: "Échec du téléchargement",
              description: file.name,
            });
            setImages((prev) =>
              prev.filter((_, i) => i !== prev.length - toAdd.length + idx),
            );
          }
        }),
      );
    },
    [images.length],
  );

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const reorderImages = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const setMainImage = (i: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(i, 1);
      return [moved, ...next];
    });
    toast.success({ title: "Image principale définie" });
  };

  /* ── Tag helpers ── */
  const [tagInput, setTagInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || watchedTags.includes(tag)) return;
    setValue("tags", [...watchedTags, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setValue(
      "tags",
      watchedTags.filter((t) => t !== tag),
    );

  /* ── Related products ── */
  const [relatedSearch, setRelatedSearch] = useState("");
  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);
  const relatedDropdownRef = useRef<HTMLDivElement>(null);

  const watchedRelatedProducts = (watch("relatedProducts") ??
    []) as RelatedProduct[];

  const { data: relatedSearchData, isFetching: isSearchingProducts } =
    useGetAllProducts(0, 8, relatedSearch, "");

  const addRelatedProduct = (product: RelatedProduct) => {
    if (watchedRelatedProducts.some((p) => p.id === product.id)) return;
    setValue("relatedProducts", [...watchedRelatedProducts, product]);
    setRelatedSearch("");
    setShowRelatedDropdown(false);
  };

  const removeRelatedProduct = (id: string) =>
    setValue(
      "relatedProducts",
      watchedRelatedProducts.filter((p) => p.id !== id),
    );

  const relatedSearchResults = (relatedSearchData?.data ?? []).filter(
    (p: { id: string }) =>
      p.id !== defaultValues?.id &&
      !watchedRelatedProducts.some((r) => r.id === p.id),
  );

  /* ── Submit ── */
  const handleFormSubmit = (data: CreateOrUpdateProductDto) => {
    const uploading = images.some((i) => i.status === "uploading");
    if (uploading) {
      toast.warning({
        title: "Images en cours",
        description: "Attendez la fin du téléchargement des images.",
      });
      return;
    }
    const urls = images
      .filter(
        (i): i is Extract<ImageItem, { status: "done" }> => i.status === "done",
      )
      .map((i) => i.url);
    onSubmit({ ...data, images: urls });
  };

  /* ── Drag & drop ── */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const mainPreview =
    images.find((i) => i.status === "done")?.preview ?? images[0]?.preview;
  const anyUploading = images.some((i) => i.status === "uploading");

  return (
    <div className="bg-[#FAF8F5]" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* ── 2-column layout ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_340px]"
          style={{
            minHeight: "calc(100vh - 60px)",
          }}
        >
          {/* ════ LEFT COLUMN ════ */}
          <div className="lg:pr-6 lg:border-r border-[#E8E4DC] pb-28">
            {pageHeader && <div className="mb-7">{pageHeader}</div>}

            {/* ─── Section: Images ─── */}
            <FormSection
              icon={<Camera size={17} />}
              iconBg="#FEF3E8"
              iconColor="#D4883C"
              title="Images du produit"
              subtitle="Glissez-déposez jusqu'à 6 images · La première sera l'image principale"
              counter={`${images.length} / 6 images`}
            >
              {images.length < 6 && (
                <div
                  className={`border-2 border-dashed rounded-xl p-9 text-center cursor-pointer transition-all duration-200 ${
                    isDragOver
                      ? "border-[#2D5A3D] bg-[#E8F0E8] scale-[1.01]"
                      : "border-[#D8D4CC] bg-[#FAF8F5] hover:border-[#2D5A3D] hover:bg-[#F2F7F2]"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                  />
                  <div className="w-14 h-14 rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex items-center justify-center mx-auto mb-3.5">
                    <ImageIcon size={22} className="text-[#888880]" />
                  </div>
                  <p className="text-[0.88rem] font-semibold text-[#2C2C2C] mb-1">
                    Glissez vos images ici ou{" "}
                    <span className="text-[#2D5A3D]">parcourez</span>
                  </p>
                  <p className="text-[0.74rem] text-[#888880] font-light leading-relaxed">
                    JPG, PNG, WebP · Max 5 MB par image · Jusqu'à 6 images
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-3.5">
                    {["JPG", "PNG", "WEBP", "≤ 5 MB"].map((f) => (
                      <Chip
                        key={f}
                        size="sm"
                        variant="bordered"
                        classNames={{
                          base: "h-[20px] border-[#E8E4DC]",
                          content:
                            "text-[0.6rem] font-semibold uppercase tracking-wide text-[#888880] px-1",
                        }}
                      >
                        {f}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-4">
                  {images.map((item, i) => (
                    <div
                      key={item.preview}
                      draggable
                      className={`relative rounded-lg overflow-hidden border-2 aspect-square group cursor-grab active:cursor-grabbing transition-all duration-150 ${
                        draggingIndex === i
                          ? "opacity-40 border-dashed border-[#D8D4CC]"
                          : dragOverIndex === i
                            ? "border-[#D4883C] scale-[1.03]"
                            : i === 0
                              ? "border-[#2D5A3D]"
                              : "border-[#E8E4DC]"
                      }`}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        setDraggingIndex(i);
                      }}
                      onDragEnd={() => {
                        setDraggingIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggingIndex !== null && draggingIndex !== i) {
                          setDragOverIndex(i);
                        }
                      }}
                      onDragLeave={() => setDragOverIndex(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggingIndex !== null && draggingIndex !== i) {
                          reorderImages(draggingIndex, i);
                          setDraggingIndex(null);
                          setDragOverIndex(null);
                        }
                      }}
                    >
                      <img
                        src={item.preview}
                        alt=""
                        className="w-full h-full object-cover pointer-events-none"
                      />
                      {item.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Spinner size="sm" color="white" />
                        </div>
                      )}
                      {i === 0 && item.status === "done" && (
                        <Chip
                          size="sm"
                          color="success"
                          variant="solid"
                          className="absolute top-1.5 left-1.5 z-10 h-[18px]"
                          classNames={{
                            content:
                              "text-[0.52rem] font-bold uppercase tracking-wide px-1",
                          }}
                        >
                          Principale
                        </Chip>
                      )}
                      {item.status === "done" && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                          {i > 0 && (
                            <Button
                              isIconOnly
                              size="sm"
                              color="success"
                              variant="solid"
                              onPress={() => setMainImage(i)}
                              className="w-7 h-7 min-w-7"
                              title="Définir comme principale"
                            >
                              <Check size={13} />
                            </Button>
                          )}
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="solid"
                            onPress={() => removeImage(i)}
                            className="w-7 h-7 min-w-7"
                          >
                            <X size={13} />
                          </Button>
                        </div>
                      )}
                      <span className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white text-[0.6rem] font-bold flex items-center justify-center z-10">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <label className="border-2 border-dashed border-[#D8D4CC] rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer aspect-square hover:border-[#2D5A3D] hover:bg-[#F2F7F2] transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && addFiles(e.target.files)
                        }
                      />
                      <Plus size={18} className="text-[#C8C8C0]" />
                      <span className="text-[0.65rem] text-[#888880] font-medium">
                        Ajouter
                      </span>
                    </label>
                  )}
                </div>
              )}

              {images.length > 0 && (
                <div className="flex items-start gap-2.5 p-3 bg-[#E8F0F8] rounded-lg border border-[#3A6B9E]/10 mt-3">
                  <Info
                    size={14}
                    className="text-[#3A6B9E] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-[0.73rem] text-[#3A6B9E] font-light leading-relaxed">
                    <strong className="font-semibold">
                      Image principale :
                    </strong>{" "}
                    la première est affichée en priorité. Glissez pour
                    réorganiser ou cliquez{" "}
                    <Check size={11} className="inline" /> pour définir une
                    image comme principale.
                  </p>
                </div>
              )}
            </FormSection>

            {/* ─── Section: Informations générales ─── */}
            <FormSection
              icon={<ClipboardList size={17} />}
              iconBg="#E8F0E8"
              iconColor="#2D5A3D"
              title="Informations générales"
              subtitle="Nom, unité, prix et descriptions du produit"
            >
              <div className="flex flex-col gap-3.5">
                <div className="grid grid-cols-2 gap-3.5">
                  <FormInput
                    control={control}
                    name="name"
                    label="Nom du produit"
                    placeholder="Ex: Plateau d'Œufs Fermiers Beldi"
                  />
                  <FormInput
                    control={control}
                    name="nameAr"
                    label="Nom en arabe"
                    placeholder="Ex: بيض بلدي طازج"
                    props={{ dir: "rtl" }}
                  />
                </div>

                <FormInput
                  control={control}
                  name="unit"
                  label="Unité / Contenance"
                  placeholder="Ex: plateau de 15, 1 litre…"
                />

                <FormInput
                  control={control}
                  name="price"
                  type="number"
                  label="Prix (DH)"
                  placeholder="25"
                  props={{
                    endContent: (
                      <span className="text-[0.78rem] text-[#888880] font-medium pointer-events-none">
                        DH
                      </span>
                    ),
                  }}
                />

                <FormInput
                  control={control}
                  name="shortDescription"
                  type="textarea"
                  label="Description courte"
                  placeholder="Description affichée sous le nom du produit sur la boutique…"
                  minRows={2}
                />

                <FormInput
                  control={control}
                  name="description"
                  type="textarea"
                  label="Description longue"
                  placeholder="Détails complets, processus de fabrication, conseils d'utilisation…"
                  minRows={4}
                />

                {/* Tags */}
                <div>
                  <label className="block text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550] mb-1.5">
                    Mots-clés / Tags
                  </label>
                  <div
                    className="min-h-[42px] px-2 py-1 border border-[#E8E4DC] rounded-lg bg-[#FAF8F5] flex flex-wrap items-center gap-1 cursor-text hover:border-[#2D5A3D] transition-colors focus-within:border-[#2D5A3D]"
                    onClick={() => document.getElementById("tagInput")?.focus()}
                  >
                    {watchedTags.map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClose={() => removeTag(tag)}
                        classNames={{
                          content: "text-[0.72rem] font-medium px-1",
                          closeButton:
                            "text-primary-400 hover:text-primary-700",
                        }}
                      >
                        {tag}
                      </Chip>
                    ))}
                    <input
                      id="tagInput"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                        if (
                          e.key === "Backspace" &&
                          !tagInput &&
                          watchedTags.length
                        ) {
                          removeTag(watchedTags[watchedTags.length - 1]);
                        }
                      }}
                      placeholder={
                        watchedTags.length === 0
                          ? "Tapez un tag et appuyez sur Entrée…"
                          : ""
                      }
                      className="border-none bg-transparent outline-none text-[0.82rem] text-[#2C2C2C] min-w-[120px] h-7 px-1 placeholder:text-[#C8C8C0]"
                    />
                  </div>
                  <p className="text-[0.7rem] text-[#888880] mt-1 font-light">
                    Entrée ou virgule pour ajouter · Retour arrière pour
                    supprimer
                  </p>
                </div>
              </div>
            </FormSection>

            {/* ─── Section: Stock & Alertes ─── */}
            <FormSection
              icon={<Package size={17} />}
              iconBg="#F5EDE0"
              iconColor="#C9960C"
              title="Stock & Alertes"
              subtitle="Quantités disponibles et seuil d'alerte automatique"
            >
              <div className="grid grid-cols-2 gap-3.5">
                <FormInput
                  control={control}
                  name="stock"
                  type="number"
                  label="Stock actuel"
                  placeholder="0"
                />
                <FormInput
                  control={control}
                  name="alertThreshold"
                  type="number"
                  label="Seuil d'alerte"
                  placeholder="20"
                />
              </div>
              <p className="text-[0.7rem] text-[#888880] mt-2 font-light">
                Une alerte sera déclenchée quand le stock passe sous le seuil
                défini.
              </p>
            </FormSection>

            {/* ─── Section: Livraison ─── */}
            <FormSection
              icon={<Truck size={17} />}
              iconBg="#E8F0F8"
              iconColor="#3A6B9E"
              title="Livraison"
              subtitle="Frais de livraison"
            >
              <div className="flex flex-col gap-3.5">
                <FormInput
                  control={control}
                  name="deliveryTax"
                  type="number"
                  label="Frais de livraison (DH)"
                  placeholder="20"
                  props={{
                    endContent: (
                      <span className="text-[0.78rem] text-[#888880] font-medium pointer-events-none">
                        DH
                      </span>
                    ),
                  }}
                />
              </div>
            </FormSection>

            {/* ─── Section: Produits associés ─── */}
            <FormSection
              icon={<Link2 size={17} />}
              iconBg="#EEE8F8"
              iconColor="#7C5CBF"
              title="Produits associés"
              subtitle="Suggérez d'autres produits complémentaires ou similaires"
              counter={`${watchedRelatedProducts.length} produit${watchedRelatedProducts.length !== 1 ? "s" : ""}`}
              overflowVisible
            >
              {/* Search input */}
              <div className="relative" ref={relatedDropdownRef}>
                <div className="flex items-center gap-2 px-3 h-10 border border-[#E8E4DC] rounded-lg bg-[#FAF8F5] focus-within:border-[#7C5CBF] transition-colors">
                  {isSearchingProducts ? (
                    <Loader2
                      size={15}
                      className="text-[#888880] shrink-0 animate-spin"
                    />
                  ) : (
                    <Search size={15} className="text-[#888880] shrink-0" />
                  )}
                  <input
                    type="text"
                    value={relatedSearch}
                    onChange={(e) => {
                      setRelatedSearch(e.target.value);
                      setShowRelatedDropdown(true);
                    }}
                    onFocus={() => setShowRelatedDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowRelatedDropdown(false), 150)
                    }
                    placeholder="Rechercher un produit à associer…"
                    className="flex-1 bg-transparent outline-none text-[0.82rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]"
                  />
                </div>

                {/* Dropdown results */}
                {showRelatedDropdown && (
                  <div className="absolute z-30 top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#E8E4DC] rounded-xl shadow-lg overflow-hidden">
                    {relatedSearchResults.length === 0 ? (
                      <p className="text-[0.78rem] text-[#888880] text-center py-4 font-light">
                        {isSearchingProducts
                          ? "Recherche…"
                          : relatedSearch
                            ? "Aucun produit trouvé"
                            : "Tapez pour rechercher un produit"}
                      </p>
                    ) : (
                      <ul className="max-h-52 overflow-y-auto divide-y divide-[#F0EDE8]">
                        {relatedSearchResults.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onMouseDown={() =>
                                addRelatedProduct({
                                  id: p.id,
                                  name: p.name,
                                  mainImage: p.images?.[0] ?? "",
                                })
                              }
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F2F7F2] transition-colors text-left"
                            >
                              <div className="w-9 h-9 rounded-lg border border-[#E8E4DC] overflow-hidden shrink-0 bg-[#FAF8F5] flex items-center justify-center">
                                {p.images?.[0] ? (
                                  <img
                                    src={p.images[0]}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package
                                    size={14}
                                    className="text-[#C8C8C0]"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[0.8rem] font-medium text-[#2C2C2C] truncate">
                                  {p.name}
                                </p>
                                <p className="text-[0.68rem] text-[#888880] font-light">
                                  {p.unit} · {formatPrice(p.price)}
                                </p>
                              </div>
                              <Plus
                                size={14}
                                className="text-[#7C5CBF] shrink-0"
                              />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Selected related products */}
              {watchedRelatedProducts.length > 0 && (
                <ul className="mt-3.5 flex flex-col gap-2">
                  {watchedRelatedProducts.map((rp) => (
                    <li
                      key={rp.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg group"
                    >
                      <div className="w-9 h-9 rounded-lg border border-[#E8E4DC] overflow-hidden shrink-0 bg-white flex items-center justify-center">
                        {rp.mainImage ? (
                          <img
                            src={rp.mainImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={14} className="text-[#C8C8C0]" />
                        )}
                      </div>
                      <p className="flex-1 text-[0.82rem] font-medium text-[#2C2C2C] truncate">
                        {rp.name}
                      </p>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => removeRelatedProduct(rp.id)}
                        className="w-7 h-7 min-w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Retirer ce produit associé"
                      >
                        <X size={13} />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {watchedRelatedProducts.length === 0 && (
                <p className="text-[0.73rem] text-[#888880] font-light mt-3 text-center py-3 border border-dashed border-[#D8D4CC] rounded-lg">
                  Aucun produit associé — utilisez la recherche ci-dessus pour
                  en ajouter.
                </p>
              )}
            </FormSection>

            {/* ─── Section: Statut de publication ─── */}
            <FormSection
              icon={<Settings size={17} />}
              iconBg="#FAF8F5"
              iconColor="#555550"
              title="Statut de publication"
              subtitle="Définissez la visibilité du produit sur la boutique"
            >
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    {
                      value: "enabled",
                      label: "Actif",
                      sub: "Visible sur la boutique",
                    },
                    {
                      value: "disabled",
                      label: "Inactif",
                      sub: "Masqué sans suppression",
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("status", opt.value)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                      watchedStatus === opt.value
                        ? "border-[#2D5A3D] bg-[#E8F0E8]"
                        : "border-[#E8E4DC] bg-white hover:border-[#2D5A3D] hover:bg-[#F2F7F2]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          watchedStatus === opt.value
                            ? "border-[#2D5A3D]"
                            : "border-[#D8D4CC]"
                        }`}
                      >
                        {watchedStatus === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-[#2D5A3D]" />
                        )}
                      </div>
                      <p className="text-[0.8rem] font-medium text-[#2C2C2C]">
                        {opt.label}
                      </p>
                    </div>
                    <p className="text-[0.68rem] text-[#888880] font-light pl-6">
                      {opt.sub}
                    </p>
                  </button>
                ))}
              </div>
            </FormSection>
          </div>

          {/* ════ RIGHT COLUMN — sticky on desktop, stacked on mobile ════ */}
          <div
            className="py-5 lg:p-5 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] lg:overflow-y-auto flex flex-col gap-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Live preview */}
            <div>
              <p className="text-[0.68rem] tracking-[0.12em] uppercase text-[#888880] font-semibold mb-2">
                Aperçu
              </p>
              <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
                <div className="h-40 bg-[#FAF8F5] flex items-center justify-center relative border-b border-[#E8E4DC] overflow-hidden">
                  {mainPreview ? (
                    <img
                      src={mainPreview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={40} className="text-[#C8C8C0]" />
                  )}
                  {watchedStatus === "enabled" && (
                    <Chip
                      size="sm"
                      color="success"
                      variant="solid"
                      className="absolute top-2.5 left-2.5"
                      classNames={{
                        content:
                          "text-[0.6rem] font-semibold uppercase tracking-wide px-0.5",
                      }}
                    >
                      Actif
                    </Chip>
                  )}
                </div>
                <div className="p-3.5">
                  <p
                    className="text-[0.9rem] font-normal text-[#2C2C2C] leading-snug mb-1"
                    style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
                  >
                    {watchedName || (
                      <span className="text-[#C8C8C0]">Nom du produit</span>
                    )}
                  </p>
                  <p className="text-[0.72rem] text-[#888880] mb-2.5">
                    {watchedUnit || (
                      <span className="text-[#C8C8C0]">Unité</span>
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[1.05rem] font-semibold text-[#2C2C2C]"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {watchedPrice ? formatPrice(watchedPrice) : "— DH"}
                    </span>
                    {/* <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      className="h-7 text-[0.72rem] cursor-default pointer-events-none"
                    >
                      Ajouter
                    </Button> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-[#E8E4DC] flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#FEF3E8] flex items-center justify-center text-[#D4883C]">
                  <Lightbulb size={14} />
                </div>
                <p className="text-[0.82rem] font-semibold text-[#2C2C2C]">
                  Conseils de rédaction
                </p>
              </div>
              <div className="p-3.5 flex flex-col gap-2.5">
                {[
                  {
                    warn: false,
                    text: "Nommez le produit de façon claire et descriptive",
                  },
                  {
                    warn: false,
                    text: "La première image est la plus importante — fond neutre, lumière naturelle",
                  },
                  {
                    warn: false,
                    text: "Mentionnez l'heure de récolte — votre argument fraîcheur le plus fort",
                  },
                  {
                    warn: true,
                    text: "Évitez les descriptions génériques — chaque produit Beldi a une histoire",
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-[0.75rem] text-[#555550] font-light leading-relaxed"
                  >
                    {tip.warn ? (
                      <AlertTriangle
                        size={13}
                        className="shrink-0 mt-px text-[#D4883C]"
                      />
                    ) : (
                      <Check
                        size={13}
                        className="shrink-0 mt-px text-[#2D5A3D]"
                      />
                    )}
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky action bar ── */}
        <div
          className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-w)] bg-white/95 backdrop-blur-md border-t border-[#E8E4DC] px-4 md:px-7 py-3.5 flex items-center justify-between gap-3 z-50 transition-[left] duration-300"
          style={{ ["--sidebar-w"]: `${sidebarW}px` } as React.CSSProperties}
        >
          <div className="flex items-center gap-2 text-[0.76rem] text-[#888880] min-w-0">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                anyUploading
                  ? "bg-[#D4883C] animate-pulse"
                  : images.length > 0
                    ? "bg-[#2D5A3D]"
                    : "bg-[#C8C8C0] animate-pulse"
              }`}
            />
            <span className="truncate">
              {anyUploading
                ? "Téléchargement des images…"
                : images.length > 0
                  ? "Formulaire prêt"
                  : "En cours de rédaction…"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              as={Link}
              href="/dashboard/products"
              variant="bordered"
              size="sm"
              className="border-[#E8E4DC] text-[#555550] h-9 text-[0.81rem]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              color="primary"
              size="sm"
              isLoading={isSubmitting}
              startContent={!isSubmitting ? <Save size={13} /> : undefined}
              className="h-9 text-[0.81rem] px-5"
            >
              {isEdit ? "Enregistrer les modifications" : "Publier le produit"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
