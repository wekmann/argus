/**
 * Friendly text for the `?error=` codes next-auth puts on the home page
 * (`pages.error` is "/"). Returns null when there is nothing to show.
 */
const MESSAGES: Record<string, string> = {
  OAuthSignin: "Could not start the Discord login. Please try again.",
  OAuthCallback:
    "Discord did not complete the login. If you cancelled it, just try again.",
  OAuthCreateAccount: "Could not finish creating your session. Please try again.",
  Callback: "Something went wrong while logging you in. Please try again.",
  AccessDenied: "Access was denied. Please try again with a different account.",
  Configuration:
    "Login is not configured correctly on the server. Please contact the site operator.",
  SessionRequired: "Please log in to open that page.",
  Default: "Login failed. Please try again.",
};

export function authErrorMessage(code: string | null | undefined): string | null {
  if (!code) return null;
  // "discord" is what old broken login links produced; it is not a real error.
  if (code === "discord") return null;
  return MESSAGES[code] ?? MESSAGES.Default;
}
