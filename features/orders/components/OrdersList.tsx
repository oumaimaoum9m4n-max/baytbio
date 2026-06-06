"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Button,
  Chip,
  Select,
  SelectItem,
  Spinner,
  DateRangePicker,
} from "@heroui/react";
import { parseDate } from "@internationalized/date";
import {
  ArrowUpDown,
  ClipboardList,
  Clock,
  CheckCircle2,
  Home,
  XCircle,
  Check,
  Pencil,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  DataTable,
  TableActions,
  Modal,
  ConfirmDialog,
  PageHeader,
  useDisclosure,
  type Column,
} from "@/components/ui";

import { useGetAllOrders } from "../apis/getAllOrders";
import { useGetSingleOrder } from "../apis/getSingleOrder";
import { useCreateOrder } from "../apis/createOrder";
import { useUpdateOrder } from "../apis/updateOrder";
import { useUpdateOrderStatus } from "../apis/updateOrderStatus";
import OrderForm from "./OrderForm";
import OrderDetails from "./OrderDetails";
import {
  ORDER_STATUS_LABELS,
  ORDER_SORT_OPTIONS,
  type GetAllOrdersDto,
  type CreateOrUpdateOrderDto,
} from "../types/order.dto";
import { ORDER_STATUS_STYLE } from "../utils/order.utils";
import type { OrderStatus } from "../types/order";
import formatPrice from "@/utils/format-price";
import formatDate from "@/utils/format-date";

