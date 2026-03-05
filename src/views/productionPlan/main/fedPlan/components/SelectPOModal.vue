<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.feedPlan.selectPO')" showOkBtn @ok="handleSubmit" width="1000px">
    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getPoOrderDeteil, updateOnlyMaterial } from '/@/api/productionPlan/MPS';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { selectPOColumn } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getPOSelectList } from '/@/api/mps/productionPlan/MPS';

  const emit = defineEmits(['register', 'added', 'reload', 'selectPOForChild', 'refreshMainTableExpand']);
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const state = ref({ id: '' });

  const [Grid, { reload, getSelectRows, reloadColumn, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-selectPOList',
      columns: selectPOColumn,
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
      },
      data: [
        { id: 'xx001', isOpen: 1, supplierName: 'test', PONumber: '10011' },
        { id: 'xx002', isOpen: 2, supplierName: 'test2', PONumber: '10012' },
        { id: 'xx003', isOpen: 1, supplierName: 'test2', PONumber: '10013' },
        { id: 'xx004', isOpen: 2, supplierName: 'test2', PONumber: '10014' },
        { id: 'xx005', isOpen: 2, supplierName: 'test2', PONumber: '10015' },
        { id: 'xx006', isOpen: 2, supplierName: 'test2', PONumber: '10016' },
      ] as any[],
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const handleRow = ref();
  async function init({ row }) {
    changeLoading(true);
    handleRow.value = row;
    // const { data } = await getPoOrderDeteil(id);
    state.value = row.id;
    changeLoading(false);
  }

  //提交
  async function handleSubmit() {
    const selectRows = getSelectRows();
    handleRow.value.childrenData = selectRows;
    emit('selectPOForChild', handleRow.value);
    emit('refreshMainTableExpand');
    // changeOkLoading(true);
    // const res = await updateOnlyMaterial({
    // });
    // createMessage.success(res.msg);
    // changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    // emit('reload');
  }
</script>
