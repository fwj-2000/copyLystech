export function useQty(
  unit: string,
  stepDistance: number | null,
  modulus: number | null,
  defectRateTotal: number | null,
  useQtyMultiple: number | null,
): number | null {
  let useQty: number | null = null;
  const defectRateTotalT = defectRateTotal ?? 0;
  const useQtyMultipleT = useQtyMultiple ?? 0;

  if (defectRateTotalT === 1) return useQty;

  if (unit === 'M') {
    const stepDistanceT = stepDistance ?? 0;
    const modulusT = modulus ?? 0;

    if (modulusT === 0) return useQty;

    useQty = (stepDistanceT / modulusT / (1 - defectRateTotalT)) * useQtyMultipleT;
  } else if (unit === 'PCS') {
    useQty = (1 / (1 - defectRateTotalT)) * 1000 * useQtyMultipleT;
  }
  return useQty;
}
