"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Avatar,
  Button,
  Chip,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import {
  ArrowUpDown,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Shield,
  RotateCcw,
  Users as UsersIcon,
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

import { useGetAllUsers } from "../apis/getAllUsers";
import { useGetSingleUser } from "../apis/getSingleUser";
import { useCreateUser } from "../apis/createUser";
import { useUpdateUser } from "../apis/updateUser";
import { useDeleteUser } from "../apis/deleteUser";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import {
  USER_ROLE_LABELS,
  USER_SORT_OPTIONS,
  type GetAllUsersDto,
  type CreateOrUpdateUserDto,
} from "../types/user.dto";
import { USER_ROLE_STYLE } from "../utils/user.utils";
import formatDate from "@/utils/format-date";

const UsersList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
    role: "",
    sort: "",
  });
  const [debouncedSearch] = useDebounce(filters.searchQuery, 500);

  /* ── Modals & drawers ── */
  const createModal = useDisclosure();
  const updateModal = useDisclosure();
  const detailsDrawer = useDisclosure();
  const confirmDelete = useDisclosure();

  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  /* ── Queries ── */
  const { data, isLoading } = useGetAllUsers({
    page: filters.page - 1,
    size: filters.pageSize,
    search: debouncedSearch,
    role: filters.role,
    sort: filters.sort,
  });

  const { data: userDetails, isLoading: isLoadingDetails } = useGetSingleUser(
    activeUserId ?? "",
  );

  /* ── Mutations ── */
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();

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
      role: "",
      sort: "",
    });

  const handleViewDetails = (id: string) => {
    setActiveUserId(id);
    detailsDrawer.onOpen();
  };

  const handleOpenUpdate = (id: string) => {
    setActiveUserId(id);
    updateModal.onOpen();
  };

  const handleOpenDelete = (id: string, name: string) => {
    setPendingDelete({ id, name });
    confirmDelete.onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteUser(pendingDelete.id);
    setPendingDelete(null);
    confirmDelete.onClose();
  };

  const handleCreateSubmit = async (formData: CreateOrUpdateUserDto) => {
    await createUser(formData);
    createModal.onClose();
  };

  const handleUpdateSubmit = async (formData: CreateOrUpdateUserDto) => {
    if (!activeUserId) return;
    await updateUser({ ...formData, id: activeUserId });
    updateModal.onClose();
    setActiveUserId(null);
  };

  /* ── Columns ── */
  const columns = useMemo<Column<GetAllUsersDto>[]>(
    () => [
      {
        key: "name",
        label: "UTILISATEUR",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={row.image || undefined}
              name={row.name?.charAt(0)?.toUpperCase() ?? "?"}
              className="w-9 h-9 text-[0.78rem] font-semibold shrink-0"
              style={{ background: "#E8F0E8", color: "#2D5A3D" }}
            />
            <div className="min-w-0">
              <p className="text-[0.83rem] font-medium text-[#2C2C2C] truncate">
                {row.name || "Sans nom"}
              </p>
              <p className="text-[0.7rem] text-[#888880] truncate">
                {row.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "role",
        label: "RÔLE",
        render: (v) => {
          const role = v as keyof typeof USER_ROLE_STYLE;
          const style = USER_ROLE_STYLE[role];
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
              {USER_ROLE_LABELS[role]}
            </Chip>
          );
        },
      },
      {
        key: "createdAt",
        label: "INSCRIPTION",
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
                onAction: () => handleViewDetails(row.id),
              },
              {
                template: "update",
                onAction: () => handleOpenUpdate(row.id),
              },
              {
                template: "delete",
                onAction: () =>
                  handleOpenDelete(row.id, row.name || row.email || row.id),
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Utilisateurs"
        description={
          data
            ? `${data.totalItems} utilisateur${data.totalItems !== 1 ? "s" : ""} enregistré${data.totalItems !== 1 ? "s" : ""}`
            : "Chargement…"
        }
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Utilisateurs" },
        ]}
        actions={
          <Button
            color="primary"
            size="sm"
            startContent={<Plus size={13} />}
            className="h-9 text-[0.81rem]"
            onPress={createModal.onOpen}
          >
            Nouvel utilisateur
          </Button>
        }
      />

      <DataTable
        label="Utilisateurs"
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
            <Select
              size="sm"
              variant="bordered"
              aria-label="Rôle"
              selectedKeys={new Set([filters.role])}
              onSelectionChange={(keys) => {
                const v = (Array.from(keys)[0] as string) ?? "";
                changeFilters("role", v);
              }}
              startContent={<Shield size={12} className="text-[#888880]" />}
              classNames={{
                base: "w-[170px]",
                trigger:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                value: "text-[0.8rem] text-[#555550]",
              }}
            >
              <SelectItem key="">Tous les rôles</SelectItem>
              <SelectItem key="ADMIN">Administrateur</SelectItem>
              <SelectItem key="USER">Utilisateur</SelectItem>
            </Select>

            <Button
              size="sm"
              variant="light"
              onPress={resetFilters}
              startContent={<RotateCcw size={12} />}
              className="h-9 text-[0.78rem] text-[#555550] hover:text-[#2C2C2C]"
            >
              Réinit.
            </Button>
          </>
        }
        topActions={
          <Select
            size="sm"
            variant="bordered"
            aria-label="Trier"
            selectedKeys={new Set([filters.sort])}
            onSelectionChange={(keys) => {
              const v = (Array.from(keys)[0] as string) ?? "";
              changeFilters("sort", v);
            }}
            startContent={<ArrowUpDown size={12} className="text-[#888880]" />}
            classNames={{
              base: "w-[200px]",
              trigger:
                "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] h-9 min-h-9 shadow-none",
              value: "text-[0.8rem] text-[#555550]",
            }}
          >
            {USER_SORT_OPTIONS.map((o) => (
              <SelectItem key={o.key}>{o.label}</SelectItem>
            ))}
          </Select>
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
        title="Nouvel utilisateur"
        subtitle="Créer un compte utilisateur ou administrateur"
        size="2xl"
      >
        <UserForm
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
          setActiveUserId(null);
        }}
        title={
          userDetails
            ? `Modifier ${userDetails.name || userDetails.email}`
            : "Modifier l'utilisateur"
        }
        subtitle={userDetails?.email}
        size="2xl"
      >
        {isLoadingDetails || !userDetails ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <UserForm
            mode="update"
            defaultValues={userDetails}
            onSubmit={handleUpdateSubmit}
            isSubmitting={isUpdating}
            onCancel={() => {
              updateModal.onClose();
              setActiveUserId(null);
            }}
          />
        )}
      </Modal>

      {/* ── Details drawer ── */}
      <Modal
        isOpen={detailsDrawer.isOpen}
        onClose={() => {
          detailsDrawer.onClose();
          setActiveUserId(null);
        }}
        title={userDetails?.name || userDetails?.email || "Détails"}
        subtitle={userDetails?.id}
        isDrawer
        footer={
          userDetails ? (
            <div className="flex items-center gap-2 w-full">
              <Button
                size="sm"
                color="primary"
                variant="solid"
                className="text-[0.81rem] font-medium h-9 flex-1"
                onPress={() => {
                  detailsDrawer.onClose();
                  handleOpenUpdate(userDetails.id);
                }}
                startContent={<Pencil size={13} />}
              >
                Modifier
              </Button>
              <Button
                size="sm"
                variant="light"
                color="danger"
                className="text-[0.81rem] font-medium h-9"
                onPress={() => {
                  detailsDrawer.onClose();
                  handleOpenDelete(
                    userDetails.id,
                    userDetails.name || userDetails.email,
                  );
                }}
                startContent={<Trash2 size={13} />}
              >
                Supprimer
              </Button>
            </div>
          ) : null
        }
      >
        {isLoadingDetails || !userDetails ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" color="primary" />
          </div>
        ) : (
          <UserDetails user={userDetails} />
        )}
      </Modal>

      {/* ── Confirm delete ── */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => {
          confirmDelete.onClose();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        variant="danger"
        title={`Supprimer ${pendingDelete?.name ?? "cet utilisateur"} ?`}
        description="Cette action est irréversible. Toutes les sessions et comptes liés seront également supprimés."
        confirmLabel="Supprimer définitivement"
        isLoading={isDeleting}
      />

      {/* Empty hint quand pas de données */}
      {!isLoading &&
        data &&
        data.totalItems === 0 &&
        filters.searchQuery === "" &&
        filters.role === "" && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-[#F2F7F2] border border-[#E8E4DC] flex items-center justify-center">
              <UsersIcon size={22} className="text-[#888880]" />
            </div>
            <p className="text-[0.88rem] text-[#555550] font-medium">
              Aucun utilisateur pour le moment
            </p>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={13} />}
              onPress={createModal.onOpen}
              className="h-9 text-[0.81rem]"
            >
              Créer le premier utilisateur
            </Button>
          </div>
        )}
    </div>
  );
};

export default UsersList;
