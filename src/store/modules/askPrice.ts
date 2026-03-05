import { defineStore } from 'pinia';

interface BaseState {
  insidePartList: any[];
}

export const useAskPriceStore = defineStore({
  id: 'askPrice',
  state: (): BaseState => ({
    insidePartList: [],
  }),
  getters: {
    getInsidePartList(): any[] {
      return this.insidePartList;
    },
  },
  actions: {
    setInsidePartList(val) {
      this.insidePartList = val;
    },
    pushInsidePartList(val) {
      // 对val数组进行去重
      const filterList = val.filter(item => {
        return !this.insidePartList.some(i => i.insidePartNumber === item.insidePartNumber);
      });
      this.insidePartList = [...this.insidePartList, ...filterList];
    },
    clearInsidePartList() {
      this.insidePartList = [];
    },
  },
});
