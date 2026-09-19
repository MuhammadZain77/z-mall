"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { removeToast } from "@/lib/redux/slices/uiSlice";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: { id: string; message: string; type: "success" | "info" | "error"; duration?: number };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const borderColors = {
    success: "border-[#00f59b] bg-[#05130d]/90 text-emerald-300 shadow-[0_0_20px_rgba(0,245,155,0.15)]",
    error: "border-red-500 bg-[#1c0808]/90 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    info: "border-cyan-400 bg-[#061521]/90 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[#00f59b] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${borderColors[toast.type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <p className="text-sm font-medium text-white tracking-wide">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors ml-4"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
