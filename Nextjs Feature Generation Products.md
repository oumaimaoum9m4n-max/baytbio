# Feature Generation Guide (Next.js + API + Actions + HeroUI)

## Purpose

Generate a full feature module using:

- Next.js App Router (API routes)
- React Query
- Actions (server logic + mongoose)
- DTO + Zod
- Hero UI (Table + Pagination + Inputs)
- SSR with Hydration

🚨 Follow this EXACTLY. No improvisation.

---

# 🧱 1. Architecture

## 🔹 Global API Layer (App Router)

```bash
app/api/{feature}s/
├── route.ts
└── [id]/route.ts
```

## 🔹 Feature Structure

```bash
features/{feature}s/
│
├── components/
├── apis/
├── actions/
├── types/
├── utils/
```

---

# 🧾 2. TYPES (DTO + ZOD)

## types/{feature}.dto.ts

```ts
import { z } from "zod";

export const CreateOrUpdateProductSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export type CreateOrUpdateProductDto = z.infer<
  typeof CreateOrUpdateProductSchema
>;

export type GetAllProductsDto = {
  id: number;
  name: string;
  price: number;
};

export type GetSingleProductDto = GetAllProductsDto;
```

## types/{feature}.ts (entity type)

```ts
export type Product = {
  id: number;
  name: string;
  price: number;
};
```

---

# 🛠️ 3. UTILS

## utils/{feature}.utils.ts

> ⚠️ Utils live in `features/{feature}/utils/`, NOT in `types/`.

```ts
export const toProductDto = (product: any) => ({
  id: product._id,
  name: product.name,
  price: product.price,
});
```

---

# ⚙️ 4. ACTIONS (SERVER LOGIC + MONGOOSE)

## actions/{feature}.model.ts

```ts
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
```

## actions/{feature}.router.ts

```ts
import { ProductModel } from "./product.model";
import { toProductDto } from "../utils/product.utils";

export const productRouter = {
  async getAll({ page, size, search }) {
    const query = {
      name: { $regex: search, $options: "i" },
    };

    const data = await ProductModel.find(query)
      .skip(page * size)
      .limit(size);

    const total = await ProductModel.countDocuments(query);

    return {
      data: data.map(toProductDto),
      total,
    };
  },

  async getById(id: number) {
    const product = await ProductModel.findById(id);
    return toProductDto(product);
  },

  async create(input) {
    await ProductModel.create(input);
    return { success: true };
  },

  async update(id: number, input) {
    await ProductModel.findByIdAndUpdate(id, input);
    return { success: true };
  },
};
```

---

# 🌐 5. API ROUTES

## app/api/{feature}s/route.ts

```ts
import { NextResponse } from "next/server";
import { productRouter } from "@/features/product/actions/product.router";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const search = url.searchParams.get("s") || "";

  const data = await productRouter.getAll({ page, size, search });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const res = await productRouter.create(body);
  return NextResponse.json({ msg: "Product created successfully" });
}
```

## app/api/{feature}s/[id]/route.ts

```ts
import { NextResponse } from "next/server";
import { productRouter } from "@/features/product/actions/product.router";

export async function GET(_: Request, { params }) {
  const data = await productRouter.getById(Number(params.id));
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }) {
  const body = await req.json();
  const res = await productRouter.update(Number(params.id), body);
  return NextResponse.json({ msg: "Product updated successfully" });
}
```

---

# 🔌 6. FEATURE APIs (React Query)

## apis/getAll{Feature}s.ts

```ts
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { PaginatedData } from "../../../utils/types";

export const getAllProducts = async (
  page = 0,
  size = 10,
  search = "",
): Promise<PaginatedData<Product>> => {
  const res = await customFetch.get(
    `/products?page=${page}&size=${size}&s=${encodeURIComponent(search)}`,
  );
  return res.data;
};

export const useGetAllProducts = (
  page: number,
  size: number,
  search: string,
) => {
  return useQuery({
    queryKey: ["products", page, size, search],
    queryFn: () => getAllProducts(page, size, search),
  });
};
```

## apis/getSingle{Feature}s.ts

```ts
import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { PaginatedData } from "../../../utils/types";

export const getSingleProduct = async (
  productId: number,
): Promise<PaginatedData<Product>> => {
  const res = await customFetch.get(`/products/${productId}`);
  return res.data;
};

export const useGetSingleProduct = (productId: number) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getSingleProduct(productId),
  });
};
```

## apis/create{Feature}.ts

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import { MutationResponse } from "@/utils/types";
import { CreateOrUpdateProductDto } from "../types/product.dto";

