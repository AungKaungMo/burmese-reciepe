import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * App-wide toast host. Colors are wired to our theme tokens so toasts match light
 * and dark mode automatically (no `next-themes` needed). Mount once near the root.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      richColors
      closeButton
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
