import { Upload } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';

import { Button } from '@/shared/components/ui/button';

type ImportButtonProps = {
  onFile: (file: File) => void;
  isPending?: boolean;
  label?: string;
};

/** Generic "Import" button: picks an .xlsx and hands the File to `onFile`. */
export function ImportButton({ onFile, isPending = false, label = 'Import' }: ImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset so picking the same file again still fires `onChange`.
    event.target.value = '';
    if (file) onFile(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-auto"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {isPending ? 'Importing…' : label}
      </Button>
    </>
  );
}
