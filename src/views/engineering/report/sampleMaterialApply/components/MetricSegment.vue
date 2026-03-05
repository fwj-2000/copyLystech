<template>
  <div class="metric-segment">
    <div v-for="item in options" :key="item.value" class="metric-segment-item" :class="{ active: modelValue === item.value }" @click="change(item.value)">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    modelValue: String,
    options: {
      type: Array,
      default: () => [
        { label: '面积', value: 'area' },
        { label: '达标率', value: 'rate' },
        // { label: "金额", value: "amount" }
      ],
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const change = (v: string) => {
    emit('update:modelValue', v);
    emit('change', v);
  };
</script>

<style scoped>
  .metric-segment {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border-radius: 16px;
    background: #ffe6d5;
    user-select: none;

    /* 整体变小 */
    transform: scale(0.85);
    transform-origin: left center;
  }

  .metric-segment-item {
    padding: 3px 10px;
    border-radius: 14px;
    font-size: 13px;
    color: #d58c6b;
    cursor: pointer;
    transition: 0.2s;
    white-space: nowrap;
  }

  .metric-segment-item.active {
    background: #ff8a00;
    color: white;
  }
</style>
