export type AdminFormState = {
  error?: string;
  success?: string;
};

export function formError(message: string): AdminFormState {
  return { error: message };
}
