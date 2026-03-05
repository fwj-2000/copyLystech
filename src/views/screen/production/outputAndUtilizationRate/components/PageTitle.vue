<!-- 标题 -->
<template>
  <div class="relative w-full">
    <img :src="titleSvg" class="w-full" />
    <div class="absolute top-0 left-0 w-full h-[80%] flex center">
      <span class="text-[#fff] font-bold" style="font-size: 1.5rem; letter-spacing: 4px">{{ props.title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import titleSvg from '../title.svg';

  interface IProps {
    title?: string;
  }
  const props = withDefaults(defineProps<IProps>(), {
    title: '',
  });
</script>
