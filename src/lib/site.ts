export const DEFAULT_SITE_URL =
  "https://nisa-retire-countdown.vercel.app";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}

export const SITE_NAME = "つみたてNISAシミュレーター";
export const SITE_TITLE = "つみたてNISAで、引退は何年後？";
export const SITE_DESCRIPTION =
  "つみたてNISAの積立額・想定利回り・目標金額から、引退まで何年かかるかをかんたんにシミュレーション。老後資金の目安をすぐに確認できます。";
export const SITE_KEYWORDS = [
  "つみたてNISA",
  "NISA",
  "シミュレーター",
  "積立投資",
  "老後資金",
  "引退",
  "資産形成",
  "投資シミュレーション",
  "新NISA",
];
