/*
 * src/directives/feature.ts
 *
 * 通用功能开关/权限指令 v-feature
 * - 支持：featureKey(s)（来自全局 sysConfig），perm(s)（按钮权限码），自定义 predicate
 * - 支持逻辑：featureOp / permOp (AND|OR)
 * - 失败策略（优先级 remove > disable > hide）
 * - 兼容：对 Ant Design Vue Upload / Upload.Dragger 做增强的禁用样式处理
 *
 * 用法示例（简短）：
 *  <a-upload v-feature>                       // 省略绑定值，默认检查 uploadFunSw
 *  <a-upload v-feature="'uploadFunSw'">  // 字符串视为 sysConfig key
 *  <a-upload v-feature="{ feature:'key', perm:'btn_x', remove:true }"> // 对象写法
 *  <a-button v-feature.disable="{ perm:['btn_a','btn_b'], permOp:'OR' }">...</a-button>
 *  <a-upload v-feature="(ctx) => ctx.route.meta.debug"> 自定义 predicate </a-upload>
 *
 * 注册方法（在 main.ts 中）：
 *  import { setupFeatureDirective } from '/@/directives/feature';
 *  setupFeatureDirective(app);
 */

import type { App, Directive, DirectiveBinding } from 'vue';
import { watch, watchEffect } from 'vue';
import { useAppStoreWithOut } from '/@/store/modules/app';
import { useUserStoreWithOut } from '/@/store/modules/user';

// ---- types ----
type Op = 'AND' | 'OR';
type FeatureKey = string;
type PermCode = string;

type Ctx = {
  appStore: ReturnType<typeof useAppStoreWithOut>;
  userStore: ReturnType<typeof useUserStoreWithOut>;
  route: any;
  el: HTMLElement;
};

type FeatureBinding =
  | FeatureKey
  | FeatureKey[]
  | {
      feature?: FeatureKey | FeatureKey[];
      featureOp?: Op; // 默认 AND
      perm?: PermCode | PermCode[];
      permOp?: Op; // 默认 AND
      remove?: boolean; // 不通过时移除
      disable?: boolean; // 不通过时禁用
      predicate?: (ctx: Ctx) => boolean; // 自定义判定
    }
  | ((ctx: Ctx) => boolean)
  | boolean;

// ---- global element extension (for storing prev state) ----
declare global {
  interface HTMLElement {
    __vFeatureStop__?: () => void;
    __vFeaturePrevDisplay__?: string | null;
    __vFeaturePrevTabIndex__?: number | null;
    __vFeaturePrevPointerEvents__?: string | null;
  }
}

