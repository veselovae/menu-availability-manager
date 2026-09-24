import {
  filterMenuItems,
  parseMenuFilters,
  RawSearchParams,
} from "@/features/stop-list/model/filters";
import { StopListPage } from "@/features/stop-list/ui/StopListPage";
import { menuItemsMock } from "@/mocks/menu-items";

interface HomePageProps {
  searchParams: Promise<RawSearchParams>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;

  const filters = parseMenuFilters(params);
  const items = filterMenuItems(menuItemsMock, filters);

  return <StopListPage items={items} filters={filters} />;
}
