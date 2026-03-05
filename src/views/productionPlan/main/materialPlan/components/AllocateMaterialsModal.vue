<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('common.asignmetaria')" showOkBtn @ok="handleSubmit" width="1350px">
    <Grid style="height: 400px"> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { allocateMaterialsColumn } from './allocateConfig';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { materialPartAllocatematerial, materialPartMateriallist } from '/@/api/mps/productionPlan/materialPlan';

  const { t } = useI18n();
  const id = ref('');

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'pruductionPlan-main-materialPlan-AllocateMaterialsModalList',
      columns: allocateMaterialsColumn,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDemandPlanColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      proxyConfig: {
        autoLoad: false,
      },
      position: 'modal',
    },
  });

  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();

  async function reloadGrid() {
    gridApi.setLoading(true);
    const res = await materialPartMateriallist({ id: id.value });
    gridApi.reloadData(res.data || []);
    gridApi.setLoading(false);
  }

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  async function init(data) {
    id.value = data.id;
    reloadGrid();
  }

  //提交
  async function handleSubmit() {
    changeOkLoading(true);
    // 校验分配bom数量，申请数量在调配前后保持一致
    const list = gridApi.getDataSource();
    if (list.length < 2) {
      createMessage.error(t('tip.MPS.tip20')); // 至少需要两个物料进行调配
      changeOkLoading(false);
      return;
    }
    const finalArr = [list[0]]; // 传给后台的最终数组
    let beforeTotal = list[0].oQtyAfter - list[0].oQtyBefore; // 原始申请数量差额
    let afterTotal = 0; // 释放方调配后申请数量差额
    for (let i = 1; i < list.length; i++) {
      const { oQtyBefore, oQtyAfter } = list[i];
      if (oQtyAfter !== 'undefined' && oQtyAfter >= 0) {
        finalArr.push(list[i]);
        afterTotal += (oQtyBefore || 0) - (oQtyAfter || 0);
      }
    }
    if (beforeTotal !== afterTotal) {
      createMessage.error(t('tip.MPS.tip21')); // 接收方占用数量差额必须等于释放方申请数量差额总和
      changeOkLoading(false);
      return;
    }

    const res = await materialPartAllocatematerial(finalArr).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false);
    closeModal();
    emit('reload');
  }
</script>

<style scoped lang="scss">
  .assign-tip {
    padding: 10px 16px;
    border: 1px solid #ff7b00;
    border-radius: 4px;
    color: #1a1a1a;
    font-size: 14px;
    line-height: 22px;
    background-color: rgba(255, 123, 0, 0.1);
  }
</style>
