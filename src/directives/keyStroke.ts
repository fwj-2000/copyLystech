/**
 * @description: 键盘指令
 * @param {string|Array} keys 键盘按键
 * @param {Function} handler 回调函数
 * @param {Object} options 配置选项 { debounce, throttle }
 * @example:
 * <!-- 方式1：简易数组传参（不支持配置选项） -->
 * <div v-key-stroke="['Control', 'S', handleSave]"></div>
 *
 * <!-- 方式2：标准数组传参（支持配置选项） -->
 * <div v-key-stroke="[['Control', 'S'], handleSave, { throttle: 300 }]"></div>
 *
 * <!-- 方式3：使用修饰符 -->
 * <div v-key-stroke.prevent="[['Control', 'S'], handleSave]"></div>
 */
import type { App, Directive, DirectiveBinding } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import { useDebounceFn, useThrottleFn } from '@vueuse/core';
import { Tooltip } from 'ant-design-vue';
import { createApp, h } from 'vue';

type KeyStrokeHandler = (e: KeyboardEvent) => void;
type Options = {
  debounce?: number;
  throttle?: number;
  tooltip?: string;
};

// 创建 Tooltip 的辅助函数
function createTooltip(el: HTMLElement, keys: string[], customTooltip?: string) {
  // 格式化快捷键显示
  const formatKeys = keys
    .map(key => {
      switch (key.toLowerCase()) {
        case 'control':
          return 'Ctrl';
        case 'ctrl':
          return 'Ctrl';
        case 'shift':
          return 'Shift';
        case 'alt':
          return 'Alt';
        case 'meta':
          return 'Cmd'; // Mac
        default:
          return key.toUpperCase();
      }
    })
    .join('+');

  const tooltipText = customTooltip || `快捷键: ${formatKeys}`;

  // 存储信息供外部使用
  el.setAttribute('data-shortcut', formatKeys);

  // 如果父元素有 tooltip，就更新它
  const parent = el.parentElement;
  if (parent && parent.classList.contains('ant-tooltip')) {
    const tooltipInner = parent.querySelector('.ant-tooltip-inner');
    if (tooltipInner) {
      const originalTitle = el.getAttribute('title') || el.getAttribute('data-original-title') || '';
      el.setAttribute('data-original-title', originalTitle);
      el.setAttribute('title', `${originalTitle} (${formatKeys})`);
    }
  } else {
    // 如果没有现有的 tooltip，就添加 title 属性
    const originalTitle = el.getAttribute('title') || '';
    el.setAttribute('data-original-title', originalTitle);
    el.setAttribute('title', `${originalTitle} ${originalTitle ? '| ' : ''}${tooltipText}`);
  }
}

// 创建按键判断函数
const createKeyPredicate = (keys: string[]) => {
  const modifiers = {
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  };
  let mainKey = '';

  keys.forEach(key => {
    const lowerKey = key.toLowerCase();
    switch (lowerKey) {
      case 'control':
      case 'ctrl':
        modifiers.ctrl = true;
        break;
      case 'shift':
        modifiers.shift = true;
        break;
      case 'alt':
        modifiers.alt = true;
        break;
      case 'meta':
        modifiers.meta = true;
        break;
      default:
        mainKey = lowerKey;
    }
  });

  return (e: KeyboardEvent) => {
    return (
      e.key.toLowerCase() === mainKey &&
      e.ctrlKey === modifiers.ctrl &&
      e.shiftKey === modifiers.shift &&
      e.altKey === modifiers.alt &&
      e.metaKey === modifiers.meta
    );
  };
};

// 统一参数解析
const parseBinding = (binding: DirectiveBinding) => {
  let keys: string[],
    handler: KeyStrokeHandler,
    options = {};
  const value = binding.value;
  if (!value) return false;

  // 处理方式1：['Control', 'S', handler, { tooltip: '保存' }]
  if (Array.isArray(value) && value.length >= 3 && typeof value[value.length - 2] === 'function') {
    keys = value.slice(0, -2) as string[];
    handler = value[value.length - 2];
    options = value[value.length - 1] || {};
  }
  // 处理方式2：[ [keys], handler, options? ]
  else if (Array.isArray(value) && value.length >= 2) {
    [keys, handler, options = {}] = value as [string[], KeyStrokeHandler, Options];
  } else {
    throw new Error('Invalid v-key-stroke binding format');
  }

  return { keys, handler, options };
};

// 核心绑定逻辑
const bindKeyStroke = (el: HTMLElement, binding: DirectiveBinding) => {
  // 清理旧监听
  if (el._keyStrokeCleanup) {
    el._keyStrokeCleanup();
    delete el._keyStrokeCleanup;
  }

  // 移除旧的 tooltip 信息
  if (el._keyStrokeTooltip) {
    const originalTitle = el.getAttribute('data-original-title') || '';
    el.setAttribute('title', originalTitle);
    el.removeAttribute('data-original-title');
    el.removeAttribute('data-shortcut');
  }
  try {
    const data = parseBinding(binding);
    if (!data) return;
    const { keys, handler, options } = data;

    // 创建 tooltip
    if (options.tooltip !== false) {
      // 默认显示，除非明确设置为 false
      createTooltip(el, keys, typeof options.tooltip === 'string' ? options.tooltip : undefined);
      el._keyStrokeTooltip = true;
    }

    // 参数校验
    if (!Array.isArray(keys) || keys.length === 0) {
      console.warn('[v-key-stroke] 必须提供有效的按键数组');
      return;
    }

    if (typeof handler !== 'function') {
      console.warn('[v-key-stroke] 必须提供有效的处理函数');
      return;
    }

    let finalHandler = handler;

    const typedOptions: Options = options as Options;
    if (typedOptions.debounce) {
      finalHandler = useDebounceFn(finalHandler, typedOptions.debounce);
    } else if (typedOptions.throttle) {
      finalHandler = useThrottleFn(finalHandler, typedOptions.throttle);
    }

    const predicate = createKeyPredicate(keys);
    const wrappedHandler = (e: KeyboardEvent) => {
      // if (binding.modifiers.prevent) e.preventDefault();
      // if (binding.modifiers.stop) e.stopPropagation();

      // 默认禁止浏览器默认时间
      // 禁止传递事件
      e.preventDefault();
      e.stopPropagation();
      finalHandler(e);
    };

    el._keyStrokeCleanup = onKeyStroke(predicate, wrappedHandler);
  } catch (error) {
    console.error('[v-key-stroke] 指令初始化失败:', error);
  }
};

// 确保在卸载时清理
const keyStrokeDirective: Directive = {
  mounted: (el, binding) => bindKeyStroke(el, binding),
  updated: (el, binding) => bindKeyStroke(el, binding),
  beforeUnmount: el => {
    if (el._keyStrokeCleanup) {
      el._keyStrokeCleanup();
      delete el._keyStrokeCleanup;
    }
    if (el._keyStrokeTooltip) {
      const originalTitle = el.getAttribute('data-original-title') || '';
      el.setAttribute('title', originalTitle);
      el.removeAttribute('data-original-title');
      el.removeAttribute('data-shortcut');
      delete el._keyStrokeTooltip;
    }
  },
};

export function setupKeyStrokeDirective(app: App) {
  app.directive('keyStroke', keyStrokeDirective);
}

export default keyStrokeDirective;
