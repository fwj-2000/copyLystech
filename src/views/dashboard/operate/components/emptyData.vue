<!-- 数据为空的展示 -->
<template>
  <div class="empty-wrapper flex column">
    <img :src="emptyDataSvg" style="width: 128px; height: 128px" />
    <p class="empty-tips">{{ t('common.emptyData') }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '/@/hooks/web/useI18n';

import emptyDataSvg from '/@/assets/svg/report/empty_data.svg';

const { t } = useI18n();
</script>

<style lang="less" scoped>
.empty-wrapper {
  width: 100%;
  height: 100%;
}
</style>
