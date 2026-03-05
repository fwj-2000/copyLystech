<template>
  <div class="dropdown" :class="[overlayClassName, { 'dropdown-disabled': disabled }]" :style="overlayStyle" ref="dropdownRef">
    <div class="dropdown-trigger" ref="triggerRef" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleTriggerMouseLeave">
      <template v-if="$slots.default">
        <!-- 获取所有插槽内容 -->
        <component :is="getFirstVNode($slots.default())" />
      </template>
      <transition name="dropdown-slide">
        <div
          class="dropdown-overlay"
          v-show="internalVisible"
          ref="overlayRef"
          :style="overlayPosition"
          @mouseenter="handleOverlayMouseEnter"
          @mouseleave="handleOverlayMouseLeave">
          <div class="dropdown-menu" @click="handleMenuClick">
            <slot name="overlay" :style="overlayPosition"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import type { Ref } from 'vue';

  const props = withDefaults(
    defineProps<{
      disabled?: boolean;
      getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
      overlayClassName?: string;
      overlayStyle?: object;
      visible?: boolean;
      closeOnClick?: boolean;
    }>(),
    {
      disabled: false,
      getPopupContainer: undefined,
      overlayClassName: '',
      overlayStyle: () => ({}),
      visible: undefined,
      closeOnClick: true,
    },
  );

  const triggerRef: Ref<HTMLElement | null> = ref(null);
  const overlayRef: Ref<HTMLElement | null> = ref(null);
  const internalVisible = ref(true);
  const overlayPosition = ref({ top: '0', left: '0', minWidth: '0px' });
  const isMouseOverDropdown = ref(false);
  let closeTimeout: number | null = null;

  watch(
    () => props.visible,
    val => {
      internalVisible.value = val ?? false;
    },
    { immediate: true },
  );

  watch(internalVisible, async val => {
    if (val) {
      await positionOverlay();
    }
  });

  onMounted(() => {
    setTimeout(() => {
      positionOverlay();
    }, 0);
  });

  onUnmounted(() => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
    }
  });

  // 获取插槽中的第一个 VNode
  const getFirstVNode = vnodes => {
    if (!Array.isArray(vnodes) || vnodes.length === 0) return null;
    // 返回第一个 vnode，用 <component :is=""> 渲染
    return vnodes[0];
  };
  const positionOverlay = async () => {
    await nextTick();
    if (!triggerRef.value || !overlayRef.value) return;

    const firstChild = triggerRef.value.firstElementChild as HTMLElement | null;
    if (!firstChild) return;

    const triggerRect = firstChild.getBoundingClientRect();
    const overlayEl = overlayRef.value;
    let top = 0;
    let left = 0;
    const width = triggerRect.width;

    const offset = 3;
    top = triggerRect.bottom;
    left = triggerRect.left;

    overlayPosition.value = {
      top: `${top + offset}px`,
      left: `${left}px`,
      minWidth: `${width}px`,
    };
  };

  const openDropdown = () => {
    if (props.disabled) return;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    internalVisible.value = true;
  };

  const closeDropdown = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
    internalVisible.value = false;
  };

  const handleClick = (e: MouseEvent) => {
    if (props.disabled) return;
  };

  const handleMouseEnter = () => {
    if (props.disabled) return;
    isMouseOverDropdown.value = true;
    openDropdown();
  };

  const handleTriggerMouseLeave = () => {
    if (props.disabled) return;
    isMouseOverDropdown.value = false;
    scheduleCloseIfNeeded();
  };

  const handleOverlayMouseEnter = () => {
    if (props.disabled) return;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  };

  const handleOverlayMouseLeave = () => {
    if (props.disabled) return;
    scheduleCloseIfNeeded();
  };

  const handleMenuClick = (e: MouseEvent) => {
    closeDropdown();
  };

  const scheduleCloseIfNeeded = () => {
    if (!isMouseOverDropdown.value) {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
      closeTimeout = window.setTimeout(() => {
        if (!isMouseOverDropdown.value) {
          closeDropdown();
        }
      }, 100);
    }
  };
</script>
<style lang="less">
  .dropdown-menu {
    width: 100%;

    button {
      padding: 0 12px;
      text-align: left;
      width: 100%;
      border-radius: 4px;
      color: rgb(0 0 0 / 88%);
      font-size: 14px;
      height: 32px;
      line-height: 32px;
    }

    button:hover {
      background-color: rgb(243 244 246);
    }
  }
</style>
<style lang="less" scoped>
  .dropdown {
    display: inline-block;
    position: relative;
  }

  .dropdown-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .dropdown-overlay {
    position: fixed;
    z-index: 1000;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    transform-origin: top center;
    overflow: hidden;

    * {
      box-sizing: border-box;
    }
  }

  .dropdown-menu {
    width: 100%; /* 撑满 overlay */
    list-style: none;
    margin: 0;
    cursor: pointer;
    padding: 4px;
    display: flex;
    flex-direction: column;
  }

  /* 下拉动画效果 */
  .dropdown-slide-enter-active,
  .dropdown-slide-leave-active {
    transition: all 0.2s ease;
  }

  .dropdown-slide-enter-from,
  .dropdown-slide-leave-to {
    opacity: 0;
    transform: scaleY(0);
    max-height: 0;
  }

  .dropdown-slide-enter-to,
  .dropdown-slide-leave-from {
    opacity: 1;
    transform: scaleY(1);
    max-height: 500px;
  }
</style>
