import {
  measurementUnitSchema,
  paginatedMeasurementUnitsSchema,
  type CreateMeasurementUnitInput,
  type ListMeasurementUnitsQuery,
  type MeasurementUnit,
  type PaginatedMeasurementUnits,
  type UpdateMeasurementUnitInput,
} from '@repo/contracts';

import { api } from '@/shared/lib/api';

export async function fetchMeasurementUnits(
  query: ListMeasurementUnitsQuery,
): Promise<PaginatedMeasurementUnits> {
  const { data } = await api.get('/v1/measurement-units', { params: query });
  return paginatedMeasurementUnitsSchema.parse(data);
}

/**
 * Loads measurement units for a picker (e.g. a unit dropdown), up to the API's max
 * page size of 100 — comfortably more than the realistic number of units.
 */
export async function fetchAllMeasurementUnits(): Promise<MeasurementUnit[]> {
  const { items } = await fetchMeasurementUnits({ page: 1, pageSize: 100 });
  return items;
}

export async function fetchMeasurementUnit(id: string): Promise<MeasurementUnit> {
  const { data } = await api.get(`/v1/measurement-units/${id}`);
  return measurementUnitSchema.parse(data);
}

export async function createMeasurementUnit(
  input: CreateMeasurementUnitInput,
): Promise<MeasurementUnit> {
  const { data } = await api.post('/v1/measurement-units', input);
  return measurementUnitSchema.parse(data);
}

export async function updateMeasurementUnit(
  id: string,
  input: UpdateMeasurementUnitInput,
): Promise<MeasurementUnit> {
  const { data } = await api.patch(`/v1/measurement-units/${id}`, input);
  return measurementUnitSchema.parse(data);
}

export async function deleteMeasurementUnit(id: string): Promise<void> {
  await api.delete(`/v1/measurement-units/${id}`);
}
