import type { ToastVariant } from "../components/ui/Toast";

export interface ToastState {
  message: string;
  variant: ToastVariant;
}

export const createSuccessToast = (message: string): ToastState => ({
  message,
  variant: "success"
});

export const createErrorToast = (message: string): ToastState => ({
  message,
  variant: "error"
});
