<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content h-full">
        <a-tabs class="bg-white" v-model:activeKey="activeKey">
          <a-tab-pane key="PE" tab="PE打印记录">
            <handleList :activeKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
          <a-tab-pane key="IN" tab="IN打印记录">
            <handleList :activeKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
          <a-tab-pane key="OUT" tab="OUT打印记录">
            <handleList :activeKey="activeKey" ref="handleReviewRef"></handleList>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import handleList from './list.vue';
  // import { useI18n } from '/@/hooks/web/useI18n';

  // const { t } = useI18n();

  defineOptions({ name: 'engineering-mouldRoom-repairMoldApproval' });

  const activeKey = ref('PE');
  // const handleReviewRef = ref();
  // const reloadTable = () => {
  //   handleReviewRef.value.reload();
  // };
</script>
<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
