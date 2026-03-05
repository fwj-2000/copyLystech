import type { CSSProperties } from 'vue';
import type { Ref } from 'vue';

import { useDraggable } from '@vueuse/core';
import { ref, watch, watchEffect, computed } from 'vue';

export function usePreviewDrag(options: { modalTitleRef: Ref<HTMLElement | undefined>; enabled: Ref<boolean> }) {
  // 使用外部传入的modalTitleRef或创建新的引用
  const { modalTitleRef, enabled } = options;

  // 配置useDraggable以确保正确工作
  const { x, y, isDragging } = useDraggable(modalTitleRef, {
    // 允许在按住鼠标时拖动
    preventDefault: true,
    // 阻止事件冒泡，避免与其他事件冲突
    stopPropagation: false,
  });

  const startX = ref<number>(0);
  const startY = ref<number>(0);
  const startedDrag = ref(false);
  const transformX = ref(0);
  const transformY = ref(0);
  const preTransformX = ref(0);
  const preTransformY = ref(0);
  const dragRect = ref({ left: 0, right: 0, top: 0, bottom: 0 });
  watch([x, y], () => {
    if (!startedDrag.value && modalTitleRef?.value && enabled.value) {
      startX.value = x.value;
      startY.value = y.value;
      const bodyRect = document.body.getBoundingClientRect();
      const titleRect = modalTitleRef.value.getBoundingClientRect();
      dragRect.value.right = bodyRect.width - titleRect.width;
      dragRect.value.bottom = bodyRect.height - titleRect.height;
      preTransformX.value = transformX.value;
      preTransformY.value = transformY.value;
    }
    startedDrag.value = true;
  });

  watch(isDragging, newValue => {
    if (!newValue && enabled.value) {
      startedDrag.value = false;
    }
  });

  watchEffect(() => {
    if (startedDrag.value && enabled.value) {
      transformX.value = preTransformX.value + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) - startX.value;
      transformY.value = preTransformY.value + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) - startY.value;
    }
  });

  const transformStyle = computed<CSSProperties>(() => {
    if (!enabled.value) {
      return {
        height: '100%',
      };
    }

    return {
      transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      height: '100%',
    };
  });

  return { transformStyle };
}
