/** Dev-only: landing LoginSheet'i root nav bardan açmak için. */
let opener: (() => void) | null = null;

export function registerDevLoginOpener(fn: () => void) {
  opener = fn;
  return () => {
    if (opener === fn) opener = null;
  };
}

export function openDevLogin() {
  opener?.();
}
