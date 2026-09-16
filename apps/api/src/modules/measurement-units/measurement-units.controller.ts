import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  createMeasurementUnitSchema,
  listMeasurementUnitsQuerySchema,
  updateMeasurementUnitSchema,
  type CreateMeasurementUnitInput,
  type ListMeasurementUnitsQuery,
  type MeasurementUnit,
  type PaginatedMeasurementUnits,
  type UpdateMeasurementUnitInput,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { MeasurementUnitsService } from './measurement-units.service.js';

/** CRUD for measurement units and their translations. */
@Controller('measurement-units')
@UseGuards(SupabaseJwtGuard)
export class MeasurementUnitsController {
  constructor(private readonly units: MeasurementUnitsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listMeasurementUnitsQuerySchema))
    query: ListMeasurementUnitsQuery,
  ): Promise<PaginatedMeasurementUnits> {
    return this.units.list(query);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): Promise<MeasurementUnit> {
    return this.units.getById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(createMeasurementUnitSchema))
    input: CreateMeasurementUnitInput,
  ): Promise<MeasurementUnit> {
    return this.units.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateMeasurementUnitSchema))
    input: UpdateMeasurementUnitInput,
  ): Promise<MeasurementUnit> {
    return this.units.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.units.remove(id);
  }
}
