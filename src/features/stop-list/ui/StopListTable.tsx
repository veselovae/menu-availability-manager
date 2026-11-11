// Отображает позиции, состояние сохранения и действия без обращения к API.
import {
  SHOP_LABELS,
  STOP_REASON_LABELS,
} from "@/features/stop-list/model/constants";
import { formatDateTime } from "@/shared/lib/date";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { MenuItemStatusKind, type MenuItem } from "@/types/menu";

interface StopListTableProps {
  items: MenuItem[];
  pendingItemId: string | null;
  onOpenStopPanel: (itemId: string) => void;
  onResume: (itemId: string) => void;
}

function formatUntil(until: string | null): string {
  return until === null ? "До конца смены" : formatDateTime(until);
}

export function StopListTable({
  items,
  pendingItemId,
  onOpenStopPanel,
  onResume,
}: StopListTableProps) {
  return (
    <div className="menu-table-wrap">
      <table className="menu-table">
        <caption className="sr-only">
          Доступность блюд, остатки и действия
        </caption>
        <thead>
          <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
            <TableHeader>Название</TableHeader>
            <TableHeader>Цех</TableHeader>
            <TableHeader>Остаток, шт</TableHeader>
            <TableHeader>Статус</TableHeader>
            <TableHeader>Причина</TableHeader>
            <TableHeader>Срок стопа</TableHeader>
            <TableHeader align="right">Действия</TableHeader>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const isStopped = item.status.kind === MenuItemStatusKind.Stopped;
            const isPending = pendingItemId === item.id;

            const rowClassName = [isStopped ? "row-stopped" : ""].join(" ");

            return (
              <tr key={item.id} className={rowClassName}>
                <TableCell className="dish-cell">
                  <div className="dish-info">
                    <span className={`dish-icon dish-${item.shop}`}>
                      <Icon
                        name={
                          item.shop === "bar"
                            ? "cup"
                            : item.shop === "pastry"
                              ? "cake"
                              : "plate"
                        }
                      />
                    </span>
                    <span>{item.title}</span>
                  </div>
                </TableCell>

                <TableCell label="Цех" className="shop-cell">
                  {SHOP_LABELS[item.shop]}
                </TableCell>

                <TableCell label="Остаток">
                  <span
                    className={`stock-value ${item.stock <= 5 ? "stock-low" : ""}`}
                  >
                    {item.stock}
                    <span> шт.</span>
                  </span>
                </TableCell>

                <TableCell label="Статус" className="status-cell">
                  {isStopped ? (
                    <Badge variant="danger">В стоп-листе</Badge>
                  ) : (
                    <Badge variant="success">В продаже</Badge>
                  )}
                  {isPending && (
                    <span
                      role="status"
                      className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-xs text-neutral-500"
                    >
                      <span
                        aria-hidden="true"
                        className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
                      />
                      Сохраняется...
                    </span>
                  )}
                </TableCell>

                <TableCell label="Причина" className="reason-cell">
                  {item.status.kind === MenuItemStatusKind.Stopped
                    ? STOP_REASON_LABELS[item.status.reason]
                    : "-"}
                </TableCell>

                <TableCell label="Срок стопа" className="until-cell">
                  {item.status.kind === MenuItemStatusKind.Stopped
                    ? formatUntil(item.status.until)
                    : "-"}
                </TableCell>

                <TableCell className="actions-cell">
                  <div className="row-actions">
                    {isStopped ? (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => onOpenStopPanel(item.id)}
                          disabled={isPending}
                        >
                          Изменить
                        </Button>
                        <span
                          title={
                            item.stock === 0
                              ? "Нельзя вернуть позицию в продажу при остатке 0"
                              : undefined
                          }
                        >
                          <Button
                            variant="secondary"
                            disabled={item.stock === 0 || isPending}
                            aria-label={
                              item.stock === 0
                                ? "Возврат недоступен: остаток 0"
                                : `Вернуть в продажу: ${item.title}`
                            }
                            onClick={() => onResume(item.id)}
                          >
                            Вернуть <Icon name="arrow" size={14} />
                          </Button>
                        </span>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => onOpenStopPanel(item.id)}
                        disabled={isPending}
                        aria-label={`В стоп-лист: ${item.title}`}
                      >
                        <Icon name="pause" size={14} /> В стоп-лист
                      </Button>
                    )}
                  </div>
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/*
Выношу ячейки заголовка и тела таблицы в отдельные компоненты,
чтобы не дублировать классы и хранить общие стили в одном месте.
Так изменения этих стилей не потребуют правок в каждой ячейке.
*/

interface TableHeaderProps {
  children: React.ReactNode;
  align?: "left" | "right";
}

const TableHeader = ({ children, align = "left" }: TableHeaderProps) => (
  <th scope="col" className={align === "right" ? "text-right" : ""}>
    {children}
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

const TableCell = ({ children, className = "", label }: TableCellProps) => (
  <td data-label={label} className={className}>
    {children}
  </td>
);
