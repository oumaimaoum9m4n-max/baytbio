"use client";

import { useEffect, useRef } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "@/components/ui/toast";

/**
 * Watches react-hook-form's `errors` object and fires a toast.error for each
 * field error whenever the errors change. Only fires when errors are present.
 *
 * @example
 * const { control, formState: { errors } } = useForm<MySchema>();
 * useShowFormError(errors);
 */
export function useShowFormError<T extends FieldValues>(
  errors: FieldErrors<T>,
) {
  const prevErrorKeysRef = useRef<string>("");

  useEffect(() => {
    const entries = Object.entries(errors);
    if (entries.length === 0) return;

    const serialised = JSON.stringify(
      entries.map(([k, v]) => [k, (v as any)?.message]),
    );

    // Only show toasts when the error set actually changed
    if (serialised === prevErrorKeysRef.current) return;
    prevErrorKeysRef.current = serialised;

    const messages = entries
      .map(([, error]) => (error as any)?.message as string | undefined)
      .filter(Boolean) as string[];

    if (messages.length === 0) return;

    toast.error({
      title: "Veuillez corriger les erreurs suivantes",
      description: messages.map((m, i) => `${i + 1}. ${m}`).join("\n"),
    });
  }, [errors]);
}
