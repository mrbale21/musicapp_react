/**
 * Utility functions for handling authentication tokens
 */

/**
 * Get token from cookies (works in both browser and SSR environments)
 */
export function getTokenFromCookies(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  try {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("app_user_token=")
    );

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1]?.trim();
      return token || null;
    }
  } catch (error) {
    console.warn("Failed to read token from cookies:", error);
  }

  return null;
}

/**
 * Remove token from cookies
 */
export function removeTokenFromCookies(): void {
  if (typeof document === "undefined") {
    return;
  }

  // Remove with all possible paths and domains
  document.cookie = "app_user_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "app_user_token=; path=/; domain=" + window.location.hostname + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
