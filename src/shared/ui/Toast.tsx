// Показывает результат операции и скрывает уведомление через 4 секунды.
"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  variant?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, variant = "error", onClose }: ToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message, variant, onClose]);

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 w-[360px] rounded-xl border bg-white 
        p-4 shadow-lg ${variant === "success" ? "border-green-200" : "border-red-200"}`}
    >
      <p className="font-medium text-[#171512]">
        {variant === "success" ? "Изменения сохранены" : "Не удалось сохранить"}
      </p>

      <p className="mt-1 text-sm text-neutral-600">{message}</p>
    </div>
  );
}
