<!-- 数据为空的展示 -->
<template>
  <div class="empty-wrapper flex column">
    <img :src="emptyComplainSvg" style="width: 128px; height: 128px" />
    <p class="empty-tips">{{ t('common.emptyComplain') }}</p>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';

  import emptyComplainSvg from '/@/assets/svg/report/no_complain.svg';

  const { t } = useI18n();
</script>

<style lang="less" scoped>
  .empty-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
