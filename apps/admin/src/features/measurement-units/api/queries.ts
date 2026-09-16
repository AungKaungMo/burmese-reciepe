import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  CreateMeasurementUnitInput,
  ListMeasurementUnitsQuery,
  UpdateMeasurementUnitInput,
} from '@repo/contracts';

import {
  createMeasurementUnit,
  deleteMeasurementUnit,
  fetchAllMeasurementUnits,
  fetchMeasurementUnit,
  fetchMeasurementUnits,
  updateMeasurementUnit,
} from './measurement-units';

export const measurementUnitKeys = {
  all: ['measurement-units'] as const,
  list: (query: ListMeasurementUnitsQuery) => ['measurement-units', 'list', query] as const,
  full: ['measurement-units', 'full'] as const,
  detail: (id: string) => ['measurement-units', 'detail', id] as const,
};

/** Loads the complete set of units (all pages), for pickers that must offer every option. */
export function useAllMeasurementUnits() {
  return useQuery({
    queryKey: measurementUnitKeys.full,
    queryFn: () => fetchAllMeasurementUnits(),
  });
}

/** The `api` interceptor collapses error envelopes to `Error`, so use its message. */
function toastError(fallback: string) {
  return (error: unknown) => toast.error(error instanceof Error ? error.message : fallback);
}

export function useMeasurementUnits(query: ListMeasurementUnitsQuery) {
  return useQuery({
    queryKey: measurementUnitKeys.list(query),
    queryFn: () => fetchMeasurementUnits(query),
    placeholderData: keepPreviousData,
  });
}

export function useMeasurementUnit(id: string | undefined) {
  return useQuery({
    queryKey: measurementUnitKeys.detail(id ?? ''),
    queryFn: () => fetchMeasurementUnit(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateMeasurementUnit() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMeasurementUnitInput) => createMeasurementUnit(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: measurementUnitKeys.all });
      toast.success('Measurement unit created.');
    },
    onError: toastError('Failed to create measurement unit.'),
  });
}

export function useUpdateMeasurementUnit() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMeasurementUnitInput }) =>
      updateMeasurementUnit(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: measurementUnitKeys.all });
      toast.success('Measurement unit updated.');
    },
    onError: toastError('Failed to update measurement unit.'),
  });
}

export function useDeleteMeasurementUnit() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMeasurementUnit(id),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: measurementUnitKeys.all });
      toast.success('Measurement unit deleted.');
    },
    onError: toastError('Failed to delete measurement unit.'),
  });
}
