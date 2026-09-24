import {
  SHOP_LABELS,
  STOP_REASON_LABELS,
} from "@/features/stop-list/model/constants";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { MenuItemStatusKind, type MenuItem } from "@/types/menu";

interface StopListTableProps {
  items: MenuItem[];
}

function formatUntil(until: string | null): string {
  if (until === null) {
    return "До конца смены";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(until));
}

export function StopListTable({ items }: StopListTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[1040px] border-collapse text-left">
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

            const rowClassName = [
              "border-b border-neutral-100 last:border-b-0",
              "hover:bg-neutral-50 transition-colors duration-100",
              isStopped ? "text-neutral-500" : "",
            ].join(" ");

            return (
              <tr key={item.id} className={rowClassName}>
                <TableCell className="font-medium w-[18%]">
                  {item.title}
                </TableCell>

                <TableCell className="text-sm">
                  {SHOP_LABELS[item.shop]}
                </TableCell>

                <TableCell className="text-sm">{item.stock}</TableCell>

                <TableCell>
                  {isStopped ? (
                    <Badge variant="danger">В стоп-листе</Badge>
                  ) : (
                    <Badge variant="success">В продаже</Badge>
                  )}
                </TableCell>

                <TableCell className="text-sm w-[15%]">
                  {item.status.kind === MenuItemStatusKind.Stopped
                    ? STOP_REASON_LABELS[item.status.reason]
                    : "-"}
                </TableCell>

                <TableCell className="text-sm">
                  {item.status.kind === MenuItemStatusKind.Stopped
                    ? formatUntil(item.status.until)
                    : "—"}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    {isStopped ? (
                      <>
                        <Button variant="ghost">Изменить</Button>

                        <Button variant="secondary" disabled={item.stock === 0}>
                          Вернуть в продажу
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary">В стоп-лист</Button>
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
  <th className={`px-4 py-3 ${align === "right" ? "text-right" : ""}`}>
    {children}
  </th>
);

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

const TableCell = ({ children, className = "" }: TableCellProps) => (
  <td className={`px-4 py-4 ${className}`}>{children}</td>
);
