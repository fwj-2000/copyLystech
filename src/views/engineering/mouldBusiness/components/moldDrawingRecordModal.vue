<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :cancelText="t('common.closeText')"
    :show-ok-btn="false"
    :title="t('dict.CommonCol.auditRecord')"
    :width="1100"
    :minHeight="500"
    destroy-on-close>
    <Grid />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { fileStatusOptions } from './moldDrawingConfig';
  import { getDrawingOperateRecord } from '/@/api/engineering/moldDrawingLibrary';

  const { t } = useI18n();

  const currentDataId = ref<string>('');

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      height: '500px',
      id: 'engineering-mouldBusiness-moldDrawing-operation-recored-list',
      columns: [
        {
          field: 'seq',
          title: t('component.table.index'),
          type: 'seq',
          width: '50',
          align: 'center',
        },
        // 变更前
        {
          title: t('common.beforeTheChange'),
          field: 'updateFrontStatus',
          width: '200',
          cellRender: {
            name: 'Tag',
            options: fileStatusOptions as any,
          },
        },
        // 变更后
        {
          title: t('common.afterTheChange'),
          field: 'updateAfterStatus',
          width: '200',
          cellRender: {
            name: 'Tag',
            options: fileStatusOptions as any,
          },
        },
        // 变更原因
        {
          title: t('dict.CommonCol.changeReason'),
          field: 'reason',
          width: '200',
        },
        // 操作人
        {
          title: t('dict.CommonCol.operator'),
          field: 'operateUserName',
          width: '200',
        },
        // 操作时间
        {
          title: t('dict.CommonCol.operatingTime'),
          field: 'operateDate',
          width: '200',
          cellRender: {
            name: 'Date',
            format: 'YYYY-MM-DD HH:mm:ss',
          },
        },
      ],
      api: getDrawingOperateRecord,
      beforeFetch: (params: any) => ({
        ...params,
        id: currentDataId.value,
      }),
      pagerConfig: {
        autoHidden: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: '',
      },
    },
  });

  const [registerModal, { closeModal }] = useModalInner(init);
  function init(data: { id: string }) {
    if (!data.id) {
      closeModal();
      return false;
    }
    currentDataId.value = data.id;
    gridApi.reload();
  }
</script>
