<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('dict.CommonCol.modifyRecord')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="false"
    @register="registerModal">
    <div style="height: 500px">
      <Grid />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { recordColumns } from './recordModalConfig';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getOperateRecord } from '/@/api/engineering/engineeringReview';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emit = defineEmits(['reload']);
  const { t } = useI18n();

  const [registerModal] = useModalInner(init);

  const currentId = ref('');

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: undefined,
    gridOptions: {
      // @ts-ignore
      treeConfig: false,
      mouseConfig: {
        area: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: recordColumns,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      position: 'modal',
      api: getOperateRecord,
      beforeFetch: params => {
        return {
          ...params,
          id: currentId.value,
        };
      },
    },
  });

  /**
   * @description 初始化修改记录
   * @param data
   */
  function init(data: { id: string }) {
    currentId.value = data.id;
    nextTick(() => {
      gridApi.grid.commitProxy('reload');
    });
  }
</script>
