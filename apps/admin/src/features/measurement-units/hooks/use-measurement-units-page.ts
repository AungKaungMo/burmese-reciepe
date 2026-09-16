import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ListMeasurementUnitsQuery } from '@repo/contracts';

import {
  useMeasurementUnits,
  useDeleteMeasurementUnit,
} from '@/features/measurement-units/api/queries';
import { toMeasurementUnitRow } from '@/features/measurement-units/mappers';
import type { MeasurementUnitRow } from '@/features/measurement-units/types';
import { useConfirm } from '@/shared/components/confirm-dialog';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

const PAGE_SIZE = 8;

export function useMeasurementUnitsPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search.trim(), 600);

  // A new search should send us back to the first page.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const query = useMemo<ListMeasurementUnitsQuery>(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [page, debouncedSearch],
  );

  const { data, isPending, isError, error } = useMeasurementUnits(query);
  const deleteUnit = useDeleteMeasurementUnit();

  const rows = useMemo(() => (data?.items ?? []).map(toMeasurementUnitRow), [data]);

  function handleEdit(unit: MeasurementUnitRow) {
    navigate(`/measurement-units/${unit.id}/edit`);
  }

  async function handleDelete(unit: MeasurementUnitRow) {
    const confirmed = await confirm({
      title: `Delete “${unit.name}”?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete',
    });
    if (confirmed) deleteUnit.mutate(unit.id);
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
