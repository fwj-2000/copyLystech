<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('dict.PCCApplyColumn.commonTemplate')"
    width="1000px"
    draggable
    @register="registerModal"
    @ok="handleSubmit"
    @fullscreen="onFullscreen"
    destroy-on-close>
    <BasicTable @register="registerTable" ref="selectTable" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, ColumnChangeParam, useTable } from '/@/components/Table';
  import { getTemplatePage } from '/@/api/engineering/pcc';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const emit = defineEmits(['submit', 'register']);

  const { createMessage } = useMessage();

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(() => {});
  const [registerTable, { getSelectRows }] = useTable({
    canResize: true,
    api: getTemplatePage,
    columns: getBasicColumns(),
    rowKey: 'id',
    showTableSetting: false,
    clickToRowSelect: true,
    rowSelection: {
      type: 'radio',
    },
    // showSelectionBar: true // 显示多选状态栏
  });

  function getBasicColumns() {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
        align: 'center',
      },
      {
        title: t('common.templateName'),
        dataIndex: 'templateName',
      },
      {
        title: t('common.templateRemarks'),
        dataIndex: 'templateRemark',
        width: 150,
      },
    ];
  }

  const selectTable = ref<InstanceType<typeof BasicTable> | undefined>();

  const onFullscreen = async () => {
    await nextTick();
    selectTable.value?.redoHeight();
  };
  function handleSubmit() {
    const rows = getSelectRows();
    if (rows.length === 0) return createMessage.error(t('common.selectTemplate'));
    emit('submit', rows[0]);
    closeModal();
  }
</script>
