// ============================================================
// FERME BELDI — Design System / Components Page
// HeroUI v2.8 | React 18 | TypeScript | Tailwind CSS
// See tailwind.config.ts for the global HeroUI theme setup
// Google Fonts: Instrument Serif, DM Sans, JetBrains Mono
// ============================================================
"use client";

import React, { useState, useCallback, useEffect } from "react";

// ── HeroUI v2.8 ─────────────────────────────────────────────
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  useDisclosure,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Avatar,
  Divider,
  Textarea,
  addToast,
} from "@heroui/react";
import type { Selection } from "@heroui/react";

// ── Lucide Icons ────────────────────────────────────────────
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Tag,
  Users,
  DollarSign,
  Settings,
  Bell,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Eye,
  X,
  AlertTriangle,
  Info,
  Check,
  Archive,
  Copy,
  Flag,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Leaf,
  BarChart3,
  ClipboardList,
  UserCircle,
  Package,
  GripVertical,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Star,
  Timer,
  Zap,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DataTable,
  Modal,
  PageHeader,
  TableActions,
  toast,
} from "@/components/ui";

// ============================================================
// TYPES
// ============================================================
type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivering"
  | "delivered"
  | "inactive"
  | "cancelled";
type ToastType = "success" | "error" | "warning" | "info";
type Priority = "low" | "medium" | "high";

interface Order {
  id: string;
  customer: string;
  city: string;
  products: string;
  amount: number;
  status: OrderStatus;
  slot: string;
  date: string;
}

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  assignee: string;
  priority: Priority;
  dueDate: string;
  comments?: number;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_ORDERS: Order[] = [
  {
    id: "CMD-001",
    customer: "Fatima Zahra",
    city: "Casablanca",
    products: "Légumes × 3, Œufs × 2",
    amount: 187,
    status: "pending",
    slot: "Matin 8h–12h",
    date: "2025-07-10",
  },
  {
    id: "CMD-002",
    customer: "Ahmed Benali",
    city: "Rabat",
    products: "Poulet fermier × 1",
    amount: 95,
    status: "confirmed",
    slot: "Après-midi",
    date: "2025-07-10",
  },
  {
    id: "CMD-003",
    customer: "Nadia Chraibi",
    city: "Marrakech",
    products: "Fromage × 2, Miel × 1",
    amount: 245,
    status: "preparing",
    slot: "Matin 8h–12h",
    date: "2025-07-09",
  },
  {
    id: "CMD-004",
    customer: "Youssef El Fassi",
    city: "Fès",
    products: "Huile d'olive × 3",
    amount: 320,
    status: "delivering",
    slot: "Soir 18h–21h",
    date: "2025-07-09",
  },
  {
    id: "CMD-005",
    customer: "Salma Ouali",
    city: "Casablanca",
    products: "Légumes × 5",
    amount: 156,
    status: "delivered",
    slot: "Matin 8h–12h",
    date: "2025-07-08",
  },
  {
    id: "CMD-006",
    customer: "Karim Benjelloun",
    city: "Tanger",
    products: "Confiture × 2, Pain × 3",
    amount: 89,
    status: "cancelled",
    slot: "Après-midi",
    date: "2025-07-08",
  },
  {
    id: "CMD-007",
    customer: "Leila Mansouri",
    city: "Agadir",
    products: "Œufs × 4, Lait × 2",
    amount: 134,
    status: "confirmed",
    slot: "Matin 8h–12h",
    date: "2025-07-07",
  },
  {
    id: "CMD-008",
    customer: "Hassan Tazi",
    city: "Oujda",
    products: "Miel × 2, Argan × 1",
    amount: 278,
    status: "delivered",
    slot: "Soir 18h–21h",
    date: "2025-07-07",
  },
  {
    id: "CMD-009",
    customer: "Amina Rhazi",
    city: "Meknès",
    products: "Légumes × 2",
    amount: 76,
    status: "pending",
    slot: "Après-midi",
    date: "2025-07-06",
  },
  {
    id: "CMD-010",
    customer: "Omar Idrissi",
    city: "Casablanca",
    products: "Poulet × 2, Fromage × 1",
    amount: 210,
    status: "preparing",
    slot: "Matin 8h–12h",
    date: "2025-07-06",
  },
  {
    id: "CMD-011",
    customer: "Widad Benhida",
    city: "Rabat",
    products: "Huile × 1, Miel × 1",
    amount: 165,
    status: "delivered",
    slot: "Après-midi",
    date: "2025-07-05",
  },
  {
    id: "CMD-012",
    customer: "Rachid Alaoui",
    city: "Casablanca",
    products: "Légumes × 7",
    amount: 210,
    status: "confirmed",
    slot: "Soir 18h–21h",
    date: "2025-07-05",
  },
];

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    title: "À faire",
    color: "#888880",
    cards: [
      {
        id: "k1",
        title: "Configurer l'export CSV avancé",
        tag: "Feature",
        tagColor: "#3A6B9E",
        assignee: "YT",
        priority: "medium",
        dueDate: "12 Jul",
        comments: 3,
      },
      {
        id: "k2",
        title: "Page analytique des revenus",
        tag: "Design",
        tagColor: "#8B7355",
        assignee: "AM",
        priority: "low",
        dueDate: "18 Jul",
        comments: 1,
      },
    ],
  },
  {
    id: "inprogress",
    title: "En cours",
    color: "#D4883C",
    cards: [
      {
        id: "k3",
        title: "Module de gestion des stocks",
        tag: "Dev",
        tagColor: "#2D5A3D",
        assignee: "YT",
        priority: "high",
        dueDate: "10 Jul",
        comments: 7,
      },
      {
        id: "k4",
        title: "Notifications SMS livraisons",
        tag: "Feature",
        tagColor: "#3A6B9E",
        assignee: "KB",
        priority: "medium",
        dueDate: "15 Jul",
        comments: 2,
      },
    ],
  },
  {
    id: "review",
    title: "En révision",
    color: "#3A6B9E",
    cards: [
      {
        id: "k5",
        title: "Tableau de bord mobile",
        tag: "Design",
        tagColor: "#8B7355",
        assignee: "AM",
        priority: "high",
        dueDate: "09 Jul",
        comments: 5,
      },
    ],
  },
  {
    id: "done",
    title: "Terminé",
    color: "#2D5A3D",
    cards: [
      {
        id: "k6",
        title: "Système d'authentification",
        tag: "Dev",
        tagColor: "#2D5A3D",
        assignee: "YT",
        priority: "high",
        dueDate: "05 Jul",
        comments: 12,
      },
      {
        id: "k7",
        title: "Page commandes v1",
        tag: "Dev",
        tagColor: "#2D5A3D",
        assignee: "YT",
        priority: "medium",
        dueDate: "01 Jul",
        comments: 4,
      },
    ],
  },
];

