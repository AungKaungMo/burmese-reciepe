import { z } from 'zod';

export const uploadContentTypeSchema = z.enum([
  'image/svg+xml',
  'image/png',
  'image/jpeg',
  'image/webp',
]);
export type UploadContentType = z.infer<typeof uploadContentTypeSchema>;

/** Logical storage folders (object-key prefixes) in the bucket. */
export const uploadFolderSchema = z.enum([
  'categories',
  'recipes',
  'ingredients',
  'nutrients',
  'avatars',
]);
export type UploadFolder = z.infer<typeof uploadFolderSchema>;

/**
 * Request to mint a presigned upload target (`POST /v1/media/uploads`). The client
 * uploads the file directly to storage with the returned URL.
 */
export const createUploadSchema = z.object({
  contentType: uploadContentTypeSchema,
  folder: uploadFolderSchema.default('categories'),
});
export type CreateUploadInput = z.infer<typeof createUploadSchema>;

/**
 * A presigned upload target. `uploadUrl` is a short-lived PUT URL; after a
 * successful upload the object is readable at `publicUrl`, and `key` is its
 * stable object key within the bucket.
 */
export const uploadTargetSchema = z.object({
  uploadUrl: z.string().url(),
  key: z.string(),
  publicUrl: z.string().url(),
});
export type UploadTarget = z.infer<typeof uploadTargetSchema>;
