"use client";

import { useMemo, useState } from "react";
import { Button, Chip, Spinner } from "@heroui/react";
import { Plus, CalendarDays, Clock } from "lucide-react";

import {
  DataTable,
  TableActions,
  Modal,
  ConfirmDialog,
  useDisclosure,
  type Column,
} from "@/components/ui";

import { useGetAllDays } from "../apis/getAllDays";
import { useCreateDay } from "../apis/createDay";
import { useUpdateDay } from "../apis/updateDay";
import { useDeleteDay } from "../apis/deleteDay";
import DeliveryDayForm from "./DeliveryDayForm";
import { WEEKDAY_LABELS, type Weekday } from "../types/delivery";
import type {
  CreateOrUpdateDeliveryDayDto,
  GetAllDeliveryDaysDto,
} from "../types/delivery.dto";

const DeliveryDaysList = () => {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 });

  const createModal = useDisclosure();
  const updateModal = useDisclosure();
  const confirmDelete = useDisclosure();

  const [active, setActive] = useState<GetAllDeliveryDaysDto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading } = useGetAllDays(
    filters.page - 1,
    filters.pageSize,
    "",
  );

  const { mutateAsync: createDay, isPending: isCreating } = useCreateDay();
  const { mutateAsync: updateDay, isPending: isUpdating } = useUpdateDay();
  const { mutateAsync: deleteDay, isPending: isDeleting } = useDeleteDay();

  const handleCreate = async (formData: CreateOrUpdateDeliveryDayDto) => {
    await createDay(formData);
    createModal.onClose();
  };

  const handleUpdate = async (formData: CreateOrUpdateDeliveryDayDto) => {
    if (!active) return;
    await updateDay({ ...formData, id: active.id });
    updateModal.onClose();
    setActive(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteDay(pendingDelete.id);
    setPendingDelete(null);
    confirmDelete.onClose();
  };

  const columns = useMemo<Column<GetAllDeliveryDaysDto>[]>(
    () => [
      {
        key: "deliveryDay",
        label: "JOUR DE LIVRAISON",
        render: (v) => (
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-md bg-[#E8F0E8] flex items-center justify-center shrink-0">
              <CalendarDays size={14} className="text-[#2D5A3D]" />
            </span>
            <span className="text-[0.83rem] font-medium text-[#2C2C2C]">
              {WEEKDAY_LABELS[v as Weekday]}
            </span>
          </div>
        ),
      },
      {
        key: "cutoffHour",
        label: "LIMITE DE COMMANDE",
        render: (v, row) => {
          const prevWeekday = (((row.deliveryDay as number) + 6) %
            7) as Weekday;
          return (
            <Chip
              variant="flat"
              size="sm"
              startContent={<Clock size={11} className="ml-1 text-[#888880]" />}
              classNames={{ content: "text-[0.72rem] font-semibold px-1.5" }}
            >
              {WEEKDAY_LABELS[prevWeekday]} à{" "}
              {String(v as number).padStart(2, "0")}:00
            </Chip>
          );
        },
      },
      {
        key: "actions",
        label: "",
        render: (_, row) => (
          <TableActions
            actions={[
              {
                template: "update",
                onAction: () => {
                  setActive(row);
                  updateModal.onOpen();
                },
              },
              {
                template: "delete",
                onAction: () => {
                  setPendingDelete({
                    id: row.id,
                    name: WEEKDAY_LABELS[row.deliveryDay as Weekday],
                  });
                  confirmDelete.onOpen();
                },
              },
            ]}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        label="Jours de livraison"
        columns={columns}
        rows={data?.data ?? []}
        isLoading={isLoading}
        showRowCount
        withPagination={{
          page: filters.page,
          pageSize: filters.pageSize,
          numOfPages: data?.totalPages ?? 1,
          total: data?.totalItems,
          onPageChange: (page) => setFilters((p) => ({ ...p, page })),
          onPageSizeChange: (size) => setFilters({ page: 1, pageSize: size }),
        }}
        topActions={
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={13} />}
            className="h-9 text-[0.81rem]"
            onPress={createModal.onOpen}
          >
            Nouveau jour
          </Button>
        }
      />

      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Nouveau jour de livraison"
        subtitle="Définir un jour et son heure limite (la veille)"
        size="lg"
      >
        <DeliveryDayForm
          mode="create"
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          onCancel={createModal.onClose}
        />
      </Modal>

      <Modal
        isOpen={updateModal.isOpen}
        onClose={() => {
          updateModal.onClose();
          setActive(null);
        }}
        title={
          active
            ? `Modifier ${WEEKDAY_LABELS[active.deliveryDay as Weekday]}`
            : "Modifier le jour"
        }
        size="lg"
      >
        {!active ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <DeliveryDayForm
            mode="update"
            defaultValues={active}
            onSubmit={handleUpdate}
            isSubmitting={isUpdating}
            onCancel={() => {
              updateModal.onClose();
              setActive(null);
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => {
          confirmDelete.onClose();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title={`Supprimer le ${pendingDelete?.name ?? "jour"} ?`}
        description="Ce jour ne sera plus proposé lors de la commande."
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DeliveryDaysList;