export const createProduct = async (
  product: CreateOrUpdateProductDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/products`, product);
  return res.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
```

## apis/update{Feature}.ts

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import { MutationResponse } from "@/utils/types";
import { Product } from "../types/product";

export const updateProduct = async (
  product: Product,
): Promise<MutationResponse> => {
  const res = await customFetch.put(`/products/${product.id}`, product);
  return res.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
```

---

# 🧩 7. COMPONENTS

## components/{Feature}sList.tsx (DataTable)

> ✅ Uses the shared `DataTable` component — search, pagination, and page-size are all controlled externally
> ✅ Columns defined once as a constant; `render` handles custom cells

```tsx
"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { DataTable, TableActions, toast, type Column } from "@/components/ui";
import { useGetAllProducts } from "../apis/getAllProducts";
import type { Product } from "../types";

const COLUMNS: Column<Product>[] = [
  { key: "name", label: "NAME" },
  { key: "price", label: "PRICE", render: (v) => `${v} DH` },
  {
    key: "actions",
    label: "",
    render: (_, row) => (
      <TableActions
        onAction={(key) => {
          if (key === "edit")
            window.location.href = `/products/${row.id}/update-product`;
          if (key === "delete")
            toast.warning({
              title: "Supprimer",
              description: `${row.name} — action simulée`,
            });
        }}
      />
    ),
  },
];

const ProductsList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    searchQuery: "",
  });
  const [debouncedSearchQuery] = useDebounce(filters.searchQuery, 500);

  const { data, isLoading } = useGetAllProducts(
    filters.page - 1,
    filters.pageSize,
    debouncedSearchQuery,
  );

  const changeFilters = (name: keyof typeof filters, value: number | string) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  return (
    <DataTable
      label="Products"
      columns={COLUMNS}
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
        total: data?.total,
        onPageChange: (page) => changeFilters("page", page),
        onPageSizeChange: (size) => changeFilters("pageSize", size),
      }}
      topActions={
        <Button
          as="a"
          href="/products/add-product"
          color="primary"
          startContent={<Plus size={13} />}
        >
          Add Product
        </Button>
      }
    />
  );
};

export default ProductsList;
```

## components/{Feature}Details.tsx

```tsx
const ProductDetails = ({ product }) => {
  return (
    <div className="flex flex-col gap-2">
      <span>Name: {product.name}</span>
      <span>Price: {product.price}</span>
    </div>
  );
};

export default ProductDetails;
```

## components/{Feature}Form.tsx (RHF + ZOD + HeroUI)

> ✅ Form is UI only — no mutation logic inside
> ✅ `onSubmit`, `isPending`, `defaultValues` are always passed as props

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateOrUpdateProductSchema,
  CreateOrUpdateProductDto,
} from "../types/product.dto";

type Props = {
  onSubmit: (data: CreateOrUpdateProductDto) => void;
  isPending: boolean;
  defaultValues?: Partial<CreateOrUpdateProductDto>;
};

const ProductForm = ({ onSubmit, isPending, defaultValues }: Props) => {
  const { control, trigger, handleSubmit } = useForm<CreateOrUpdateProductDto>({
    resolver: zodResolver(CreateOrUpdateProductSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormInput
        type="text"
        control={control}
        name="name"
        label="Name"
        trigger={trigger}
      />
      <FormInput
        type="text"
        control={control}
        name="price"
        label="Price"
        trigger={trigger}
      />

      <Button type="submit" isLoading={isPending}>
        Save
      </Button>
    </form>
  );
};

export default ProductForm;
```

---

# 8. SSR PAGE (CRITICAL — ALWAYS DO THIS)

## app/dashboard/{feature}s/page.tsx

> ✅ ALWAYS prefetch with `{feature}Router` directly (not via HTTP)
> ✅ ALWAYS match `queryKey` between SSR prefetch and client `useQuery`
> ✅ ALWAYS wrap with `HydrationBoundary`
> ✅ ALWAYS include `PageHeader` with title, description, breadcrumbs
> ✅ The Add button lives in `PageHeader`, NOT inside the DataTable `topActions`

```tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { productRouter } from "@/features/products/actions/product.router";
import ProductsList from "@/features/products/components/ProductsList";
import { PageHeader } from "@/components/ui";

export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products", 0, 10, "", ""],
    queryFn: () =>
      productRouter.getAll({ page: 0, size: 10, search: "", sort: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Produits"
          description="Gérez et publiez les produits de la boutique"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Produits" },
          ]}
          actions={
            <Button
              as={Link}
              href="/dashboard/products/add-product"
              color="primary"
              size="sm"
              startContent={<Plus size={13} />}
              className="h-9 text-[0.81rem]"
            >
              Ajouter un produit
            </Button>
          }
        />
        <ProductsList />
      </div>
    </HydrationBoundary>
  );
}
```

