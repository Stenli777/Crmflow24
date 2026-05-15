"use client";

import { useActionState } from "react";
import { Button } from "@mui/material";
import type { AdminFormState } from "@/lib/admin/types";
import { FormAlert } from "./FormAlert";

type DeleteButtonProps = {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  id: string;
  label?: string;
  confirmMessage: string;
};

const initialState: AdminFormState = {};

export function DeleteButton({
  action,
  id,
  label = "Удалить",
  confirmMessage,
}: DeleteButtonProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <>
      <FormAlert state={state} />
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!window.confirm(confirmMessage)) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button type="submit" color="error" variant="outlined" disabled={pending}>
          {pending ? "Удаление…" : label}
        </Button>
      </form>
    </>
  );
}