const STATUS_CFG: Record<
  OrderStatus,
  {
    label: string;
    color:
      | "warning"
      | "primary"
      | "secondary"
      | "default"
      | "success"
      | "danger";
  }
> = {
  pending: { label: "En attente", color: "warning" },
  confirmed: { label: "Confirmée", color: "primary" },
  preparing: { label: "Préparation", color: "secondary" },
  delivering: { label: "Livraison", color: "default" },
  delivered: { label: "Livrée", color: "success" },
  cancelled: { label: "Annulée", color: "danger" },
  inactive: { label: "Inactif", color: "default" },
};

const PRIORITY_CFG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  high: { label: "Haute", color: "#C44B3C", bg: "#FAEAE8" },
  medium: { label: "Moyenne", color: "#C9960C", bg: "#FEF9E8" },
  low: { label: "Basse", color: "#3A6B9E", bg: "#E8F0F8" },
};

const NAV_SECTIONS: {
  section?: string;
  icon: React.ElementType;
  label: string;
  badge?: string;
  active?: boolean;
}[] = [
  { section: "Principal", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { icon: ClipboardList, label: "Commandes", badge: "12", active: true },
  { icon: Truck, label: "Livraisons", badge: "5" },
  { icon: Package, label: "Produits" },
  { icon: Users, label: "Clients" },
  { section: "Finance", icon: DollarSign, label: "Revenus" },
  { icon: BarChart3, label: "Analytiques" },
  { section: "Système", icon: Settings, label: "Paramètres" },
];

// ============================================================
// TOAST SYSTEM
// ============================================================
let _tid = 0;

function ToastStack({
  toasts,
  remove,
}: {
  toasts: ToastItem[];
  remove: (id: string) => void;
}) {
  const META: Record<ToastType, { icon: React.ReactNode; iconCls: string }> = {
    success: {
      icon: <CheckCheck size={13} />,
      iconCls: "bg-[#E8F0E8] text-[#2D5A3D]",
    },
    error: {
      icon: <AlertCircle size={13} />,
      iconCls: "bg-[#FAEAE8] text-[#C44B3C]",
    },
    warning: {
      icon: <AlertTriangle size={13} />,
      iconCls: "bg-[#FEF9E8] text-[#C9960C]",
    },
    info: { icon: <Info size={13} />, iconCls: "bg-[#E8F0F8] text-[#3A6B9E]" },
  };
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const m = META[t.type];
        return (
          <div
            key={t.id}
            className="pointer-events-auto bg-white border border-[#E8E4DC] rounded-lg px-3.5 py-2.5 shadow-[0_4px_12px_rgba(44,44,44,.12)] flex items-start gap-3 min-w-[268px] max-w-[330px]"
            style={{
              animation: "toastIn .32s cubic-bezier(.22,.68,0,1.2) both",
            }}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.iconCls}`}
            >
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.78rem] font-semibold text-[#2C2C2C] leading-tight">
                {t.title}
              </p>
              {t.message && (
                <p className="text-[0.7rem] text-[#555550] font-light mt-0.5 leading-relaxed">
                  {t.message}
                </p>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="flex-shrink-0 text-[#C8C8C0] hover:text-[#2C2C2C] transition-colors mt-0.5"
            >
              <X size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [active, setActive] = useState("Commandes");

  return (
    <aside
      className="bg-primary-800 flex flex-col fixed inset-y-0 left-0 z-[200] transition-[width] duration-300 ease-[cubic-bezier(.25,.46,.45,.94)]"
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-5">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "#D4883C" }}
        >
          <Leaf size={15} color="#fff" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <div
              className="text-white text-[1.08rem] leading-tight truncate"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              Bayt Bio
            </div>
            <div className="text-white/40 text-[0.54rem] tracking-[0.15em] uppercase font-semibold mt-0.5">
              Admin Dashboard
            </div>
          </div>
        )}
        <Tooltip
          content={collapsed ? "Développer" : "Réduire"}
          placement="right"
          classNames={{ content: "bg-[#1E3D29] text-white text-[0.73rem]" }}
        >
          <button
            onClick={onToggle}
            className="flex-shrink-0 text-white/40 hover:text-white transition-colors ml-auto"
          >
            {collapsed ? (
              <PanelLeftOpen size={14} />
            ) : (
              <PanelLeftClose size={14} />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {NAV_SECTIONS.map(
          ({ section, icon: Icon, label, badge, active: defaultActive }) => (
            <React.Fragment key={label}>
              {section && !collapsed && (
                <div className="px-4 pt-4 pb-1 text-[0.56rem] font-semibold tracking-[0.17em] uppercase text-white/28">
                  {section}
                </div>
              )}
              {section && collapsed && <div className="h-2.5" />}

              <Tooltip
                content={label}
                placement="right"
                isDisabled={!collapsed}
                classNames={{
                  content: "bg-primary-700 text-white text-[0.73rem]",
                }}
              >
                <button
                  onClick={() => setActive(label)}
                  className="relative flex items-center gap-2.5 w-[calc(100%-12px)] mx-[6px] my-[1px] rounded-md transition-all duration-150"
                  style={{
                    padding: collapsed ? "9px 18px" : "9px 10px",
                    background:
                      active === label
                        ? "rgba(255,255,255,.14)"
                        : "transparent",
                    color: active === label ? "#fff" : "rgba(255,255,255,.60)",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.81rem",
                    fontWeight: active === label ? 500 : 400,
                  }}
                >
                  {active === label && (
                    <span className="bg-primary-300 absolute -left-[6px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-sm" />
                  )}
                  <Icon
                    size={16}
                    style={{
                      flexShrink: 0,
                      opacity: active === label ? 1 : 0.65,
                    }}
                  />
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{label}</span>
                      {badge && (
                        <span
                          className="bg-primary ml-auto text-[0.57rem] font-bold px-1.5 py-[2px] rounded-full min-w-[17px] text-center leading-none"
                          style={{ color: "#fff" }}
                        >
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && badge && (
                    <span
                      className="absolute top-1 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: "#D4883C" }}
                    />
                  )}
                </button>
              </Tooltip>
            </React.Fragment>
          ),
        )}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar
            name="YT"
            className="w-8 h-8 text-[0.73rem] font-semibold text-white bg-white/14"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-[0.78rem] font-medium leading-tight">
                Youssef Tazi
              </div>
              <div className="text-white/38 text-[0.62rem] mt-0.5">
                Administrateur
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
}

// ============================================================
// STATUS CHIP
// ============================================================
function StatusChip({ status }: { status: OrderStatus }) {
  const { label, color } = STATUS_CFG[status];
  return (
    <Chip
      color={color}
      variant="flat"
      size="sm"
      classNames={{
        base: "h-[22px]",
        content: "text-[0.65rem] font-semibold px-1.5",
      }}
    >
      {label}
    </Chip>
  );
}

// ============================================================
// TABLE ACTIONS MENU
// ============================================================
interface TableActionsMenuProps {
  onAction: (key: string) => void;
}

export function TableActionsMenu({ onAction }: TableActionsMenuProps) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          aria-label="Actions"
          className="w-7 h-7 min-w-7 text-[#888880] data-[hover=true]:bg-[#FAF8F5] data-[hover=true]:text-[#2C2C2C]"
        >
          <MoreHorizontal size={15} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Row actions"
        onAction={(k) => onAction(k.toString())}
        classNames={{ base: "min-w-[180px] p-1.5", list: "gap-0.5" }}
        itemClasses={{
          base: "rounded-md px-2.5 py-2 text-[0.8rem] data-[hover=true]:bg-[#FAF8F5]",
          title: "text-[0.8rem]",
        }}
      >
        <DropdownItem
          key="view"
          startContent={<Eye size={13} className="text-[#3A6B9E]" />}
          className="text-[#555550]"
        >
          Voir les détails
        </DropdownItem>
        <DropdownItem
          key="edit"
          startContent={<Edit size={13} className="text-[#2D5A3D]" />}
          className="text-[#555550]"
        >
          Modifier
        </DropdownItem>
        <DropdownItem
          key="confirm"
          startContent={<CheckCircle size={13} className="text-[#2D5A3D]" />}
          className="text-[#555550]"
        >
          Confirmer
        </DropdownItem>
        <DropdownItem
          key="copy"
          startContent={<Copy size={13} className="text-[#888880]" />}
          className="text-[#555550]"
          showDivider
        >
          Dupliquer
        </DropdownItem>
        <DropdownItem
          key="archive"
          startContent={<Archive size={13} className="text-[#C9960C]" />}
          className="text-[#555550]"
        >
          Archiver
        </DropdownItem>
        <DropdownItem
          key="delete"
          startContent={<Trash2 size={13} />}
          className="text-danger"
          color="danger"
        >
          Supprimer
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ============================================================
// DATA TABLE
// ============================================================
const TABLE_COLS = [
  { key: "id", label: "N° CMD" },
  { key: "customer", label: "CLIENT" },
  { key: "products", label: "PRODUITS" },
  { key: "amount", label: "MONTANT" },
  { key: "status", label: "STATUT" },
  { key: "slot", label: "CRÉNEAU" },
  { key: "date", label: "DATE" },
  {
    key: "actions",
    label: "",
    render: (_: any, row: Order) => (
      <TableActions
        actions={[
          {
            template: "view",
            onAction: () =>
              toast.info({ title: "Détails", description: "Détails" }),
          },
          {
            template: "update",
            onAction: () =>
              toast.info({
                title: "Modification",
                description: "Modification",
              }),
          },
          {
            template: "delete",
            onAction: () =>
              toast.warning({
                title: "Suppression",
                description: `${row.id} — action simulée`,
              }),
          },
        ]}
      />
    ),
  },
];

// ============================================================
// CONFIRM DIALOG
// ============================================================
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  variant = "danger",
}: ConfirmDialogProps) {
  const isDanger = variant === "danger";
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      footer={
        <>
          <Button
            variant="bordered"
            size="sm"
            onPress={onClose}
            className="border-[#E8E4DC] text-[#555550] h-9 text-[0.81rem] flex-1"
          >
            Annuler
          </Button>
          <Button
            color={isDanger ? "danger" : "primary"}
            size="sm"
            onPress={() => {
              onConfirm();
              onClose();
            }}
            className="h-9 text-[0.81rem] flex-1"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <>
        <div className="flex flex-col items-start">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center mb-3.5 ${isDanger ? "bg-[#FAEAE8]" : "bg-[#E8F0E8]"}`}
          >
            {isDanger ? (
              <AlertTriangle size={18} className="text-[#C44B3C]" />
            ) : (
              <CheckCircle size={18} className="text-[#2D5A3D]" />
            )}
          </div>
          <h3
            className="text-[1.1rem] font-normal text-[#2C2C2C] mb-2 leading-snug"
            style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
          >
            {title}
          </h3>
          <p className="text-[0.8rem] text-[#555550] font-light leading-relaxed">
            {description}
          </p>
        </div>
      </>
    </Modal>
  );
}

