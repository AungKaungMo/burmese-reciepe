import { ImageIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { UPLOAD_ACCEPT, validateUploadFile } from '@/shared/lib/upload';

/**
 * Single image picker with inline preview + remove. The selected File is owned by
 * the caller. `currentUrl` shows an already-saved image (when editing) until a
 * replacement is picked. Rejects files that fail the shared upload validation.
 */
export function ImageUploadField({
  label,
  hint,
  file,
  onChange,
  currentUrl,
}: {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  currentUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleSelect(selected: File | null) {
    if (selected) {
      const validationError = validateUploadFile(selected);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    onChange(selected);
  }

  const shownUrl = file && preview ? preview : currentUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {shownUrl ? (
        <div className="relative flex flex-col items-center gap-2 rounded-md border border-input bg-muted/30 p-3">
          <img
            src={shownUrl}
            alt={`${label} preview`}
            className="h-40 w-full rounded-md object-cover"
          />
          {file ? (
            <span className="max-w-full truncate text-xs text-muted-foreground">{file.name}</span>
          ) : (
            <label className="cursor-pointer text-xs font-medium text-primary hover:underline">
              Click to replace {label.toLowerCase()}
              <input
                accept={UPLOAD_ACCEPT}
                className="hidden"
                type="file"
                onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
              />
            </label>
          )}
          {file && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-1.5 top-1.5 size-7 text-muted-foreground"
              aria-label={`Remove ${label}`}
              onClick={() => handleSelect(null)}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/50">
          <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground">
            <ImageIcon className="size-4" />
          </span>
          <span className="text-sm font-medium">Click to upload {label.toLowerCase()}</span>
          <span className="text-xs text-muted-foreground">{hint ?? 'PNG, JPEG, WebP or SVG'}</span>
          <input
            accept={UPLOAD_ACCEPT}
            className="hidden"
            type="file"
            onChange={(event) => handleSelect(event.target.files?.[0] ?? null)}
          />
        </label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
