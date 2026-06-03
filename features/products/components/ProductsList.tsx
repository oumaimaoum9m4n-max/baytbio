"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Button, Chip, Select, SelectItem, Spinner } from "@heroui/react";
import {
  ArrowUpDown,
  Package,
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DataTable,
  TableActions,
  toast,
  Modal,
  useDisclosure,
  type Column,
} from "@/components/ui";
import { useGetAllProducts } from "../apis/getAllProducts";
import { useGetSingleProduct } from "../apis/getSingleProduct";
import ProductPreview from "./ProductPreview";
import type { GetAllProductsDto } from "../types/product.dto";
import formatPrice from "@/utils/format-price";
import formatDate from "@/utils/format-date";

const SORT_OPTIONS = [
  { key: "", label: "Trier par défaut" },
  { key: "name_asc", label: "Nom A→Z" },
  { key: "name_desc", label: "Nom Z→A" },
  { key: "price_asc", label: "Prix croissant" },
  { key: "price_desc", label: "Prix décroissant" },
  { key: "stock_asc", label: "Stock croissant" },
  { key: "stock_desc", label: "Stock décroissant" },
  { key: "createdAt_desc", label: "Plus récent" },
  { key: "createdAt_asc", label: "Plus ancien" },
];

const STATUS_MAP = {
  enabled: { label: "Actif", color: "success" as const },
  disabled: { label: "Inactif", color: "default" as const },
};

const ProductsList = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
    sort: "",
  });
  const [debouncedSearch] = useDebounce(filters.searchQuery, 500);
  const [preview, setPreview] = useState<{ id: string; name: string } | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading } = useGetAllProducts(
    filters.page - 1,
    filters.pageSize,
    debouncedSearch,
    filters.sort,
  );
  const { data: productDetails, isLoading: isLoadingDetails } =
    useGetSingleProduct(preview?.id ?? "");

  const changeFilters = (name: keyof typeof filters, value: number | string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  const columns = useMemo<Column<GetAllProductsDto>[]>(
    () => [
      {
        key: "name",
        label: "PRODUIT",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            {row.images[0] ? (
              <img
                src={row.images[0]}
                alt={row.name}
                className="w-9 h-9 rounded-lg object-cover border border-[#E8E4DC] shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-[#F2F7F2] border border-[#E8E4DC] flex items-center justify-center shrink-0">
                <Package size={16} className="text-[#888880]" />
              </div>
            )}
            <div>
              <p className="text-[0.83rem] font-medium text-[#2C2C2C]">
                {row.name}
              </p>
              <p className="text-[0.7rem] text-[#888880]">{row.unit}</p>
            </div>
          </div>
        ),
      },
      {
        key: "price",
        label: "PRIX",
        render: (v) => (
          <span className="font-mono text-[0.83rem] text-[#2C2C2C]">
            {formatPrice(v as number)}
          </span>
        ),
      },
      {
        key: "stock",
        label: "STOCK",
        render: (v, row) => {
          const stock = v as number;
          const isLow = row.alertThreshold > 0 && stock <= row.alertThreshold;
          return (
            <span className="flex items-center gap-1">
              <span
                className={`text-[0.83rem] font-medium ${isLow ? "text-[#C44B3C]" : "text-[#2C2C2C]"}`}
              >
                {stock}
              </span>
              {isLow && <AlertTriangle size={13} className="text-[#C44B3C]" />}
            </span>
          );
        },
      },
      {
        key: "status",
        label: "STATUT",
        render: (v) => {
          const s =
            STATUS_MAP[v as keyof typeof STATUS_MAP] ?? STATUS_MAP.disabled;
          return (
            <Chip
              color={s.color}
              variant="flat"
              size="sm"
              classNames={{ content: "text-[0.65rem] font-semibold px-1.5" }}
            >
              {s.label}
            </Chip>
          );
        },
      },
      {
        key: "createdAt",
        label: "DATE",
        render: (v) => (
          <span className="text-[0.78rem] text-[#555550]">
            {formatDate(v as string)}
          </span>
        ),
      },
      {
        key: "actions",
        label: "",
        render: (_, row) => (
          <TableActions
            actions={[
              {
                template: "view",
                onAction: () => {
                  setPreview({ id: row.id, name: row.name });
                  onOpen();
                },
              },
              {
                template: "update",
                onAction: () =>
                  router.push(`/dashboard/products/${row.id}/update-product`),
              },
              {
                template: "delete",
                onAction: () =>
                  toast.warning({
                    title: "Supprimer",
                    description: `${row.name} — action simulée`,
                  }),
              },
            ]}
          />
        ),
      },
    ],
    [router, onOpen],
  );

  return (
    <>
      <DataTable
        label="Produits Ferme Beldi"
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        showRowCount
        search={{
          value: filters.searchQuery,
          onChange: (v) => changeFilters("searchQuery", v),
        }}
        withPagination={{
          page: filters.page,
          pageSize: filters.pageSize,
          numOfPages: data?.totalPages ?? 1,
          total: data?.totalItems,
          onPageChange: (page) => changeFilters("page", page),
          onPageSizeChange: (size) => changeFilters("pageSize", size),
        }}
        topActions={
          <Select
            size="sm"
            variant="bordered"
            selectedKeys={new Set([filters.sort])}
            onSelectionChange={(keys) => {
              const val = (Array.from(keys)[0] as string) ?? "";
              changeFilters("sort", val);
              changeFilters("page", 1);
            }}
            startContent={<ArrowUpDown size={13} className="text-[#888880]" />}
            aria-label="Trier"
            classNames={{
              trigger:
                "bg-[#FAF8F5] border-[#E8E4DC] h-9 min-w-[170px] text-[0.81rem]",
              value: "text-[0.81rem] text-[#555550]",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.key}>{o.label}</SelectItem>
            ))}
          </Select>
        }
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={productDetails?.name ?? preview?.name ?? "Détails du produit"}
        subtitle={preview?.id}
        isDrawer
        // scrollBehavior="inside"
        footer={
          <div className="flex items-center gap-2 w-full">
            <Button
              className="flex-1 bg-[#2D5A3D] text-white text-[0.82rem] font-medium h-9"
              onPress={() => {
                onClose();
                router.push(
                  `/dashboard/products/${preview?.id}/update-product`,
                );
              }}
              startContent={<Pencil size={13} />}
            >
              Modifier
            </Button>
            <Button
              variant="light"
              color="danger"
              className="text-[0.82rem] font-medium h-9"
              onPress={() =>
                toast.warning({
                  title: "Supprimer",
                  description: `${preview?.name} — action simulée`,
                })
              }
              startContent={<Trash2 size={13} />}
            >
              Supprimer
            </Button>
          </div>
        }
      >
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : productDetails ? (
          <ProductPreview product={productDetails} />
        ) : null}
      </Modal>
    </>
  );
};

export default ProductsList;