// ============================================================
// CUSTOM MODAL (form example)
// ============================================================
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomModal({ isOpen, onClose }: CustomModalProps) {
  const inputCls = {
    inputWrapper:
      "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] shadow-none",
    label:
      "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
    input: "text-[0.83rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      placement="center"
      scrollBehavior="inside"
      title={
        <>
          <div>
            <h2
              className="text-[1.2rem] font-normal text-[#2C2C2C]"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              Nouvelle commande
            </h2>
            <p className="text-[0.71rem] text-[#888880] font-light mt-0.5">
              Remplissez les informations du client et des produits
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
                necessitatibus error, perspiciatis minima, natus omnis
                consequuntur maiores quod pariatur aut numquam labore quaerat
                molestias. Eaque dicta sint vel vitae quidem at dolorum, ad
                doloribus magnam, id similique ex expedita quod, a reiciendis
                excepturi harum ipsam dolorem quos deserunt? Quod explicabo
                nostrum deleniti fugiat libero laboriosam in aperiam magni ab
                voluptatibus, eum molestias quibusdam animi modi? Recusandae
                officia sed nam illo nesciunt omnis nihil assumenda vitae
                molestias nisi consectetur, quis eius ipsam quia minima suscipit
                natus porro quaerat! Blanditiis distinctio obcaecati impedit eos
                aut quisquam voluptates aliquid animi at facere minus, culpa vel
                eius, veniam cupiditate asperiores. Aperiam ipsa quae rem
                voluptates quaerat eveniet, doloremque expedita, necessitatibus
                soluta culpa velit officiis reprehenderit dolorem? Voluptatem
                explicabo, excepturi aliquid cumque doloribus temporibus
                reprehenderit officia dolore fugiat amet ut similique aliquam
                pariatur facilis? Deleniti ex consectetur a soluta iste amet
                veniam adipisci harum magnam ducimus autem quae omnis ipsam quia
                nesciunt libero repudiandae aliquid impedit at et mollitia, nisi
                ipsa. Ipsam alias, eius fugiat tempora reprehenderit id esse.
                Cumque laborum ex ducimus sequi tempora labore, voluptatibus
                debitis corrupti possimus quos laboriosam sint quis nulla? Ab
                velit, vel veniam minima reiciendis at incidunt eligendi ea
                voluptate odio consequuntur ut maiores magnam illo vitae
                laboriosam cumque sunt mollitia! Voluptatum, qui cum! Veritatis
                vitae qui libero reiciendis similique dicta possimus maiores
                officia quae recusandae. Cupiditate amet tempore laudantium
                quaerat dicta veniam unde asperiores recusandae optio accusamus.
                Dolores asperiores dolor obcaecati, vero quidem maiores magnam
                quaerat totam ratione corrupti corporis pariatur quo sint.
                Praesentium, eligendi voluptas sint quo, numquam dolore enim
                doloremque quam recusandae asperiores soluta labore adipisci
                reprehenderit delectus cum facilis ipsa, in impedit quae est
                laboriosam nobis culpa ad? Minus beatae, adipisci explicabo
                necessitatibus praesentium ea. Fugiat itaque repudiandae veniam
                nemo, perspiciatis dolores quaerat sapiente reiciendis, aut
                nihil numquam fugit, placeat laboriosam quam distinctio. Impedit
                rem placeat totam eaque, consequatur quibusdam reprehenderit
                quaerat in culpa autem. Incidunt illum ex sed debitis
                necessitatibus sunt porro aliquid numquam labore iure delectus
                minus quibusdam voluptatibus illo in nihil praesentium ut
                quisquam, nulla velit sequi eveniet perferendis maxime. Illum
                dignissimos modi, aliquam enim quis laudantium autem placeat.
                Cum deserunt, reprehenderit recusandae aliquid ullam soluta est
                earum fuga tempore impedit tenetur dolore ab inventore iusto
                vero asperiores reiciendis nisi sunt atque deleniti neque quo
                possimus ea! Nisi, dolores, enim, saepe laboriosam accusantium
                fugit amet dolore incidunt pariatur officia porro excepturi iure
                hic! Quos quidem consequuntur numquam eos dolor vero
                voluptatibus, dolorum vitae minima tempora accusantium ducimus
                magni, laboriosam minus sint dolorem quod debitis vel.
                Praesentium suscipit, harum laudantium molestiae iste eius et
                enim eos assumenda eum ipsum illo excepturi quibusdam minus,
                deserunt dolorem mollitia! Nulla a, enim neque quam similique
                velit odit quos iure sapiente earum. Corrupti ea doloribus culpa
                in assumenda voluptatibus perferendis sed reprehenderit soluta
                aut adipisci atque laborum illo et temporibus eos autem ducimus,
                esse iste officia cumque facere suscipit recusandae sequi.
                Assumenda molestiae nam quos, suscipit porro doloremque ea
                praesentium nesciunt commodi, dolorum labore ad. Ipsam,
                laudantium inventore, laborum, ea officiis sint accusamus
                necessitatibus sapiente itaque maiores blanditiis nisi explicabo
                sit nam. Ipsa dolores dolore et molestiae, libero exercitationem
                nihil voluptatibus repudiandae ratione vero asperiores quae
                nisi, totam placeat laudantium laboriosam voluptates
                praesentium. Quo ipsum corporis ducimus earum soluta sed labore
                quas, laboriosam consequuntur quisquam minima quis autem. Id,
                tempore quasi reprehenderit voluptate corrupti, amet at
                asperiores accusantium veritatis error maxime deserunt. Ipsam
                hic praesentium veniam ipsa similique. Repellat eos
                exercitationem incidunt eveniet ipsam reiciendis voluptate porro
                tempore tempora, rerum reprehenderit non ullam? Recusandae
                numquam nostrum itaque asperiores quas, laudantium reiciendis
                rem eius nulla qui. Harum ratione eos debitis sint, quo nihil
                vero adipisci numquam necessitatibus neque? Totam aperiam
                necessitatibus, dolorem facere recusandae provident nesciunt et
                quod omnis a similique sapiente reiciendis! Dolorum voluptas
                corrupti accusantium quidem dicta quia eum voluptatem voluptate
                provident cum sequi laboriosam praesentium optio inventore sed
                placeat voluptates aspernatur nisi, consequatur, fuga,
                perspiciatis natus ad harum. Necessitatibus consequuntur
                pariatur quisquam repudiandae hic cumque ratione, quo ullam
                nesciunt aperiam blanditiis facere atque id, illum obcaecati vel
                similique. Laboriosam quae mollitia cupiditate ducimus. Odit
                labore explicabo quisquam, laboriosam illum consequuntur
                molestiae possimus nihil non facilis earum amet aspernatur hic
                quod voluptate quas impedit veritatis ducimus pariatur veniam
                itaque ex eius quasi? Provident nihil placeat error? Dicta dolor
                sit amet, voluptatum quae quibusdam quo, sunt, iure ipsam nulla
                minus omnis animi nihil accusantium natus laboriosam blanditiis
                deleniti porro magni est doloribus suscipit ipsum laborum quam.
                Natus, dignissimos quo sed beatae eos eaque! Quos repellat
                exercitationem in laboriosam, neque ab perspiciatis molestias
                voluptates, velit cupiditate, reprehenderit saepe distinctio
                eaque reiciendis porro harum magnam. Esse dolore atque, magni
                eaque rem quae aliquam ducimus quod suscipit enim quidem optio
                alias illo iusto dicta veniam dolores iure hic. Modi
                perspiciatis nulla eum animi assumenda cupiditate in itaque.
                Ratione harum voluptate vitae cupiditate eaque incidunt
                dignissimos provident repellendus, soluta reiciendis ut natus,
                totam, neque fugiat laborum sint et ex vero beatae id! Voluptas
                architecto modi deserunt dolore officiis, corporis assumenda
                sapiente rerum tempora quaerat illo perspiciatis minus quidem,
                distinctio eaque aliquid aspernatur. Dolorum et ab delectus
                odit? Amet illum reprehenderit quisquam sequi rem laborum, iste
                natus nostrum, eius incidunt inventore, quos nisi repellendus
                sit sed quo dignissimos necessitatibus ipsa accusantium eum
                veniam sint eligendi aliquid vero. Assumenda totam dolor dolorem
                harum officia a id illo corrupti esse autem voluptatibus eaque
                iste molestiae quisquam tempore, quas illum ratione commodi in
                accusantium eum? Corrupti sapiente repellat suscipit, maiores
                nulla quam eius nobis qui perferendis amet totam illum,
                assumenda, sint quo provident beatae nesciunt cumque aspernatur
                in blanditiis at iure alias facere. Similique harum molestiae
                officia quidem iusto odit tenetur ea eaque, praesentium ipsa aut
                corporis ex numquam vel iste ducimus explicabo quam assumenda
                doloribus quos asperiores nesciunt. Nesciunt quia error, dolorum
                distinctio accusantium labore doloremque accusamus, autem,
                reiciendis sequi fugiat! Deleniti omnis ex porro neque deserunt
                labore culpa consequatur? Adipisci sunt quia eum aperiam
                obcaecati nulla esse eos, voluptates inventore libero nostrum
                nisi quidem laborum expedita exercitationem ratione iusto natus
                eligendi ducimus! Porro magnam cum ratione ducimus veritatis!
                Iusto excepturi, rerum dolor reiciendis distinctio, alias eius,
                dolores accusamus vitae deleniti praesentium autem debitis
                minima vero sed veritatis. Porro in sequi quisquam est ratione,
                id nostrum eaque. Tenetur voluptate hic soluta sed ratione iusto
                provident quaerat expedita dolore. Ad dignissimos beatae nam
                laudantium nostrum provident corporis rem, ullam ab minima!
                Animi saepe inventore tenetur esse deleniti quos, at unde autem,
                est culpa excepturi laborum laboriosam accusamus, ut fuga
                pariatur nemo sunt qui perferendis vel debitis. Saepe similique
                non porro labore, illum est in. Fuga est assumenda hic,
                voluptatum nihil mollitia molestiae inventore numquam eius
                necessitatibus iusto veritatis dicta sint sunt, blanditiis
                illum. Quidem reiciendis consectetur accusamus deserunt numquam
                ad, aliquid eaque repudiandae, commodi tempore, doloremque
                fugiat sed praesentium maxime? Fugiat, aut quidem. Expedita
                animi atque nulla labore ex sint, voluptatum illum blanditiis
                recusandae eos quisquam ipsa aliquid? Fuga placeat totam ipsum,
                neque, quod delectus expedita aliquam dicta sunt, nulla corporis
                pariatur fugiat inventore debitis! Iure aliquam debitis maiores
                ut nemo corporis sed consectetur recusandae. Rem consectetur
                aspernatur consequuntur asperiores totam ipsa, sed, quisquam
                dolore dicta accusamus blanditiis, reiciendis dolor et deserunt
                dolorum cum? Nam rerum recusandae, deleniti sapiente explicabo
                ea, est maxime fugit officia, culpa exercitationem mollitia!
                Eveniet distinctio quo, tenetur minus labore provident! Officia
                numquam vel itaque quia. Officiis, voluptatibus. Optio quibusdam
                eos sed velit laudantium? Nisi quibusdam doloribus excepturi
                sunt minus similique repudiandae hic adipisci harum velit
                facilis, placeat deserunt impedit fuga quaerat vel quasi ex
                possimus? Deserunt totam veniam temporibus praesentium quas
                tempore mollitia et, quo ipsum quisquam sed ad excepturi velit
                esse! Incidunt suscipit perspiciatis amet ducimus sit aut atque
                quis? Sit quis pariatur cupiditate, illo, doloribus esse sunt
                debitis ipsum eligendi deserunt eum aspernatur beatae, sequi et
                tempora ea! Distinctio sapiente unde deleniti quisquam nisi!
                Nisi fugit alias amet nam animi fugiat dolorum, veniam quos!
                Incidunt nulla rem veritatis quisquam sed facilis. Earum
                explicabo quia qui ipsam rerum impedit ducimus cum et aliquam,
                perferendis in itaque nisi consequatur ipsum autem tempora
                fugiat, necessitatibus aperiam dicta temporibus! Dolorum quam,
                est inventore impedit quisquam aspernatur voluptas vitae
                accusantium eos excepturi deserunt, cumque pariatur veniam
                perferendis? Voluptas ex pariatur eaque eius fugiat commodi
                explicabo ad soluta maiores eligendi necessitatibus nisi magni
                molestiae atque hic dolorum, debitis ipsam autem. Quam nihil,
                nostrum quos a beatae, repellat excepturi est modi architecto
                quaerat quidem officiis qui sit amet iusto quo repellendus hic.
                Repudiandae reprehenderit commodi ullam quae corrupti quo,
                repellat ab, sed consequuntur pariatur deleniti ducimus sint
                distinctio sunt ea nulla. Quasi enim temporibus dolore vitae at
                mollitia voluptas magnam nihil. Nisi quis recusandae quidem
                placeat. Possimus iusto nostrum rerum voluptates totam?
                Obcaecati reprehenderit magnam tempora debitis neque impedit a
                ex explicabo necessitatibus omnis porro soluta esse beatae
                fugiat minima, aspernatur laboriosam iure error totam qui
                molestiae distinctio. Aliquid sunt pariatur perferendis ex
                officia eos similique voluptatum assumenda, explicabo cupiditate
                perspiciatis vel nobis totam ea enim molestiae fuga, possimus
                atque, cum asperiores. Illum rem vel voluptatibus iure ipsum
                dolores quia porro facilis, accusantium ea! Quos ipsam
                blanditiis odit, inventore voluptate dolores laborum nihil id
                rerum facilis error veniam cupiditate totam fugit natus
                molestiae placeat tenetur? Illum odit dignissimos sunt dolorem
                voluptas eius enim vero inventore harum. Architecto alias
                perferendis ducimus eius qui at natus quam asperiores similique,
                fuga necessitatibus esse quasi nesciunt dignissimos, velit eaque
                veritatis tempore atque optio praesentium? Inventore distinctio
                aspernatur, placeat totam veniam qui labore aperiam sint ex
                asperiores assumenda accusantium nostrum voluptatem hic eos
                dolore sit. Excepturi quam corporis dolores necessitatibus
                consectetur modi fugiat fugit commodi enim, magnam sed sequi
                quis eum corrupti tempore? Non maxime assumenda pariatur culpa
                totam ad consequuntur nam, porro quos, excepturi dolorum eius?
                Doloremque sapiente reprehenderit id! Numquam molestiae ex
                consequatur laboriosam nesciunt atque, aliquid tempore
                voluptatum, ad et doloremque assumenda vel inventore id debitis
                vitae nostrum ipsam necessitatibus? Quas expedita, obcaecati
                voluptatibus aspernatur aperiam officiis dolores soluta impedit
                voluptates. Soluta cumque culpa earum reprehenderit facilis,
                eveniet cum inventore ipsam quibusdam porro repellendus quo
                minima sit, facere aperiam, dolor natus voluptates ratione harum
                nihil commodi vero. Beatae, dolores, facere et sit natus,
                aspernatur similique commodi odit repellat ducimus debitis enim
                eaque cum repellendus perspiciatis ut in eius accusantium
                pariatur qui doloribus earum placeat nihil? Minus rem expedita
                velit omnis eveniet commodi inventore, nemo accusamus
                consequatur blanditiis, dignissimos nam repellendus placeat
                magni corporis quasi voluptatum quis. Odit, exercitationem
                adipisci? Facere incidunt voluptas ipsam atque expedita, illum
                odio officiis, dolore repudiandae adipisci dolores architecto
                iusto rem suscipit. Repudiandae minus quod excepturi natus
                eligendi impedit placeat. Ea veniam recusandae explicabo porro
                ut, tempora dolorum voluptates doloremque? Officiis aliquam nam
                exercitationem dolore commodi minima illo quod omnis nihil quos.
                Repudiandae vero at praesentium reprehenderit eos tempore eum
                quod nesciunt reiciendis iste, ad necessitatibus. Magni
                voluptatibus vitae accusamus veniam necessitatibus
                exercitationem iusto quo laboriosam corrupti ullam nam, magnam
                esse architecto animi expedita odit ipsam placeat, rerum
                adipisci fuga quod. Exercitationem tempora earum aliquam labore
                molestias maxime debitis, eum quisquam neque voluptate, suscipit
                error facilis expedita a recusandae eaque esse! Harum vero
                quibusdam, architecto unde laborum nisi rem tempore voluptatem,
                animi ea voluptate qui? Maiores natus asperiores voluptatum
                numquam aliquid beatae repellendus? Consequatur voluptatibus
                fuga deserunt debitis labore maiores accusamus ab unde facere
                explicabo suscipit assumenda eveniet, quia maxime magni omnis
                accusantium aspernatur quos saepe qui. Fugiat deleniti odio
                consequatur et cum ducimus earum perspiciatis quis nisi quam
                iste impedit repellat corporis, explicabo voluptate fuga quas
                quos id. Aut architecto enim eum dignissimos a laboriosam,
                dolorem iusto excepturi cumque, repellendus beatae molestiae
                dolorum ex voluptate accusantium eius nobis esse officia rerum
                aspernatur, eveniet dolores? Obcaecati possimus illum soluta,
                ipsa ex fugiat esse, facere unde amet deleniti consectetur enim
                architecto quas hic pariatur dicta. Quaerat nam placeat
                asperiores temporibus veritatis totam perferendis mollitia quos
                voluptates labore quibusdam repudiandae magnam beatae neque
                adipisci ut, iste aperiam unde quia tempora veniam quis.
                Blanditiis, exercitationem architecto hic voluptate asperiores
                numquam nemo accusantium modi delectus, molestiae eveniet
                inventore? Consequuntur, consequatur nobis quis commodi animi
                voluptates illum quibusdam placeat eius recusandae nemo
                exercitationem molestias mollitia enim. Ipsa, quis!
              </span>
            </p>
          </div>
        </>
      }
      footer={
        <>
          <Button
            variant="bordered"
            onPress={onClose}
            size="sm"
            className="border-[#E8E4DC] text-[#555550] h-9 text-[0.81rem]"
          >
            Annuler
          </Button>
          <Button
            color="primary"
            size="sm"
            className="h-9 text-[0.81rem]"
            onPress={() => {
              toast.success({
                title: "Commande créée",
                description: "CMD-013 — Client — 150 DH",
              });
              onClose();
            }}
          >
            Créer la commande
          </Button>
        </>
      }
    >
      <>
        <div className="grid grid-cols-2 gap-3.5">
          <Input
            label="Nom du client"
            placeholder="ex. Fatima Zahra"
            size="sm"
            variant="bordered"
            classNames={inputCls}
            labelPlacement="outside"
          />
          <Input
            label="Téléphone"
            placeholder="06 XX XX XX XX"
            size="sm"
            variant="bordered"
            classNames={inputCls}
            labelPlacement="outside"
          />
          <Select
            label="Ville"
            size="sm"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              trigger:
                "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] shadow-none",
              label:
                "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
            }}
          >
            <SelectItem key="casa">Casablanca</SelectItem>
            <SelectItem key="rabat">Rabat</SelectItem>
            <SelectItem key="marrakech">Marrakech</SelectItem>
            <SelectItem key="fes">Fès</SelectItem>
          </Select>
          <Select
            label="Créneau de livraison"
            size="sm"
            variant="bordered"
            labelPlacement="outside"
            classNames={{
              trigger:
                "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] shadow-none",
              label:
                "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
            }}
          >
            <SelectItem key="morning">Matin 8h–12h</SelectItem>
            <SelectItem key="afternoon">Après-midi 12h–18h</SelectItem>
            <SelectItem key="evening">Soir 18h–21h</SelectItem>
          </Select>
          <Textarea
            label="Adresse complète"
            placeholder="N° rue, quartier, ville…"
            size="sm"
            variant="bordered"
            minRows={2}
            className="col-span-2"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] shadow-none",
              label:
                "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
              input: "text-[0.83rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]",
            }}
          />
        </div>
      </>
    </Modal>
  );
}