/* ══════════════════════════════════════════
   DATE HELPERS
══════════════════════════════════════════ */
const toISODate = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultDateRange = () => {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return { startDate: toISODate(oneMonthAgo), endDate: toISODate(today) };
};

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
const OrdersList = () => {
  const defaultRange = useMemo(getDefaultDateRange, []);

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
    status: "",
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
    sort: "default",
  });
  const [debouncedSearch] = useDebounce(filters.searchQuery, 500);

  /* ── Modals & drawers ── */
  const createModal = useDisclosure();
  const updateModal = useDisclosure();
  const detailsDrawer = useDisclosure();
  const confirmDialog = useDisclosure();

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    fullName: string;
    status: OrderStatus;
  } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Queries ── */
  const { data, isLoading } = useGetAllOrders({
    page: filters.page - 1,
    size: filters.pageSize,
    search: debouncedSearch,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
    sort: filters.sort,
  });

  const { data: orderDetails, isLoading: isLoadingDetails } = useGetSingleOrder(
    activeOrderId ?? "",
  );

  /* ── Mutations ── */
  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder();
  const { mutateAsync: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateOrderStatus();

  /* ── Helpers ── */
  const changeFilters = (name: keyof typeof filters, value: number | string) =>
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "page" ? { page: 1 } : {}),
    }));

  const resetFilters = () =>
    setFilters({
      page: 1,
      pageSize: filters.pageSize,
      searchQuery: "",
      status: "",
      startDate: defaultRange.startDate,
      endDate: defaultRange.endDate,
      sort: "default",
    });

  const handleViewDetails = (id: string) => {
    setActiveOrderId(id);
    detailsDrawer.onOpen();
  };

  const handleOpenUpdate = (id: string) => {
    setActiveOrderId(id);
    updateModal.onOpen();
  };

  const handleQuickStatus = (
    id: string,
    fullName: string,
    nextStatus: OrderStatus,
  ) => {
    setConfirmAction({ id, fullName, status: nextStatus });
    confirmDialog.onOpen();
  };

  const handleConfirmStatus = async () => {
    if (!confirmAction) return;
    await updateStatus({ id: confirmAction.id, status: confirmAction.status });
    setConfirmAction(null);
  };

  const handleCreateSubmit = async (formData: CreateOrUpdateOrderDto) => {
    await createOrder(formData);
    createModal.onClose();
  };

  const handleUpdateSubmit = async (formData: CreateOrUpdateOrderDto) => {
    if (!activeOrderId) return;
    await updateOrder({ ...formData, id: activeOrderId });
    updateModal.onClose();
    setActiveOrderId(null);
  };

  const kpis = data?.kpis ?? {
    total: 0,
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
  };

  const activeFiltersCount =
    (filters.status !== "" ? 1 : 0) +
    (filters.startDate !== defaultRange.startDate || filters.endDate !== defaultRange.endDate ? 1 : 0);

  /* ── Columns ── */
  const columns = useMemo<Column<GetAllOrdersDto>[]>(
    () => [
      {
        key: "id",
        label: "N° COMMANDE",
        render: (v) => (
          <span className="font-mono text-[0.72rem] text-[#2D5A3D] font-medium">
            {v as string}
          </span>
        ),
      },
      {
        key: "fullName",
        label: "CLIENT",
        render: (_, row) => (
          <div>
            <p className="text-[0.82rem] font-medium text-[#2C2C2C]">
              {row.fullName}
            </p>
            <p className="text-[0.68rem] text-[#888880] font-mono mt-0.5">
              {row.phoneNumber}
            </p>
          </div>
        ),
      },
      {
        key: "items",
        label: "PRODUITS",
        render: (_, row) => {
          const summary = row.items
            .map((it) => `${it.name.split(" ")[0]} ×${it.quantity}`)
            .join(", ");
          return (
            <p
              className="text-[0.72rem] text-[#555550] font-light max-w-[220px] truncate"
              title={summary}
            >
              {summary || "—"}
            </p>
          );
        },
      },
      {
        key: "total",
        label: "MONTANT",
        render: (v) => (
          <span className="font-mono font-semibold text-[0.83rem] text-[#2C2C2C]">
            {formatPrice(v as number)}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "DATE",
        render: (v) => {
          const d = new Date(v as string);
          return (
            <div>
              <p className="text-[0.75rem] text-[#555550]">{formatDate(d)}</p>
              <p className="text-[0.66rem] text-[#C8C8C0] font-mono mt-0.5">
                {d.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        },
      },
      {
        key: "status",
        label: "STATUT",
        render: (v) => {
          const s = v as OrderStatus;
          const style = ORDER_STATUS_STYLE[s];
          return (
            <Chip
              color={style.chipColor}
              variant="flat"
              size="sm"
              startContent={
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block ml-1"
                  style={{ background: style.dot }}
                />
              }
              classNames={{
                content: "text-[0.66rem] font-semibold px-1.5",
              }}
            >
              {ORDER_STATUS_LABELS[s]}
            </Chip>
          );
        },
      },
      {
        key: "actions",
        label: "",
        render: (_, row) => {
          const canConfirm = row.status === "pending";
          const canCancel =
            row.status === "pending" || row.status === "confirmed";

          const actions = [];

          if (canConfirm) {
            actions.push({
              template: "standard" as const,
              label: "Confirmer",
              icon: <Check size={14} />,
              color: "success" as const,
              onAction: () =>
                handleQuickStatus(row.id, row.fullName, "confirmed"),
            });
          }

          actions.push({
            template: "view" as const,
            onAction: () => handleViewDetails(row.id),
          });

          actions.push({
            template: "update" as const,
            onAction: () => handleOpenUpdate(row.id),
          });

          if (canCancel) {
            actions.push({
              template: "standard" as const,
              label: "Annuler la commande",
              icon: <XCircle size={14} />,
              color: "danger" as const,
              onAction: () =>
                handleQuickStatus(row.id, row.fullName, "cancelled"),
            });
          }

          return <TableActions actions={actions} />;
        },
      },
    ],
    [],
  );

  const todayLabel = useMemo(
    () =>
      formatDate(new Date(), {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-5">
      {/* Page header with the create modal trigger */}
      <PageHeader
        title="Commandes"
        description={
          data
            ? `${kpis.total} commande${kpis.total !== 1 ? "s" : ""} · ${kpis.pending} en attente · ${todayLabel}`
            : "Chargement…"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Commandes" },
        ]}
        actions={
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={13} />}
            className="h-9 text-[0.81rem]"
            onPress={createModal.onOpen}
          >
            Nouvelle commande
          </Button>
        }
      />

      {/* KPI strip */}
      <KpiStrip
        kpis={kpis}
        activeStatus={filters.status}
        onSelect={(s) => changeFilters("status", s)}
      />

      {/* Table with inline filters in the toolbar */}
      <DataTable
        label="Commandes"
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        showRowCount
        search={{
          value: filters.searchQuery,
          onChange: (v) => changeFilters("searchQuery", v),
        }}
        toolbarEnd={
          <>
            {/* Desktop: filters inline */}
            <div className="hidden md:flex items-center gap-2">
              <Select
                size="sm"
                variant="bordered"
                aria-label="Statut"
                selectedKeys={new Set([filters.status])}
                onSelectionChange={(keys) => {
                  const v = (Array.from(keys)[0] as string) ?? "";
                  changeFilters("status", v);
                }}
                classNames={{
                  base: "w-[140px]",
                  trigger:
                    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                  value: "text-[0.8rem] text-[#555550]",
                }}
              >
                <SelectItem key="">Tous statuts</SelectItem>
                <SelectItem key="pending">En attente</SelectItem>
                <SelectItem key="confirmed">Confirmée</SelectItem>
                <SelectItem key="delivered">Livrée</SelectItem>
                <SelectItem key="cancelled">Annulée</SelectItem>
              </Select>

              <DateRangePicker
                size="sm"
                variant="bordered"
                aria-label="Plage de dates"
                visibleMonths={2}
                value={
                  (filters.startDate && filters.endDate
                    ? {
                        start: parseDate(filters.startDate),
                        end: parseDate(filters.endDate),
                      }
                    : null) as never
                }
                onChange={(range: unknown) => {
                  const r = range as {
                    start: { toString(): string };
                    end: { toString(): string };
                  } | null;
                  if (!r) {
                    setFilters((prev) => ({
                      ...prev,
                      startDate: "",
                      endDate: "",
                      page: 1,
                    }));
                    return;
                  }
                  setFilters((prev) => ({
                    ...prev,
                    startDate: r.start.toString(),
                    endDate: r.end.toString(),
                    page: 1,
                  }));
                }}
                classNames={{
                  base: "w-[260px]",
                  inputWrapper:
                    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                  input: "text-[0.78rem] text-[#555550]",
                }}
              />

              <Button
                size="sm"
                variant="light"
                onPress={resetFilters}
                startContent={<RotateCcw size={12} />}
                className="h-9 text-[0.78rem] text-[#555550] hover:text-[#2C2C2C]"
              >
                Réinit.
              </Button>
            </div>

            {/* Mobile: single filter button */}
            <Button
              size="sm"
              variant="bordered"
              onPress={() => setFiltersOpen(true)}
              className="flex md:hidden h-9 border-[#E8E4DC] text-[#555550] hover:border-[#2D5A3D] items-center gap-1.5"
            >
              <SlidersHorizontal size={13} />
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-[#2D5A3D] text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </>
        }
        topActions={
          <div className="hidden md:block">
            <Select
              size="sm"
              variant="bordered"
              aria-label="Trier"
              selectedKeys={new Set([filters.sort])}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) ?? "default";
                changeFilters("sort", v);
              }}
              startContent={<ArrowUpDown size={12} className="text-[#888880]" />}
              classNames={{
                base: "w-[230px]",
                trigger:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                value: "text-[0.8rem] text-[#555550]",
              }}
            >
              {ORDER_SORT_OPTIONS.map((o) => (
                <SelectItem key={o.key}>{o.label}</SelectItem>
              ))}
            </Select>
          </div>
        }
        withPagination={{
          page: filters.page,
          pageSize: filters.pageSize,
          numOfPages: data?.totalPages ?? 1,
          total: data?.totalItems,
          onPageChange: (page) => changeFilters("page", page),
          onPageSizeChange: (size) => changeFilters("pageSize", size),
        }}
      />

      {/* ── Create modal ── */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Nouvelle commande"
        subtitle="Créer une commande manuellement (paiement à la livraison)"
        size="3xl"
      >
        <OrderForm
          mode="create"
          onSubmit={handleCreateSubmit}
          isSubmitting={isCreating}
          onCancel={createModal.onClose}
        />
      </Modal>

      {/* ── Update modal ── */}
      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.onClose();
          setActiveOrderId(null);
        }}
        title={
          orderDetails ? `Modifier ${orderDetails.id}` : "Modifier la commande"
        }
        subtitle={orderDetails?.fullName}
        size="3xl"
      >
        {isLoadingDetails || !orderDetails ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <OrderForm
            mode="update"
            defaultValues={orderDetails}
            onSubmit={handleUpdateSubmit}
            isSubmitting={isUpdating}
            onCancel={() => {
              updateModal.onClose();
              setActiveOrderId(null);
            }}
          />
        )}
      </Modal>

      {/* ── Details drawer ── */}
      <Modal
        isOpen={detailsDrawer.isOpen}
        onClose={() => {
          detailsDrawer.onClose();
          setActiveOrderId(null);
        }}
        title={orderDetails?.id ?? "Détails"}
        subtitle={
          orderDetails
            ? `${orderDetails.fullName} · ${formatDate(orderDetails.createdAt, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : undefined
        }
        isDrawer
        footer={
          orderDetails ? (
            <div className="flex flex-wrap items-center gap-2 w-full">
              {orderDetails.status === "pending" && (
                <Button
                  size="sm"
                  color="success"
                  variant="solid"
                  className="text-[0.81rem] font-medium h-9"
                  onPress={() => {
                    detailsDrawer.onClose();
                    handleQuickStatus(
                      orderDetails.id,
                      orderDetails.fullName,
                      "confirmed",
                    );
                  }}
                  startContent={<Check size={13} />}
                >
                  Confirmer
                </Button>
              )}
              {orderDetails.status === "confirmed" && (
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  className="text-[0.81rem] font-medium h-9"
                  onPress={() => {
                    detailsDrawer.onClose();
                    handleQuickStatus(
                      orderDetails.id,
                      orderDetails.fullName,
                      "delivered",
                    );
                  }}
                  startContent={<Home size={13} />}
                >
                  Marquer livrée
                </Button>
              )}
              <Button
                size="sm"
                variant="bordered"
                className="border-[#E8E4DC] text-[#555550] text-[0.81rem] font-medium h-9"
                onPress={() => {
                  detailsDrawer.onClose();
                  handleOpenUpdate(orderDetails.id);
                }}
                startContent={<Pencil size={13} />}
              >
                Modifier
              </Button>
              {(orderDetails.status === "pending" ||
                orderDetails.status === "confirmed") && (
                <Button
                  size="sm"
                  variant="light"
                  color="danger"
                  className="text-[0.81rem] font-medium h-9"
                  onPress={() => {
                    detailsDrawer.onClose();
                    handleQuickStatus(
                      orderDetails.id,
                      orderDetails.fullName,
                      "cancelled",
                    );
                  }}
                  startContent={<XCircle size={13} />}
                >
                  Annuler
                </Button>
              )}
            </div>
          ) : null
        }
      >
        {isLoadingDetails || !orderDetails ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <OrderDetails order={orderDetails} />
        )}
      </Modal>

      {/* ── Quick action confirm dialog ── */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => {
          confirmDialog.onClose();
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmStatus}
        variant={
          confirmAction?.status === "cancelled"
            ? "danger"
            : confirmAction?.status === "delivered"
              ? "success"
              : "info"
        }
        title={
          confirmAction?.status === "confirmed"
            ? `Confirmer ${confirmAction.id} ?`
            : confirmAction?.status === "delivered"
              ? `Marquer ${confirmAction.id} comme livrée ?`
              : confirmAction?.status === "cancelled"
                ? `Annuler ${confirmAction.id} ?`
                : "Confirmer l'action"
        }
        description={
          confirmAction
            ? `La commande de ${confirmAction.fullName} passera au statut ${
                ORDER_STATUS_LABELS[confirmAction.status]
              }.`
            : ""
        }
        confirmLabel={
          confirmAction?.status === "cancelled"
            ? "Annuler la commande"
            : "Confirmer"
        }
        isLoading={isUpdatingStatus}
      />

      {/* ── Mobile filter sidebar backdrop ── */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/20 md:hidden"
          onClick={() => setFiltersOpen(false)}
        />
      )}

      {/* ── Mobile filter sidebar panel ── */}
      <div
        className={`fixed inset-y-0 right-0 z-[310] w-[300px] bg-white shadow-xl flex flex-col md:hidden transition-transform duration-300 ease-[cubic-bezier(.25,.46,.45,.94)] ${
          filtersOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E4DC]">
          <h3 className="text-[0.88rem] font-semibold text-[#2C2C2C]">Filtres &amp; Tri</h3>
          <button
            onClick={() => setFiltersOpen(false)}
            className="p-1.5 rounded-md text-[#888880] hover:text-[#2C2C2C] hover:bg-[#F5F2EC] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[0.72rem] font-semibold text-[#555550] uppercase tracking-[0.08em]">
              Tri
            </label>
            <Select
              size="sm"
              variant="bordered"
              aria-label="Trier"
              selectedKeys={new Set([filters.sort])}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) ?? "default";
                changeFilters("sort", v);
              }}
              startContent={<ArrowUpDown size={12} className="text-[#888880]" />}
              classNames={{
                trigger:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                value: "text-[0.8rem] text-[#555550]",
              }}
            >
              {ORDER_SORT_OPTIONS.map((o) => (
                <SelectItem key={o.key}>{o.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.72rem] font-semibold text-[#555550] uppercase tracking-[0.08em]">
              Statut
            </label>
            <Select
              size="sm"
              variant="bordered"
              aria-label="Statut"
              selectedKeys={new Set([filters.status])}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) ?? "";
                changeFilters("status", v);
              }}
              classNames={{
                trigger:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                value: "text-[0.8rem] text-[#555550]",
              }}
            >
              <SelectItem key="">Tous statuts</SelectItem>
              <SelectItem key="pending">En attente</SelectItem>
              <SelectItem key="confirmed">Confirmée</SelectItem>
              <SelectItem key="delivered">Livrée</SelectItem>
              <SelectItem key="cancelled">Annulée</SelectItem>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[0.72rem] font-semibold text-[#555550] uppercase tracking-[0.08em]">
              Période
            </label>
            <DateRangePicker
              size="sm"
              variant="bordered"
              aria-label="Plage de dates"
              visibleMonths={1}
              value={
                (filters.startDate && filters.endDate
                  ? {
                      start: parseDate(filters.startDate),
                      end: parseDate(filters.endDate),
                    }
                  : null) as never
              }
              onChange={(range: unknown) => {
                const r = range as {
                  start: { toString(): string };
                  end: { toString(): string };
                } | null;
                if (!r) {
                  setFilters((prev) => ({
                    ...prev,
                    startDate: "",
                    endDate: "",
                    page: 1,
                  }));
                  return;
                }
                setFilters((prev) => ({
                  ...prev,
                  startDate: r.start.toString(),
                  endDate: r.end.toString(),
                  page: 1,
                }));
              }}
              classNames={{
                inputWrapper:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                input: "text-[0.78rem] text-[#555550]",
              }}
            />
          </div>
        </div>

        <div className="p-5 border-t border-[#E8E4DC]">
          <Button
            size="sm"
            variant="bordered"
            onPress={() => { resetFilters(); setFiltersOpen(false); }}
            startContent={<RotateCcw size={12} />}
            className="w-full h-9 text-[0.78rem] text-[#555550] border-[#E8E4DC] hover:border-[#2D5A3D]"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   KPI STRIP
══════════════════════════════════════════ */
function KpiStrip({
  kpis,
  activeStatus,
  onSelect,
}: {
  kpis: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    cancelled: number;
  };
  activeStatus: string;
  onSelect: (status: string) => void;
}) {
  const cards = [
    {
      key: "",
      label: "Total",
      sub: "toutes commandes",
      value: kpis.total,
      borderColor: "#C9960C",
      iconBg: "#FEF9E8",
      icon: <ClipboardList size={14} className="text-[#C9960C]" />,
    },
    {
      key: "pending",
      label: "En attente",
      sub: "à confirmer",
      value: kpis.pending,
      borderColor: "#C9960C",
      iconBg: "#FEF9E8",
      icon: <Clock size={14} className="text-[#C9960C]" />,
    },
    {
      key: "confirmed",
      label: "Confirmées",
      sub: "en préparation",
      value: kpis.confirmed,
      borderColor: "#3A6B9E",
      iconBg: "#E8F0F8",
      icon: <CheckCircle2 size={14} className="text-[#3A6B9E]" />,
    },
    {
      key: "delivered",
      label: "Livrées",
      sub: "ce mois",
      value: kpis.delivered,
      borderColor: "#2D5A3D",
      iconBg: "#E8F0E8",
      icon: <Home size={14} className="text-[#2D5A3D]" />,
    },
    {
      key: "cancelled",
      label: "Annulées",
      sub: "ce mois",
      value: kpis.cancelled,
      borderColor: "#C44B3C",
      iconBg: "#FAEAE8",
      icon: <XCircle size={14} className="text-[#C44B3C]" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((c) => {
        return (
          <button
            key={c.key || "all"}
            type="button"
            onClick={() => onSelect(c.key)}
            className={`relative overflow-hidden bg-white border border-[#E8E4DC] rounded-xl p-4 text-left transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md`}
          >
            <span
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: c.borderColor }}
            />
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.6rem] tracking-[0.1em] uppercase text-[#888880] font-semibold">
                {c.label}
              </p>
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: c.iconBg }}
              >
                {c.icon}
              </div>
            </div>
            <p
              className="text-[1.8rem] font-normal text-[#2C2C2C] leading-none mb-1"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              {c.value}
            </p>
            <p className="text-[0.66rem] text-[#888880] font-light">{c.sub}</p>
          </button>
        );
      })}
    </div>
  );
}

export default OrdersList;
