<template>
  <div class="expand-block">
    <div class="expand-header">
      <Subtitle :title="title" style="padding-bottom: 0"></Subtitle>
    </div>
    <div class="expand-item p-10px">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';

  interface IProps {
    title: string;
  }
  const props = withDefaults(defineProps<IProps>(), {
    title: '',
  });

  const { title } = toRefs(props);
</script>

<style lang="less" scoped>
  .expand-header {
    background: rgb(245 245 245 / 86%);
    height: 38px;
    display: flex;
    align-items: center;
    padding: 12px;
  }

  .expand-block {
    border: 1px solid #dbdbdb;
    border-bottom: 0;
  }
</style>
