import { deleteCookie, getCookie, setCookie } from "@/shared/lib/cookies";

const ACCESS_TOKEN_KEY = "fintech_access_token";
const ACCESS_TOKEN_COOKIE = "access_token";
const ACCESS_TOKEN_CHANGED_EVENT = "fintech:access-token-changed";
let accessTokenCache: string | null | undefined;

function readAccessTokenFromStorage() {
  if (typeof window === "undefined") return null;

  const fromStorage = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (fromStorage) return fromStorage;

  return getCookie(ACCESS_TOKEN_COOKIE);
}

function notifyAccessTokenChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ACCESS_TOKEN_CHANGED_EVENT));
}

export function getAccessToken() {
  if (accessTokenCache !== undefined) return accessTokenCache;

  accessTokenCache = readAccessTokenFromStorage();
  return accessTokenCache;
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;

  if (accessTokenCache === token) return;

  accessTokenCache = token;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  setCookie(ACCESS_TOKEN_COOKIE, token, 60 * 60);
  notifyAccessTokenChanged();
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;

  if (accessTokenCache === null) return;

  accessTokenCache = null;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_COOKIE);
  notifyAccessTokenChanged();
}

export function subscribeAccessTokenChanges(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const handleCustomChange = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== ACCESS_TOKEN_KEY) return;

    const next = readAccessTokenFromStorage();
    if (next === accessTokenCache) return;

    accessTokenCache = next;
    callback();
  };

  window.addEventListener(ACCESS_TOKEN_CHANGED_EVENT, handleCustomChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(ACCESS_TOKEN_CHANGED_EVENT, handleCustomChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getAccessTokenSnapshot() {
  return getAccessToken();
}