// ---- utils ----
function normalizeArray<T>(v?: T | T[]): T[] {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function foldBools(list: boolean[], op: Op = 'AND'): boolean {
  if (!list.length) return true;
  return op === 'OR' ? list.some(Boolean) : list.every(Boolean);
}

function isBooleanLike(val: any): val is boolean {
  return typeof val === 'boolean';
}

function getModelId(binding: DirectiveBinding) {
  const inst: any = binding.instance;
  return inst?.$route?.meta?.modelId ?? '';
}

// ---- checkers ----
function checkFeatures(feature: FeatureKey | FeatureKey[] | undefined, featureOp: Op, appStore: ReturnType<typeof useAppStoreWithOut>): boolean {
  if (feature == null) return true; // 未配置视为通过
  const keys = normalizeArray(feature);
  const cfg = appStore.getSysConfigInfo || {};
  const results = keys.map(k => Boolean((cfg as Record<string, any>)[k]));
  return foldBools(results, featureOp);
}

function checkPerms(perm: PermCode | PermCode[] | undefined, permOp: Op, modelId: string, userStore: ReturnType<typeof useUserStoreWithOut>): boolean {
  if (!perm) return true;
  if (!modelId) return false;
  const list = (userStore.getPermissionList || []).filter((o: any) => o.modelId === modelId);
  if (!list.length) return false;
  const btnList: any[] = list[0]?.button ?? [];
  const perms = normalizeArray(perm);
  const results = perms.map(code => btnList.some(b => b?.enCode === code));
  return foldBools(results, permOp);
}

// ---- evaluate binding to boolean ----
function evaluate(binding: DirectiveBinding<FeatureBinding>, el: HTMLElement): boolean {
  const appStore = useAppStoreWithOut();
  const userStore = useUserStoreWithOut();
  const route = (binding.instance as any)?.$route;
  const ctx: Ctx = { appStore, userStore, route, el };

  // 1) 直接布尔/响应式布尔
  if (isBooleanLike(binding.value)) return !!binding.value;

  // 2) 直接 predicate
  if (typeof binding.value === 'function') {
    try {
      return !!(binding.value as (c: Ctx) => boolean)(ctx);
    } catch (e) {
      // predicate 异常视为不通过
      // console.warn('[v-feature] predicate error', e);
      return false;
    }
  }

  // 3) 字符串/数组 => 视为 featureKey(s)
  if (typeof binding.value === 'string' || Array.isArray(binding.value)) {
    return checkFeatures(binding.value as any, 'AND', appStore);
  }

  // 4) 对象配置
  const obj = (binding.value || {}) as Exclude<FeatureBinding, string | string[] | boolean | Function>;
  const { feature, featureOp = 'AND', perm, permOp = 'AND', predicate } = obj as any;

  const featPass = checkFeatures(feature, featureOp, appStore);
  const permPass = checkPerms(perm, permOp, getModelId(binding), userStore);
  const predPass = predicate ? !!predicate(ctx) : true;

  return featPass && permPass && predPass;
}

// ---- apply strategy: hide / remove / disable (with Ant Upload support) ----
function applyStrategy(el: HTMLElement, pass: boolean, opts: { remove: boolean; disable: boolean }) {
  // Helper: 判断是否是 antd upload/dragger 容器（宽松检测）
  const isAntUpload =
    el.classList.contains('ant-upload') ||
    el.classList.contains('ant-upload-dragger') ||
    !!el.querySelector('.ant-upload') ||
    !!el.querySelector('.ant-upload-dragger');

  if (pass) {
    // 恢复显示
    if (el.__vFeaturePrevDisplay__ != null) {
      el.style.display = el.__vFeaturePrevDisplay__ as string;
      el.__vFeaturePrevDisplay__ = null;
    } else {
      el.style.removeProperty('display');
    }

    // 恢复禁用前状态
    if (opts.disable) {
      if (el.hasAttribute('disabled')) el.removeAttribute('disabled');
      if (el.hasAttribute('aria-disabled')) el.removeAttribute('aria-disabled');

      if (el.__vFeaturePrevTabIndex__ != null) {
        (el as any).tabIndex = el.__vFeaturePrevTabIndex__;
        el.__vFeaturePrevTabIndex__ = null;
      } else {
        try {
          delete (el as any).tabIndex;
        } catch {}
      }

      if (el.__vFeaturePrevPointerEvents__ != null) {
        el.style.pointerEvents = el.__vFeaturePrevPointerEvents__!;
        el.__vFeaturePrevPointerEvents__ = null;
      } else {
        el.style.removeProperty('pointer-events');
      }

      // 恢复 ant-upload-disabled class
      if (isAntUpload && el.classList.contains('ant-upload-disabled')) {
        el.classList.remove('ant-upload-disabled');
        el.style.opacity = '';
      }
    }
    return;
  }

  if (opts.remove) {
    el.parentNode?.removeChild(el);
    return;
  }

  if (opts.disable) {
    // 保存原始状态
    if (el.__vFeaturePrevTabIndex__ == null) el.__vFeaturePrevTabIndex__ = (el as any).tabIndex ?? null;
    if (el.__vFeaturePrevPointerEvents__ == null) el.__vFeaturePrevPointerEvents__ = el.style.pointerEvents || null;

    // 标准禁用属性（对原生元素有效）
    try {
      el.setAttribute('disabled', 'true');
    } catch {}
    el.setAttribute('aria-disabled', 'true');
    (el as any).tabIndex = -1;
    el.style.pointerEvents = 'none';

    // 如果是 antd upload/dragger，添加对应的禁用样式类，降低不透明度以示禁用
    if (isAntUpload) {
      el.classList.add('ant-upload-disabled');
      el.style.opacity = '0.6';
    }

    return;
  }

  // 默认隐藏
  if (el.__vFeaturePrevDisplay__ == null) {
    el.__vFeaturePrevDisplay__ = getComputedStyle(el).display || '';
  }
  el.style.display = 'none';
}

// ---- directive ----
const DEFAULT_FEATURE_KEY = 'uploadFunSw';

const featureDirective: Directive<HTMLElement, FeatureBinding> = {
  mounted(el, binding) {
    const appStore = useAppStoreWithOut();
    const userStore = useUserStoreWithOut();

    // 修饰符支持： .remove / .disable
    const removeByMod = Boolean(binding.modifiers?.remove);
    const disableByMod = Boolean(binding.modifiers?.disable);

    // 解析对象参数
    const obj = typeof binding.value === 'object' && binding.value !== null ? (binding.value as any) : {};

    // 当省略绑定值（binding.value 为 undefined）时：默认检查 DEFAULT_FEATURE_KEY
    const isOmitted = binding.value === undefined;

    const remove = obj.remove ?? removeByMod ?? false;
    const disable = obj.disable ?? disableByMod ?? false;

    // 监听：sysConfig、permissionList、路由、以及绑定值本身（支持响应式）
    const stopA = watch(
      () => appStore.getSysConfigInfo,
      () => {
        // if binding omitted and no explicit feature specified, evaluate with default key
        if (isOmitted) {
          // emulate as if binding.value is DEFAULT_FEATURE_KEY
          const pass = applyEvaluateWithFallback(binding, el, DEFAULT_FEATURE_KEY);
          applyStrategy(el, pass, { remove, disable });
        } else {
          const pass = evaluate(binding, el);
          applyStrategy(el, pass, { remove, disable });
        }
      },
      { immediate: true, deep: true },
    );

    const stopB = watch(
      () => [userStore.getPermissionList, getModelId(binding)],
      () => {
        if (isOmitted) {
          const pass = applyEvaluateWithFallback(binding, el, DEFAULT_FEATURE_KEY);
          applyStrategy(el, pass, { remove, disable });
        } else {
          const pass = evaluate(binding, el);
          applyStrategy(el, pass, { remove, disable });
        }
      },
      { immediate: true, deep: true },
    );

    const stopC = watchEffect(() => {
      if (!el.isConnected) return;
      if (isOmitted) {
        const pass = applyEvaluateWithFallback(binding, el, DEFAULT_FEATURE_KEY);
        applyStrategy(el, pass, { remove, disable });
      } else {
        const pass = evaluate(binding, el);
        applyStrategy(el, pass, { remove, disable });
      }
    });

    el.__vFeatureStop__ = () => {
      stopA && stopA();
      stopB && stopB();
      stopC && stopC();
    };
  },

  updated(el, binding) {
    const obj = typeof binding.value === 'object' && binding.value !== null ? (binding.value as any) : {};
    const removeByMod = Boolean(binding.modifiers?.remove);
    const disableByMod = Boolean(binding.modifiers?.disable);
    const remove = obj.remove ?? removeByMod ?? false;
    const disable = obj.disable ?? disableByMod ?? false;

    // 支持省略默认 key
    if (binding.value === undefined) {
      const pass = applyEvaluateWithFallback(binding, el, DEFAULT_FEATURE_KEY);
      applyStrategy(el, pass, { remove, disable });
    } else {
      const pass = evaluate(binding, el);
      applyStrategy(el, pass, { remove, disable });
    }
  },

  unmounted(el) {
    el.__vFeatureStop__?.();
    delete el.__vFeatureStop__;
  },
};

// helper to evaluate when binding omitted -> treat as DEFAULT_FEATURE_KEY
function applyEvaluateWithFallback(binding: DirectiveBinding<FeatureBinding>, el: HTMLElement, key: string) {
  // if user passed nothing, we consider that as checking the default feature key
  // but if user passed explicit object/boolean/function we shouldn't reach here
  // create a pseudo-binding where value === key
  const pseudo = { ...binding, value: key } as DirectiveBinding<FeatureBinding>;
  try {
    return evaluate(pseudo, el);
  } catch (e) {
    return false;
  }
}

export function setupFeatureDirective(app: App) {
  app.directive('feature', featureDirective);
}

export default featureDirective;
