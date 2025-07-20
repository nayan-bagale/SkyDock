export function getBrowserName(): "chrome" | "firefox" | "other" {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("firefox")) return "firefox";
  if (
    userAgent.includes("chrome") &&
    !userAgent.includes("edg") &&
    !userAgent.includes("opr")
  )
    return "chrome";

  return "other";
}
