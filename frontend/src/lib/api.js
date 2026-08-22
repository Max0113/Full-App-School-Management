export function isUnauthorized(error) {
  return error?.response?.status === 401;
}

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error?.code === "ERR_NETWORK") {
    return "Cannot reach the server. Check your connection and try again.";
  }
  const validationErrors = error?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const first = Object.values(validationErrors)[0];
    if (Array.isArray(first) && first.length > 0) return first[0];
  }
  return error?.response?.data?.message || fallback;
}

export function setAuthCookie(token) {
  document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; samesite=lax`;
}

export function clearAuthCookie() {
  document.cookie = "auth_token=; path=/; max-age=0; samesite=lax";
}

export function hasAuthCookie() {
  return document.cookie.split(";").some((c) => c.trim().startsWith("auth_token="));
}
