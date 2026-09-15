import { UploadCloud, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';

function isSvg(file: File): boolean {
  return file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
}

/**
 * Single SVG picker with inline preview + remove. The selected File is owned by the
 * caller. `currentUrl` shows an already-saved icon (e.g. when editing) until the
 * user picks a replacement.
 */
export function SvgUploadField({
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
    if (selected && !isSvg(selected)) {
      setError('Only SVG files are allowed.');
      return;
    }

    setError(null);
    onChange(selected);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {file && preview ? (
        <div className="relative flex flex-col items-center gap-2 rounded-md border border-input bg-muted/30 px-4 py-6">
          <img src={preview} alt={`${label} preview`} className="size-10" />
          <span className="max-w-full truncate text-xs text-muted-foreground">{file.name}</span>
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
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50">
          {currentUrl ? (
            <>
              <img src={currentUrl} alt={`Current ${label.toLowerCase()}`} className="size-10" />
              <span className="text-sm font-medium">Click to replace {label.toLowerCase()}</span>
            </>
          ) : (
            <>
              <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground">
                <UploadCloud className="size-4" />
              </span>
              <span className="text-sm font-medium">Click to upload {label.toLowerCase()}</span>
            </>
          )}
          <span className="text-xs text-muted-foreground">{hint ?? 'SVG only'}</span>
          <input
            accept="image/svg+xml,.svg"
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
