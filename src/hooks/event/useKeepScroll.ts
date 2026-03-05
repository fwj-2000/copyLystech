import { ref, onActivated, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
export default function useKeepScroll(
  options: {
    refEl?: Ref<HTMLElement | null>;
    refElName?: string;
    getScrollDom?: () => HTMLElement | null;
  } = {
    refEl: ref(null),
    refElName: '',
  },
) {
  /**
   * 获取滚动DOM元素的函数
   * 根据不同的配置选项返回对应的滚动元素
   * @returns {HTMLElement|null} 返回滚动DOM元素，如果没有找到则返回null
   */
  const getScrollDom = (): HTMLElement | null => {
    if (options.getScrollDom) {
      return options.getScrollDom();
    }
    if (options.refEl) {
      return options.refEl.value;
    }
    const relElName = options?.refElName || 'body';
    return document.querySelector(relElName);
  };

  let savedScrollTop = ref(0); // 保存滚动位置
  let scrollDom = getScrollDom(); // 获取滚动DOM元素
  onMounted(() => {
    scrollDom = getScrollDom();
    scrollDom?.addEventListener('scroll', () => {
      savedScrollTop.value = scrollDom?.scrollTop || 0;
    });
  });
  onUnmounted(() => {
    scrollDom?.removeEventListener('scroll', () => {
      savedScrollTop.value = scrollDom?.scrollTop || 0;
    });
  });
  // 恢复滚动位置
  onActivated(() => {
    if (savedScrollTop.value) {
      scrollDom?.scrollTo({ top: savedScrollTop.value });
    }
  });
  return { savedScrollTop };
}
