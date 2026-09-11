type DebouncedFunction<Args extends readonly unknown[]> = {
  (...args: Args): void;
  cancel: () => void;
};

/** Delays a callback until calls have stopped for the given duration. */
export function debounce<Args extends readonly unknown[]>(
  callback: (...args: Args) => void,
  delay = 300,
): DebouncedFunction<Args> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = undefined;
      callback(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };

  return debounced;
}
