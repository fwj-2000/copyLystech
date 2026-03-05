<template>
  <div class="border-settings">
    <div class="dropdown-container flex" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
      <div class="border-btn">
        <slot></slot>
        <DownOutlined class="text-[10px]" />
      </div>

      <Transition name="dropdown">
        <div v-show="showDropdown" class="dropdown shadow-md">
          <div class="dropdown-item" v-for="(dimensions, size) in props.list" :key="size" @click="handleSizeClick(size, dimensions)">
            <i :class="dimensions.icon"></i>
            {{ dimensions.name }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';

  const props = defineProps({
    list: {
      type: Array,
      default: () => [
        { name: '上边框', icon: 'icon-ym icon-ym-report-icon-border-top' },
        { name: '下边框', icon: 'icon-ym icon-ym-report-icon-border-bottom' },
        { name: '右边框', icon: 'icon-ym icon-ym-report-icon-border-right' },
        { name: '左边框', icon: 'icon-ym icon-ym-report-icon-border-left' },
        { name: '显示边框', icon: 'icon-ym icon-ym-report-icon-border-all' },
        { name: '隐藏边框', icon: 'icon-ym icon-ym-report-icon-border-none justify-start' },
      ],
    },
  });

  const showDropdown = ref(false);
  const emit = defineEmits(['setOption', 'alignmentMethod']);

  const handleSizeClick = (size, dimensions) => {
    if (dimensions.alignmentMethod) {
      emit('alignmentMethod', dimensions.alignmentMethod);
    } else {
      emit('setOption', dimensions.name);
    }

    showDropdown.value = false;
  };
</script>

<style lang="less" scoped>
  .border-settings {
    position: relative;
    height: 100%;
    display: inline-block;
  }

  .dropdown-container {
    position: relative;
    height: 100%;
  }

  .border-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: white;
    border-radius: 8px;
    min-width: 180px;
    z-index: 10;
    transform-origin: top center;
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
  }

  .dropdown-item:hover {
    background: #f5f5f5;
  }

  /* 下拉动画 */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.25s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .dropdown-enter-to,
  .dropdown-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
