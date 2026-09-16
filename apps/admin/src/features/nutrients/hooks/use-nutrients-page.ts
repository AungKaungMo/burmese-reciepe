import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ListNutrientsQuery } from '@repo/contracts';

import { useAllMeasurementUnits } from '@/features/measurement-units/api/queries';
import { useNutrients, useDeleteNutrient } from '@/features/nutrients/api/queries';
import { toNutrientRow } from '@/features/nutrients/mappers';
import type { NutrientRow } from '@/features/nutrients/types';
import { useConfirm } from '@/shared/components/confirm-dialog';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

export function useNutrientsPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

  // A new search should send us back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const query = useMemo<ListNutrientsQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [page, debouncedSearch],
  );

  const { data, isPending, isError, error } = useNutrients(query);
  const { data: units } = useAllMeasurementUnits();
  const deleteNutrient = useDeleteNutrient();

  const unitById = useMemo(
    () => new Map((units ?? []).map((unit) => [unit.id, unit.symbol])),
    [units],
  );

  const rows = useMemo(
    () => (data?.items ?? []).map((nutrient) => toNutrientRow(nutrient, unitById)),
    [data, unitById],
  );

  function handleEdit(nutrient: NutrientRow) {
    navigate(`/nutrients/${nutrient.id}/edit`);
  }

  async function handleDelete(nutrient: NutrientRow) {
    const confirmed = await confirm({
      title: `Delete “${nutrient.name}”?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
    });
    if (confirmed) deleteNutrient.mutate(nutrient.id);
  }

  return {
    rows,
    total: data?.total ?? 0,
    pageSize: PAGE_SIZE,
    isPending,
    isError,
    error,
    page,
    setPage,
    search,
    setSearch,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };
}
