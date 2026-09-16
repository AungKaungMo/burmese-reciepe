import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MeasurementUnitsController } from './measurement-units.controller.js';
import { MeasurementUnitsService } from './measurement-units.service.js';

/** Measurement units (code + symbol) with their localized translations. */
@Module({
  imports: [AuthModule],
  controllers: [MeasurementUnitsController],
  providers: [MeasurementUnitsService],
  exports: [MeasurementUnitsService],
})
export class MeasurementUnitsModule {}
