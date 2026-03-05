import { defineStore } from 'pinia';

interface IState {
  dictKey: string; // 字典key
}

export const useFlowSettingStore = defineStore({
  id: 'flowSetting',
  state: (): IState => ({
    dictKey: '',
  }),
  getters: {
    /**
     * 根据指定的 key 获取 state 中的值
     * @param key - IState 的键名
     * @returns 对应 key 的值
     */
    getStateVal:
      <K extends keyof IState>(state: IState) =>
      (key: K): IState[K] => {
        return state[key];
      },
  },
  actions: {
    /**
     * 设置 state 中的值
     * @param payload - 包含 key 和 val 的对象
     * @param key - IState 的键名
     * @param value - 对应 key 的值
     */
    setStateVal<K extends keyof IState>(key: K, value: IState[K]): void {
      this[key] = value;
    },
  },
});
