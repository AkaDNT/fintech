import { deleteCookie, getCookie, setCookie } from "@/shared/lib/cookies";

const ACCESS_TOKEN_KEY = "fintech_access_token";
const ACCESS_TOKEN_COOKIE = "access_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  const fromStorage = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (fromStorage) return fromStorage;

  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  setCookie(ACCESS_TOKEN_COOKIE, token, 60 * 60);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  deleteCookie(ACCESS_TOKEN_COOKIE);
}
