const PREFIX = "tuxcab-dispatch:";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readStorage(key: string): string | null {
  if (!canUseStorage()) return null;
  try {
    return localStorage.getItem(PREFIX + key) ?? sessionStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, persist = true) {
  if (!canUseStorage()) return;
  try {
    const full = PREFIX + key;
    if (persist) {
      localStorage.setItem(full, value);
      sessionStorage.removeItem(full);
    } else {
      sessionStorage.setItem(full, value);
      localStorage.removeItem(full);
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearStorage(key: string) {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(PREFIX + key);
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
