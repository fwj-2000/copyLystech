<template>
  <div class="word-color-picker">
    <div class="color-trigger" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <div class="letter-container flex">
        <div class="w-20px">
          <div class="letter">A</div>
          <div class="color-indicator" :style="{ backgroundColor: selectedColor }"></div>
        </div>
        <DownOutlined class="text-[10px]" />
      </div>
    </div>

    <div class="color-picker-container" v-show="isColorPickerVisible" @mouseenter="keepPickerOpen" @mouseleave="handleMouseLeave">
      <ColorSelector v-model="selectedColor" @confirm="hideColorPicker" @cancel="hideColorPicker" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import ColorSelector from './colorSelector.vue';

  const selectedColor = defineModel<any>('selectedColor');
  const isColorPickerVisible = ref(false);
  const emit = defineEmits(['submit']);
  let keepOpenTimer: number | null = null;

  function handleMouseEnter() {
    if (keepOpenTimer) {
      clearTimeout(keepOpenTimer);
      keepOpenTimer = null;
    }
    isColorPickerVisible.value = true;
  }

  function handleMouseLeave() {
    // 添加延迟关闭，避免鼠标移出时立即关闭导致无法移动到选择器
    keepOpenTimer = setTimeout(() => {
      isColorPickerVisible.value = false;
    }, 200);
  }

  function hideColorPicker() {
    emit('submit');
    isColorPickerVisible.value = false;
  }

  function keepPickerOpen() {
    // 当鼠标移动到选择器上时，取消关闭计时器
    if (keepOpenTimer) {
      clearTimeout(keepOpenTimer);
      keepOpenTimer = null;
    }
  }
</script>

<style scoped>
  /* 样式保持不变 */
  .word-color-picker {
    position: relative;
    display: inline-block;
    user-select: none;
  }

  .color-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 2px;
    border-radius: 2px;
  }

  .color-trigger:hover {
    background-color: #f0f0f0;
  }

  .letter-container {
    position: relative;
    width: 100%;
    text-align: center;
  }

  .letter {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .color-indicator {
    width: 100%;
    height: 2px;
    border-radius: 1px;
  }

  .color-picker-container {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    margin-top: 5px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  }
</style>
