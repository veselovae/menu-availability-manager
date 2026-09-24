export const StopListEmpty = () => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
      <h2 className="font-medium">Позиций не найдено</h2>

      <p className="mt-2 text-sm text-neutral-500">
        По выбранным фильтрам нет позиций меню.
      </p>
    </div>
  );
};
