// stores/pccBasicStore.ts
import { defineStore } from 'pinia';
import { watch, type WatchStopHandle, reactive, nextTick, toRefs } from 'vue';

interface PccBasicState {
  insidePartNumber: number;
  productDesc: string;
  version: string;
  bomType: number;
  docNumber: string;
  applyCode: string;
  effectiveDate: string | null;
  creatorUserName: string;
  handlerId: string;
  remark: string;
}

type StateKey = keyof PccBasicState;
type ChangeHandler<T = any> = (newValue: T, oldValue: T) => void;

export const usePccBasicStore = defineStore('PccBasicInfo', () => {
  // 状态定义
  const state = reactive<PccBasicState>({
    insidePartNumber: 0,
    productDesc: '',
    version: '',
    bomType: 0,
    docNumber: '',
    applyCode: '',
    effectiveDate: null,
    creatorUserName: '',
    handlerId: '',
    remark: '',
  });

  // 脏检查相关
  const handlers = new Map<StateKey, Set<ChangeHandler>>();
  let stopWatch: WatchStopHandle | null = null;

  // 初始化监听
  const initWatch = () => {
    stopWatch = watch(
      () => ({ ...state }),
      (newState, oldState) => {
        Object.keys(newState).forEach(key => {
          const k = key as StateKey;
          if (newState[k] !== oldState[k]) {
            triggerHandlers(k, newState[k], oldState[k]);
          }
        });
      },
      { deep: true, flush: 'sync' },
    );
  };

  // 触发回调
  const triggerHandlers = <K extends StateKey>(key: K, newVal: PccBasicState[K], oldVal: PccBasicState[K]) => {
    const callbacks = handlers.get(key);
    callbacks?.forEach(cb => cb(newVal, oldVal));
  };

  // 注册监听
  const registerHandler = <K extends StateKey>(key: K, callback: ChangeHandler<PccBasicState[K]>) => {
    if (!handlers.has(key)) {
      handlers.set(key, new Set());
    }
    handlers.get(key)!.add(callback as ChangeHandler);

    // 延迟初始化监听确保组件挂载后执行
    if (!stopWatch) {
      nextTick(initWatch);
    }
  };

  // 注销监听
  const unregisterHandler = <K extends StateKey>(key: K, callback: ChangeHandler<PccBasicState[K]>) => {
    handlers.get(key)?.delete(callback as ChangeHandler);
  };

  // 原始设置方法
  const setBasicInfo = (data: Partial<PccBasicState>) => {
    Object.keys(data).forEach(key => {
      const k = key as StateKey;
      if (k in state) {
        state[k] = data[k] as never;
      }
    });
  };

  // 重置状态
  const reset = () => {
    Object.assign(state, {
      insidePartNumber: 0,
      productDesc: '',
      version: '',
      bomType: 0,
      docNumber: '',
      applyCode: '',
      effectiveDate: null,
      creatorUserName: '',
      handlerId: '',
      remark: '',
    });
  };

  return {
    ...toRefs(state),
    setBasicInfo,
    reset,
    registerHandler,
    unregisterHandler,
  };
});
