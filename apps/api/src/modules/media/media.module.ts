import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MediaController } from './media.controller.js';
import { StorageService } from './storage.service.js';

/** Signed uploads and object-storage access (Cloudflare R2). */
@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [StorageService],
  exports: [StorageService],
})
export class MediaModule {}
