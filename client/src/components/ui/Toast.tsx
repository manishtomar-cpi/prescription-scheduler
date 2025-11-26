export type ToastVariant = "success" | "error";

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onClose: () => void;
}

export const Toast = ({ message, variant, onClose }: ToastProps) => {
  if (!message) return null;

  const base =
    "fixed bottom-4 right-4 z-50 max-w-xs rounded-md px-4 py-3 text-sm shadow-lg flex items-start gap-2";
  const variantClasses =
    variant === "success"
      ? "bg-emerald-900/90 border border-emerald-500/70 text-emerald-50"
      : "bg-rose-900/90 border border-rose-500/70 text-rose-50";

  return (
    <div className={`${base} ${variantClasses}`}>
      <span className="mt-[2px] text-lg">
        {variant === "success" ? "✅" : "⚠️"}
      </span>
      <div className="flex-1">
        <div className="text-xs font-semibold mb-1">
          {variant === "success" ? "Success" : "Something went wrong"}
        </div>
        <div className="text-xs leading-snug">{message}</div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-xs text-slate-200 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
};
