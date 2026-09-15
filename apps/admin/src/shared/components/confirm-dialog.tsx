import { create } from 'zustand';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { buttonVariants } from '@/shared/components/ui/button';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as a destructive action (red). Defaults to `true`. */
  destructive?: boolean;
};

type ConfirmStore = {
  open: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  /** Opens the dialog and resolves `true` on confirm, `false` on cancel/dismiss. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  settle: (value: boolean) => void;
};

const useConfirmStore = create<ConfirmStore>((set, get) => ({
  open: false,
  options: null,
  resolve: null,
  confirm: (options) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, options, resolve });
    }),
  settle: (value) => {
    get().resolve?.(value);
    set({ open: false, resolve: null });
  },
}));

/**
 * Promise-based confirm, backed by a single zustand-driven AlertDialog.
 * `const confirm = useConfirm(); await confirm({ title, description })`.
 * Requires <ConfirmDialogHost /> mounted once near the app root.
 */
export function useConfirm() {
  return useConfirmStore((state) => state.confirm);
}

/** The single dialog instance. Mount once near the app root. */
export function ConfirmDialogHost() {
  const { open, options, settle } = useConfirmStore();
  const destructive = options?.destructive ?? true;

  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && settle(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          {options?.description && (
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => settle(false)}>
            {options?.cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            className={destructive ? buttonVariants({ variant: 'destructive' }) : undefined}
            onClick={() => settle(true)}
          >
            {options?.confirmLabel ?? 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
