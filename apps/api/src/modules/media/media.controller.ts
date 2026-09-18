import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  createUploadSchema,
  type CreateUploadInput,
  type UploadTarget,
} from '@repo/contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { SupabaseJwtGuard } from '../auth/supabase-jwt.guard.js';
import { StorageService } from './storage.service.js';

/** Signed uploads to object storage (Cloudflare R2). */
@Controller('media')
@UseGuards(SupabaseJwtGuard, AdminGuard)
export class MediaController {
  constructor(private readonly storage: StorageService) {}

  /**
   * Returns a short-lived presigned URL the client PUTs the file to, plus the
   * resulting public URL to persist (e.g. as a category `iconPath`).
   */
  @Post('uploads')
  createUpload(
    @Body(new ZodValidationPipe(createUploadSchema))
    input: CreateUploadInput,
  ): Promise<UploadTarget> {
    return this.storage.createPresignedUpload(input.folder, input.contentType);
  }
}
