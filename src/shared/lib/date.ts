// Форматирует дату и время единообразно для русскоязычного интерфейса.
const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDateTime = (value: string | Date): string =>
  dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
