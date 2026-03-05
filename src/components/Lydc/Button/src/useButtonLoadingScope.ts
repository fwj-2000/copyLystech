import { reactive, computed } from 'vue';

const scopeMap = reactive<Map<string | symbol, { activeId: symbol | null }>>(new Map());

function getScope(scope: string | symbol) {
  if (!scopeMap.has(scope)) {
    scopeMap.set(scope, { activeId: null });
  }
  return scopeMap.get(scope)!;
}

interface UseButtonLoadingScopeOptions {
  scope?: string | symbol;
  follow?: boolean;
}

export function useButtonLoadingScope(options: UseButtonLoadingScopeOptions = {}) {
  const { scope, follow = true } = options;

  const realScope = scope ?? Symbol('LYDCButtonScope');

  const scopeState = getScope(realScope);
  const buttonId = Symbol('LYDCButton');

  const isActive = computed(() => {
    return scopeState.activeId === buttonId;
  });

  const isDisabled = computed(() => {
    if (!follow) return false;
    return !!scopeState.activeId && !isActive.value;
  });

  function start() {
    scopeState.activeId = buttonId;
  }

  function end() {
    if (scopeState.activeId === buttonId) {
      scopeState.activeId = null;
    }
  }

  return {
    isActive,
    isDisabled,
    start,
    end,
  };
}
