<!-- 异常状态指示图标 -->
<template>
  <img :src="isDownState ? unionDownSvg : unionSvg" :style="`${isDownState ? 'margin-top: 4px;' : 'margin-bottom: 4px;'}`" />
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import unionSvg from '/@/assets/svg/report/union.svg';
  import unionDownSvg from '/@/assets/svg/report/union_down.svg';

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
  });

  const isDownState = computed(() => {
    return !props.value || Number.parseInt(props.value, 10) === 0;
  });
</script>
