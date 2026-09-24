export const PRODUCTION_URL = "https://box2board.com";

export function isProductionDeployment() {
  return process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
}
