"use client";

import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  type InputProps,
  type TextAreaProps,
  type SelectProps,
  type CheckboxProps,
} from "@heroui/react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type UseFormTrigger,
} from "react-hook-form";

/* ══════════════════════════════════════════
   SHARED DESIGN TOKENS (matches ComponentsPage.tsx)
══════════════════════════════════════════ */
const INPUT_CLS = {
  inputWrapper:
    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] shadow-none",
  label:
    "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
  input: "text-[0.83rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]",
  errorMessage: "text-[0.72rem] text-[#C44B3C] mt-0.5",
};

const SELECT_CLS = {
  trigger:
    "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] data-[open=true]:border-[#2D5A3D] shadow-none",
  label:
    "text-[0.7rem] tracking-[0.09em] uppercase font-semibold text-[#555550]",
  value: "text-[0.83rem] text-[#2C2C2C]",
  errorMessage: "text-[0.72rem] text-[#C44B3C] mt-0.5",
};

/* ══════════════════════════════════════════
   OPTION TYPE
══════════════════════════════════════════ */
export interface SelectOption {
  key: string;
  label: string;
}

/* ══════════════════════════════════════════
   PROP TYPES
══════════════════════════════════════════ */
type BaseProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  trigger?: UseFormTrigger<T>;
  autoComplete?: string;
};

export type FormInputProps<T extends FieldValues> =
  | (BaseProps<T> & {
      type?: "text";
      placeholder?: string;
      props?: Partial<InputProps>;
    })
  | (BaseProps<T> & {
      type: "number";
      placeholder?: string;
      props?: Partial<InputProps>;
    })
  | (BaseProps<T> & {
      type: "textarea";
      placeholder?: string;
      minRows?: number;
      props?: Partial<TextAreaProps>;
    })
  | (BaseProps<T> & {
      type: "select";
      placeholder?: string;
      options: SelectOption[];
      props?: Partial<SelectProps>;
    })
  | (BaseProps<T> & {
      type: "multiselect";
      placeholder?: string;
      options: SelectOption[];
      props?: Partial<SelectProps>;
    })
  | (BaseProps<T> & {
      type: "checkbox";
      checkboxLabel?: string;
      props?: Partial<CheckboxProps>;
    });

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  trigger,
  autoComplete,
  ...rest
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const revalidate = () => {
          if (error && trigger) trigger(name);
        };

        /* ── Text / Number ── */
        if (rest.type === "text" || rest.type === "number" || !rest.type) {
          const { props, placeholder } = rest as {
            props?: Partial<InputProps>;
            placeholder?: string;
            type?: "text" | "number";
          };
          return (
            <Input
              id={name}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder ?? " "}
              autoComplete={autoComplete}
              type={rest.type === "number" ? "number" : "text"}
              size="sm"
              variant="bordered"
              isInvalid={!!error}
              errorMessage={error?.message}
              {...props}
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(
                  rest.type === "number"
                    ? e.target.valueAsNumber
                    : e.target.value,
                );
                revalidate();
              }}
              onBlur={field.onBlur}
              classNames={{ ...INPUT_CLS, ...props?.classNames }}
            />
          );
        }

        /* ── Textarea ── */
        if (rest.type === "textarea") {
          const { props, placeholder, minRows } = rest as {
            props?: Partial<TextAreaProps>;
            placeholder?: string;
            minRows?: number;
          };
          return (
            <Textarea
              id={name}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder ?? " "}
              size="sm"
              variant="bordered"
              minRows={minRows ?? 3}
              isInvalid={!!error}
              errorMessage={error?.message}
              {...props}
              value={field.value ?? ""}
              onChange={(e) => {
                field.onChange(e.target.value);
                revalidate();
              }}
              onBlur={field.onBlur}
              classNames={{ ...INPUT_CLS, ...props?.classNames }}
            />
          );
        }

        /* ── Select ── */
        if (rest.type === "select") {
          const { props, placeholder, options } = rest as {
            props?: Partial<SelectProps>;
            placeholder?: string;
            options: SelectOption[];
          };
          return (
            <Select
              id={name}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder ?? "Sélectionner…"}
              size="sm"
              variant="bordered"
              isInvalid={!!error}
              errorMessage={error?.message}
              {...props}
              selectedKeys={field.value ? new Set([field.value]) : new Set()}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                field.onChange(val);
                revalidate();
              }}
              onBlur={field.onBlur}
              classNames={{ ...SELECT_CLS, ...props?.classNames }}
            >
              {options.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
          );
        }

        /* ── Multi-select ── */
        if (rest.type === "multiselect") {
          const { props, placeholder, options } = rest as {
            props?: Partial<SelectProps>;
            placeholder?: string;
            options: SelectOption[];
          };
          const currentValues: string[] = Array.isArray(field.value)
            ? field.value
            : [];
          return (
            <Select
              id={name}
              label={label}
              labelPlacement="outside"
              placeholder={placeholder ?? "Sélectionner…"}
              size="sm"
              variant="bordered"
              selectionMode="multiple"
              isInvalid={!!error}
              errorMessage={error?.message}
              {...props}
              selectedKeys={new Set(currentValues)}
              onSelectionChange={(keys) => {
                field.onChange(Array.from(keys) as string[]);
                revalidate();
              }}
              onBlur={field.onBlur}
              classNames={{ ...SELECT_CLS, ...props?.classNames }}
            >
              {options.map((opt) => (
                <SelectItem key={opt.key}>{opt.label}</SelectItem>
              ))}
            </Select>
          );
        }

        /* ── Checkbox ── */
        if (rest.type === "checkbox") {
          const { props, checkboxLabel } = rest as {
            props?: Partial<CheckboxProps>;
            checkboxLabel?: string;
          };
          return (
            <div className="flex flex-col gap-1">
              <Checkbox
                id={name}
                isSelected={!!field.value}
                isInvalid={!!error}
                {...props}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  revalidate();
                }}
                onBlur={field.onBlur}
                classNames={{
                  label:
                    "text-[0.83rem] text-[#2C2C2C] font-normal select-none",
                  ...props?.classNames,
                }}
              >
                {checkboxLabel ?? label}
              </Checkbox>
              {error && (
                <p className="text-[0.72rem] text-[#C44B3C]">{error.message}</p>
              )}
            </div>
          );
        }

        throw new Error(`Unsupported FormInput type: ${(rest as { type?: string }).type}`);
      }}
    />
  );
}