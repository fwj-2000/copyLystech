<!-- 产销率报表 -->
<template>
  <div :class="[isFullScreen ? 'fullscreen' : 'lydc-content-wrapper']">
    <Content v-model:isFullScreen="isFullScreen"></Content>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Content from './content.vue';
  defineOptions({ name: 'dashboard-operation-salesRate-detail' });

  const isFullScreen = ref<boolean>(false);
</script>

<style lang="less" scoped>
  @import url('/@/design/dashboard.less');
  @import url('/@/views/dashboard/operation/salesRate/table.less');

  .table-style(
    @borderColor: #aaa,
    @containerFontSize: 12px,
    @headFontSize: 12px,
    @bodyFontSize: 12px,
    @tdPadding: 3px 6px,
  );

  .fullscreen {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-height: 100%;
  }
</style>
