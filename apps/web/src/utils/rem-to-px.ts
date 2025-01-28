export default function remToPx(
  rem: number,
  baseFontSize: number = 16
): number {
  return rem * baseFontSize;
}
