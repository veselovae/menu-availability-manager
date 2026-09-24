// Читает фильтры из URL на сервере и передает их экрану стоп-листа.
import { RawSearchParams } from "@/features/stop-list/model/filters";
import { StopListPage } from "@/features/stop-list/ui/StopListPage";
import { parseMenuFilters } from "@/features/stop-list/model/filters";

interface HomePageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const filters = parseMenuFilters(params);

  return <StopListPage filters={filters} />;
}
