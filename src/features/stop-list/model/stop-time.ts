const STEP_MS = 15 * 60 * 1000; // 15 мин
const MAX_DURATION_MS = 24 * 60 * 60 * 1000; // 24 часа

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

// Функция для составления опций для выбора времени стопа
export const getStopTimeOptions = (now = new Date()) => {
  const options: { value: string; label: string }[] = [];

  for (
    let timestamp = (Math.floor(now.getTime() / STEP_MS) + 1) * STEP_MS;
    timestamp <= now.getTime() + MAX_DURATION_MS;
    timestamp += STEP_MS
  ) {
    const date = new Date(timestamp);

    const day =
      date.toDateString() === now.toDateString() ? "Сегодня" : "Завтра";

    options.push({
      value: date.toISOString(),
      label: `${day}, ${timeFormatter.format(date)}`,
    });
  }

  return options;
};
