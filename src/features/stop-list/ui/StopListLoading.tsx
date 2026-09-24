export const StopListLoading = () => {
  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white px-4 py-2">
      <div className="h-8 animate-pulse rounded-lg bg-neutral-100" />
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-15 animate-pulse rounded-lg bg-neutral-100"
        />
      ))}
    </div>
  );
};
