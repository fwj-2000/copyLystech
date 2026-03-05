<!-- 操作按钮组 -->
<template>
  <a-space>
    <!-- 跳转手工数据 -->
    <a-button type="primary" @click="go('/dashboard/operate/expense/manualData')">手工数据</a-button>
    <!-- 跳转底稿数据 -->
    <a-button type="primary" @click="go('/dashboard/operate/expense/draftPage')">底稿数据</a-button>
    <!-- 批量导入导出 -->
    <a-dropdown>
      <template #overlay>
        <a-menu :items="batchMenuItems" @click="handleClickBatchItem"> </a-menu>
      </template>
      <a-button :loading="batchLoading">{{ t('common.batchImportOrExport') }}</a-button>
    </a-dropdown>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import { batchMenuItems } from './config';

  const batchLoading = ref(false);
  const { t } = useI18n();
  const go = useGo();

  const handleClickBatchItem = async ({ item }) => {
    batchLoading.value = true;
    const { clickMethod } = item.originItemValue;
    clickMethod && (await clickMethod().catch());
    batchLoading.value = false;
  };
</script>
