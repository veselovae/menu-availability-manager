// Показывает ошибку загрузки и кнопку повторного запроса.
import { Button } from "@/shared/ui/Button";

interface StopListErrorProps {
  onRetry: () => void;
}

export function StopListError({ onRetry }: StopListErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-white p-10 text-center">
      <h2 className="font-medium">Не удалось загрузить меню</h2>

      <p className="mt-2 text-sm text-neutral-500">
        Попробуйте повторить запрос.
      </p>

      <Button className="mt-4" onClick={onRetry}>
        Повторить
      </Button>
    </div>
  );
}
