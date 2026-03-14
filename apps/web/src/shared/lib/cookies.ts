export function setCookie(name: string, value: string, maxAgeSeconds = 3600) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const key = `${name}=`;
  const found = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(key));

  if (!found) return null;
  return decodeURIComponent(found.slice(key.length));
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}
