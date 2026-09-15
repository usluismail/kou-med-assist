/**
 * Logbook alt-paketine özgü paylaşılan tipler.
 */

/** Async veri state'i — hooks.ts'deki AsyncState ile aynı shape */
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};
