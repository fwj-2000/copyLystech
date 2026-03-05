<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="pending" :tab="t('common.todoText')">
            <handleList :activeKey="activeKey"></handleList>
          </a-tab-pane>
          <a-tab-pane key="handled" :tab="t('common.doneText')">
            <handleList :activeKey="activeKey"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  defineOptions({ name: 'qms-mrb-mrbAudit' });

  const activeKey = ref('pending');
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