---

# 9. ADD PAGE

## app/dashboard/{feature}s/add-{feature}/page.tsx

```tsx
"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/features/products/components/ProductForm";
import { useCreateProduct } from "@/features/products/apis/createProduct";
import type { CreateOrUpdateProductDto } from "@/features/products/types/product.dto";

export default function AddProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  const handleSubmit = async (data: CreateOrUpdateProductDto) => {
    await mutateAsync(data);
    router.push("/dashboard/products");
  };

  return <ProductForm onSubmit={handleSubmit} isSubmitting={isPending} />;
}
```

---

# 10. UPDATE PAGE

## app/dashboard/{feature}s/[id]/update-{feature}/page.tsx

```tsx
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import ProductForm from "@/features/products/components/ProductForm";
import { useGetSingleProduct } from "@/features/products/apis/getSingleProduct";
import { useUpdateProduct } from "@/features/products/apis/updateProduct";
import type { CreateOrUpdateProductDto } from "@/features/products/types/product.dto";

export default function UpdateProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading } = useGetSingleProduct(id);
  const { mutateAsync, isPending } = useUpdateProduct();

  const handleSubmit = async (data: CreateOrUpdateProductDto) => {
    await mutateAsync({ ...data, id });
    router.push("/dashboard/products");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      defaultValues={product}
    />
  );
}
```

---

# FINAL RULES (NON-NEGOTIABLE)

- Always use **API routes** (shared backend layer)
- Always use **actions** (DB/mongoose logic, never in API routes directly)
- Always use **feature APIs** (React Query hooks, never fetch in components)
- **ALWAYS** implement SSR with `HydrationBoundary` + `prefetchQuery`
- **ALWAYS** match `queryKey` between SSR prefetch and client `useQuery`
- **ALWAYS** use `DataTable` from `@/components/ui` — never raw HeroUI `Table`
- **ALWAYS** implement pagination + search in list components
- **ALWAYS** add `PageHeader` from `@/components/ui` at the top of list pages — with title, description, breadcrumbs, and an Add button in `actions`
- **NEVER** put the Add button inside `DataTable` `topActions` — it belongs in `PageHeader`
- **NEVER** use emoji/character icons in UI code — always use lucide-react icons
- The dashboard layout is `DashboardLayout` from `@/components/DashboardLayout` — `app/dashboard/layout.tsx` must import and use it
- `FormSection` icon prop is `React.ReactNode` — always pass a lucide icon, never a string emoji
- `Form` component prop is `isSubmitting` (not `isPending`)
- `Form` component = UI only (RHF + Zod, no mutation logic)
- Pages = logic only (mutations, routing, passing props to Form)
- `useCreateProduct` and `useUpdateProduct` both accept `mutateAsync`
- `invalidateQueries` must always use the base `queryKey` (e.g. `["products"]`)
- **ALWAYS** use French labels, fields in English

---

# Checklist — Every Feature Must Have

| File                                                      | Done                                         |
| --------------------------------------------------------- | -------------------------------------------- |
| `types/{feature}.dto.ts`                                  | Zod schema + inferred types                  |
| `types/{feature}.ts`                                      | Entity type                                  |
| `utils/{feature}.utils.ts`                                | `toDto` mapper                               |
| `actions/{feature}.model.ts`                              | Mongoose model                               |
| `actions/{feature}.router.ts`                             | DB logic (getAll, getById, create, update)   |
| `app/api/{feature}s/route.ts`                             | GET (list) + POST                            |
| `app/api/{feature}s/[id]/route.ts`                        | GET (single) + PUT                           |
| `apis/getAll{Feature}s.ts`                                | Query hook                                   |
| `apis/getSingle{Feature}.ts`                              | Query hook                                   |
| `apis/create{Feature}.ts`                                 | Mutation hook                                |
| `apis/update{Feature}.ts`                                 | Mutation hook                                |
| `components/{Feature}List.tsx`                            | Table + Pagination + Search                  |
| `components/{Feature}Form.tsx`                            | RHF + Zod + HeroUI inputs                    |
| `components/{Feature}Details.tsx`                         | Read-only display                            |
| `app/dashboard/{feature}s/page.tsx`                       | SSR page with HydrationBoundary + PageHeader |
| `app/dashboard/{feature}s/add-{feature}/page.tsx`         | Add page                                     |
| `app/dashboard/{feature}s/[id]/update-{feature}/page.tsx` | Update page                                  |
