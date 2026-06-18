"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button, Chip, Spinner } from "@heroui/react";
import { Plus, MapPin } from "lucide-react";

import {
  DataTable,
  TableActions,
  Modal,
  ConfirmDialog,
  useDisclosure,
  type Column,
} from "@/components/ui";

import { useGetAllCities } from "../apis/getAllCities";
import { useCreateCity } from "../apis/createCity";
import { useUpdateCity } from "../apis/updateCity";
import { useDeleteCity } from "../apis/deleteCity";
import DeliveryCityForm from "./DeliveryCityForm";
import type {
  CreateOrUpdateDeliveryCityDto,
  GetAllDeliveryCitiesDto,
} from "../types/delivery.dto";
import formatPrice from "@/utils/format-price";

const DeliveryCitiesList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
  });
  const [debouncedSearch] = useDebounce(filters.searchQuery, 500);

  const createModal = useDisclosure();
  const updateModal = useDisclosure();
  const confirmDelete = useDisclosure();

  const [active, setActive] = useState<GetAllDeliveryCitiesDto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading } = useGetAllCities(
    filters.page - 1,
    filters.pageSize,
    debouncedSearch,
    "",
  );

  const { mutateAsync: createCity, isPending: isCreating } = useCreateCity();
  const { mutateAsync: updateCity, isPending: isUpdating } = useUpdateCity();
  const { mutateAsync: deleteCity, isPending: isDeleting } = useDeleteCity();

  const changeFilters = (name: keyof typeof filters, value: number | string) =>
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "page" ? { page: 1 } : {}),
    }));

  const handleCreate = async (formData: CreateOrUpdateDeliveryCityDto) => {
    await createCity(formData);
    createModal.onClose();
  };

  const handleUpdate = async (formData: CreateOrUpdateDeliveryCityDto) => {
    if (!active) return;
    await updateCity({ ...formData, id: active.id });
    updateModal.onClose();
    setActive(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteCity(pendingDelete.id);
    setPendingDelete(null);
    confirmDelete.onClose();
  };

  const columns = useMemo<Column<GetAllDeliveryCitiesDto>[]>(
    () => [
      {
        key: "cityName",
        label: "VILLE",
        render: (v) => (
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-md bg-[#E8F0E8] flex items-center justify-center shrink-0">
              <MapPin size={14} className="text-[#2D5A3D]" />
            </span>
            <span className="text-[0.83rem] font-medium text-[#2C2C2C]">
              {v as string}
            </span>
          </div>
        ),
      },
      {
        key: "deliveryTax",
        label: "FRAIS DE LIVRAISON",
        render: (v) => (
          <Chip
            variant="flat"
            size="sm"
            classNames={{ content: "text-[0.72rem] font-semibold px-1.5" }}
          >
            {formatPrice(v as number)}
          </Chip>
        ),
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
                  setPendingDelete({ id: row.id, name: row.cityName });
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
        label="Villes de livraison"
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
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={13} />}
            className="h-9 text-[0.81rem]"
            onPress={createModal.onOpen}
          >
            Nouvelle ville
          </Button>
        }
      />

      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Nouvelle ville de livraison"
        subtitle="Définir une ville et ses frais de livraison"
        size="lg"
      >
        <DeliveryCityForm
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
        title={active ? `Modifier ${active.cityName}` : "Modifier la ville"}
        size="lg"
      >
        {!active ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <DeliveryCityForm
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
        title={`Supprimer ${pendingDelete?.name ?? "cette ville"} ?`}
        description="Cette ville ne sera plus proposée lors de la commande."
        confirmLabel="Supprimer"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DeliveryCitiesList;
