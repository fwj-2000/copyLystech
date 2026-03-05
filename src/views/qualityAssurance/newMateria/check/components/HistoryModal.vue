<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :title="t('common.viewHistoryText')"
    :showOkbtn="false"
    destroyOnClose
    class="batch-modal"
    @register="registerModal"
    @ok="handleSubmit">
    <Grid :style="{ minHeight: '550px' }"></Grid>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getcheckHistory } from '/@/api/quanlity/newMetarialCheck';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref } from 'vue';

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const id = ref('');

  const [Grid, { getSelectRows, query }] = useVbenVxeGrid({
    gridOptions: {
      api: getcheckHistory,
      columns: [
        { title: 'IQC检测状态', field: 'iqcStatus', width: 150, sortable: true },
        // { title: 'IQC检测日期', field: 'iqcHandleTime', minWidth: 180, i18nField: 'iqcHandleDateTime', cellRender: { name: 'Date' } },
        { title: '实测数据', field: 'iqcFieldTest', width: 120 },
        { title: '检验备注', field: 'iqcRemarks', width: 120 },
        { title: 'IQC检测人', field: 'iqcUserName', width: 120 },
        { title: '创建日期', field: 'creatorTime', i18nField: 'CommonCol.creatorTime', minWidth: 180, cellRender: { name: 'Date' } },
      ],
      toolbarConfig: {
        enabled: false,
      },
      beforeFetch: params => {
        return {
          ...params,
          id: id.value,
        };
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
      position: 'modal',
    },
  });
  const [registerModal, { closeModal }] = useModalInner(init);
  function init(data) {
    id.value = data.id;
    query();
  }
  function handleSubmit() {
    closeModal();
    emit('reload', getSelectRows());
  }
</script>