// ============================================================
// KANBAN BOARD
// ============================================================
export function KanbanBoard() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
      {KANBAN_COLUMNS.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-[272px]">
          {/* Column header */}
          <div className="flex items-center justify-between mb-3 px-0.5">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: col.color }}
              />
              <span className="text-[0.8rem] font-semibold text-[#2C2C2C]">
                {col.title}
              </span>
              <span
                className="text-[0.63rem] font-bold px-1.5 py-[2px] rounded-full"
                style={{ background: col.color + "20", color: col.color }}
              >
                {col.cards.length}
              </span>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              aria-label="Ajouter"
              className="w-6 h-6 min-w-6 text-[#888880] hover:text-[#2D5A3D] hover:bg-[#E8F0E8]"
            >
              <Plus size={13} />
            </Button>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-2.5">
            {col.cards.map((card) => {
              const pri = PRIORITY_CFG[card.priority];
              return (
                <div
                  key={card.id}
                  className="bg-white border border-[#E8E4DC] rounded-xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-px transition-all duration-150 cursor-grab active:cursor-grabbing group"
                >
                  {/* Tag row */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="text-[0.62rem] font-semibold px-2 py-[3px] rounded-full"
                      style={{
                        background: card.tagColor + "18",
                        color: card.tagColor,
                      }}
                    >
                      {card.tag}
                    </span>
                    <span
                      className="text-[0.59rem] font-semibold px-1.5 py-[2px] rounded-full"
                      style={{ background: pri.bg, color: pri.color }}
                    >
                      {pri.label}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-[0.82rem] font-medium text-[#2C2C2C] leading-snug mb-3">
                    {card.title}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[#888880]">
                      <span className="flex items-center gap-1 text-[0.65rem]">
                        <Timer size={10} />
                        {card.dueDate}
                      </span>
                      {card.comments && (
                        <span className="flex items-center gap-1 text-[0.65rem]">
                          <MessageSquare size={10} />
                          {card.comments}
                        </span>
                      )}
                    </div>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[0.59rem] font-bold text-white flex-shrink-0"
                      style={{ background: "#2D5A3D" }}
                    >
                      {card.assignee}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add card */}
            <button className="w-full border border-dashed border-[#D8D4CC] rounded-xl py-2.5 text-[0.74rem] text-[#888880] hover:border-[#2D5A3D] hover:text-[#2D5A3D] hover:bg-[#F2F7F2] transition-all flex items-center justify-center gap-1.5">
              <Plus size={12} />
              Ajouter une carte
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// SECTION LABEL
// ============================================================
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[0.59rem] font-semibold tracking-[0.18em] uppercase text-[#888880] flex-shrink-0">
          {label}
        </span>
        <div className="flex-1 h-px bg-[#E8E4DC]" />
      </div>
      {children}
    </div>
  );
}

// ============================================================
// BUTTONS SHOWCASE
// ============================================================
function ButtonsShowcase() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          Variants — Primary
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button color="primary" variant="solid" size="md">
            Solid
          </Button>
          <Button color="primary" variant="flat" size="md">
            Flat
          </Button>
          <Button color="primary" variant="bordered" size="md">
            Bordered
          </Button>
          <Button color="primary" variant="ghost" size="md">
            Ghost
          </Button>
          <Button color="primary" variant="light" size="md">
            Light
          </Button>
          <Button color="primary" variant="faded" size="md">
            Faded
          </Button>
        </div>
      </div>

      <Divider className="bg-[#E8E4DC]" />

      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          Colors — Solid
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button color="primary" variant="solid" size="md">
            Primary
          </Button>
          <Button color="secondary" variant="solid" size="md">
            Secondary
          </Button>
          <Button color="danger" variant="solid" size="md">
            Danger
          </Button>
          <Button color="warning" variant="solid" size="md">
            Warning
          </Button>
          <Button color="success" variant="solid" size="md">
            Success
          </Button>
          <Button color="default" variant="solid" size="md">
            Default
          </Button>
        </div>
      </div>

      <Divider className="bg-[#E8E4DC]" />

      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          Sizes
        </p>
        <div className="flex items-end gap-3 flex-wrap">
          <Button color="primary" size="sm">
            Small
          </Button>
          <Button color="primary" size="md">
            Medium
          </Button>
          <Button color="primary" size="lg">
            Large
          </Button>
        </div>
      </div>

      <Divider className="bg-[#E8E4DC]" />

      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          With Icons & States
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Button color="primary" size="md" startContent={<Plus size={14} />}>
            Ajouter
          </Button>
          <Button
            color="primary"
            size="md"
            variant="bordered"
            endContent={<Download size={14} />}
          >
            Exporter
          </Button>
          <Button
            color="danger"
            size="md"
            variant="flat"
            startContent={<Trash2 size={14} />}
          >
            Supprimer
          </Button>
          <Button
            color="secondary"
            size="md"
            variant="flat"
            startContent={<CheckCircle size={14} />}
          >
            Confirmer
          </Button>
          <Button
            isIconOnly
            color="primary"
            variant="flat"
            size="md"
            aria-label="Settings"
          >
            <Settings size={15} />
          </Button>
          <Button
            isIconOnly
            color="default"
            variant="bordered"
            size="md"
            aria-label="Bell"
          >
            <Bell size={15} />
          </Button>
          <Button
            isIconOnly
            color="danger"
            variant="flat"
            size="md"
            aria-label="Trash"
          >
            <Trash2 size={15} />
          </Button>
          <Button isLoading color="primary" size="md">
            Chargement…
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CHIPS SHOWCASE
// ============================================================
function ChipsShowcase() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          Status Chips
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(STATUS_CFG) as OrderStatus[]).map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
      </div>

      <Divider className="bg-[#E8E4DC]" />

      <div>
        <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3">
          Chip Variants
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip color="primary" variant="solid" size="sm">
            Solid
          </Chip>
          <Chip color="primary" variant="flat" size="sm">
            Flat
          </Chip>
          <Chip color="primary" variant="bordered" size="sm">
            Bordered
          </Chip>
          <Chip color="primary" variant="dot" size="sm">
            Dot
          </Chip>
          <Chip color="secondary" variant="flat" size="sm">
            Orange
          </Chip>
          <Chip color="danger" variant="flat" size="sm">
            Danger
          </Chip>
          <Chip color="warning" variant="flat" size="sm">
            Warning
          </Chip>
          <Chip color="success" variant="flat" size="sm">
            Success
          </Chip>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT PAGE
// ============================================================
export default function ComponentsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: openConfirm,
    onClose: closeConfirm,
  } = useDisclosure();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const sw = sidebarCollapsed ? 64 : 240;
  const changeFilters = (
    name: keyof typeof filters,
    value: number | string,
  ) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };
  return (
    <div
      className="min-h-screen bg-[#FAF8F5] flex"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* ── Google Fonts + Global Keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes toastIn { from { transform: translateX(18px); opacity: 0; } to { transform: none; opacity: 1; } }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C8C8C0; border-radius: 99px; }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ── Main ── */}
      <main
        className="flex-1 flex flex-col transition-[margin] duration-300"
        style={{ marginLeft: sw }}
      >
        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-[#E8E4DC] px-7 flex items-center justify-between sticky top-0 z-[100]">
          <nav className="flex items-center gap-1.5 text-[0.77rem] text-[#888880]">
            <span className="hover:text-[#2D5A3D] transition-colors cursor-pointer">
              Dashboard
            </span>
            <span className="text-[#C8C8C0]">/</span>
            <span className="text-[#2C2C2C] font-medium">Composants</span>
          </nav>
          <div className="flex items-center gap-2.5">
            <Tooltip
              content="Notifications"
              classNames={{ content: "text-[0.73rem]" }}
            >
              <button className="w-[34px] h-[34px] rounded-lg border border-[#E8E4DC] flex items-center justify-center text-[#555550] hover:border-[#2D5A3D] hover:text-[#2D5A3D] transition-all relative">
                <Bell size={15} />
                <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full bg-[#D4883C] border-2 border-white" />
              </button>
            </Tooltip>
            <Avatar
              name="YT"
              size="sm"
              className="bg-[#2D5A3D] text-white text-[0.71rem] font-semibold"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-7 max-w-[1280px] w-full mx-auto">
          <PageHeader
            title="Design System"
            description="Composants UI — Ferme Beldi × HeroUI v2.8"
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Commandes" },
            ]}
            actions={
              <>
                <Button
                  size="sm"
                  variant="bordered"
                  startContent={<RefreshCw size={12} />}
                  className="border-[#E8E4DC] text-[#555550] h-9 text-[0.78rem]"
                >
                  Actualiser
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  startContent={<Plus size={12} />}
                  className="h-9 text-[0.78rem]"
                  onPress={openModal}
                >
                  Nouveau
                </Button>
              </>
            }
          />

          {/* ── 01 Buttons ── */}
          <Section label="01 — Buttons">
            <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
              <ButtonsShowcase />
            </div>
          </Section>

          {/* ── 02 Status Chips ── */}
          <Section label="02 — Status Chips & Badges">
            <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
              <ChipsShowcase />
            </div>
          </Section>

          {/* ── 03 Data Table ── */}
          <Section label="03 — Data Table  ·  Filters  ·  Pagination  ·  Page Size  ·  Bulk Actions  ·  Row Actions">
            {/* <DataTable addToast={addToast} /> */}
            <DataTable
              label="Produits Ferme Beldi"
              columns={TABLE_COLS}
              rows={MOCK_ORDERS.slice(
                (filters.page - 1) * filters.pageSize,
                (filters.page - 1) * filters.pageSize + filters.pageSize,
              )}
              search={{
                value: filters.searchQuery,
                onChange(value) {
                  changeFilters("searchQuery", value);
                },
              }}
              withPagination={{
                page: filters.page,
                pageSize: filters.pageSize,
                numOfPages: Math.ceil(MOCK_ORDERS.length / filters.pageSize),
                onPageChange(page) {
                  changeFilters("page", page);
                },
                onPageSizeChange(size) {
                  changeFilters("pageSize", size);
                },
                total: MOCK_ORDERS.length,
              }}
              showRowCount
              topActions={
                <>
                  <Button
                    color="default"
                    variant="bordered"
                    startContent={<Filter size={13} />}
                  >
                    Filtres
                  </Button>
                  <Button color="primary" startContent={<Plus size={13} />}>
                    Ajouter
                  </Button>
                </>
              }
            />
          </Section>

          {/* ── 04 Toasts + Modal + Confirm ── */}
          <Section label="04 — Toasts  ·  Modal  ·  Confirm Dialog">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Toasts */}
              <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
                <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-3.5">
                  Toasts
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    startContent={<CheckCircle2 size={13} />}
                    onPress={() =>
                      toast.success({
                        title: "Produit enregistré",
                        description: "Œufs Fermiers Beldi mis à jour",
                      })
                    }
                  >
                    Success
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    startContent={<XCircle size={13} />}
                    onPress={() =>
                      toast.error({
                        title: "Erreur de connexion",
                        description: "Impossible de joindre le serveur",
                      })
                    }
                  >
                    Error
                  </Button>
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    startContent={<AlertTriangle size={13} />}
                    onPress={() =>
                      toast.warning({
                        title: "Stock critique",
                        description: "Lait Frais — moins de 15 unités",
                      })
                    }
                  >
                    Warning
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() =>
                      toast.info({
                        title: "Mise à jour disponible",
                        description: "v2.1.0 prête à installer",
                      })
                    }
                  >
                    Info
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    size="sm"
                    onPress={() =>
                      toast.loading({
                        title: "Export en cours…",
                        description: "Génération du fichier CSV",
                      })
                    }
                  >
                    Loading
                  </Button>
                  <Button
                    color="default"
                    size="sm"
                    variant="bordered"
                    onPress={() => toast.saved("Commande")}
                  >
                    toast.saved()
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    variant="bordered"
                    onPress={() => toast.apiError()}
                  >
                    toast.apiError()
                  </Button>
                </div>
              </div>

              {/* Modal */}
              <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm flex flex-col">
                <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-1.5">
                  Modal avec Blur
                </p>
                <p className="text-[0.78rem] text-[#555550] font-light leading-relaxed flex-1">
                  Modal avec backdrop flouté, formulaire structuré et gestion
                  des champs obligatoires.
                </p>
                <Button
                  color="primary"
                  size="sm"
                  className="mt-4 text-[0.8rem] h-9"
                  startContent={<Plus size={13} />}
                  onPress={openModal}
                >
                  Ouvrir la Modal
                </Button>
              </div>

              {/* Confirm */}
              <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm flex flex-col">
                <p className="text-[0.7rem] font-semibold text-[#888880] tracking-wide mb-1.5">
                  Confirm Dialog
                </p>
                <p className="text-[0.78rem] text-[#555550] font-light leading-relaxed flex-1">
                  Dialog contextuel avec icône et variantes{" "}
                  <strong className="font-medium text-[#C44B3C]">danger</strong>{" "}
                  /{" "}
                  <strong className="font-medium text-[#2D5A3D]">
                    primaire
                  </strong>
                  .
                </p>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  className="mt-4 text-[0.8rem] h-9"
                  startContent={<Trash2 size={13} />}
                  onPress={openConfirm}
                >
                  Supprimer (Confirm)
                </Button>
              </div>
            </div>
          </Section>

          {/* ── 05 Kanban ── */}
          {/* <Section label="05 — Kanban Board  ·  Page Header">
            <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
              <PageHeader
                title="Gestion de projet"
                description={`${KANBAN_COLUMNS.reduce((s, c) => s + c.cards.length, 0)} tâches actives`}
                breadcrumbs={["Dashboard", "Projet"]}
                actions={
                  <>
                    <Button
                      size="sm"
                      variant="bordered"
                      startContent={<SlidersHorizontal size={12} />}
                      className="border-[#E8E4DC] text-[#555550] h-9 text-[0.78rem]"
                    >
                      Filtrer
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      startContent={<Plus size={12} />}
                      className="h-9 text-[0.78rem]"
                    >
                      Nouvelle tâche
                    </Button>
                  </>
                }
              />
              <KanbanBoard />
            </div>
          </Section> */}
        </div>
      </main>

      {/* ── Overlays ── */}
      <ToastStack toasts={toasts} remove={removeToast} />

      <CustomModal isOpen={isModalOpen} onClose={closeModal} />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onConfirm={() =>
          toast.success({
            title: "Supprimé",
            description: "La commande a été définitivement supprimée",
          })
        }
        title="Supprimer la commande ?"
        description="Cette action est irréversible. La commande CMD-001 et toutes ses données associées seront définitivement supprimées du système."
        confirmLabel="Oui, supprimer"
        variant="danger"
      />
    </div>
  );
}
