export function normalizeSapFactoryValue(value: unknown) {
  if (typeof value !== 'string') return value;
  const match = value.match(/\(([^)]+)\)\s*$/);
  return match ? match[1] : value;
}
