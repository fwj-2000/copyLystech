import { defineStore } from 'pinia';

interface quotaState {
  firstProcessFpy: number;
}

export function normalizePercentNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const n = Number.parseFloat(value.replace('%', '').trim());
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

export const useQuotaStore = defineStore({
  id: 'quotationBom',
  state: (): quotaState => ({
    firstProcessFpy: 0,
  }),
  getters: {
    getFirstProcessFpy(): number {
      return this.firstProcessFpy;
    },
  },
  actions: {
    setFirstProcessFpy(fpy: unknown) {
      this.firstProcessFpy = normalizePercentNumber(fpy, 0);
    },
  },
});
