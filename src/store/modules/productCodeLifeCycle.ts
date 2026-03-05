import { defineStore } from 'pinia';

type ValueType = { applyCode: string; insidePartNumber: string };
interface BaseState {
  /**
   * 成品编码生命周期,跳转到对应报表页面所需的参数
   * key 为报表页面路由
   * value 为对应报表页面所需的参数
   */
  lifeCycleParamMap: {
    [key: string]: ValueType | null;
  };
}

/**
 * 用于 成品编码生命周期, 跳转到对应报表页面的参数存储传递
 */
export const useProductCodeLifyCycleStore = defineStore({
  id: 'productCodeLifeCycle',
  state: (): BaseState => ({
    lifeCycleParamMap: {},
  }),
  getters: {
    getLifeCycleParam() {
      return (path: string) => this.lifeCycleParamMap[path];
    },
  },
  actions: {
    setLifeCycleParam(path: string, params: ValueType | null) {
      this.lifeCycleParamMap[path] = params;
    },
  },
});
