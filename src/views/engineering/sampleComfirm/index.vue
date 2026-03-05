<template>
  <div id="EngineeringSampleComfirm" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.待处理" :tab="t('common.todoText')">
            <Pending />
          </a-tab-pane>
          <a-tab-pane :key="TABS_ENUM.已处理" :tab="t('common.doneText')">
            <Processed />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent } from 'vue';
  import { TABS_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'engineering-sampleComfirm' });

  const Pending = defineAsyncComponent(() => import('./components/pending/index.vue'));
  const Processed = defineAsyncComponent(() => import('./components/processed/index.vue'));

  const { t } = useI18n();
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待处理);
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
