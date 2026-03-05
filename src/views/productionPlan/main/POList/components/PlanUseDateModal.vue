<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('tip.PR.adjustPlanUseDate')" showOkBtn @ok="handleSubmit" width="1000px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDetailPO, updatellanusedatePO } from '/@/api/mps/productionPlan/MPS';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { planUseDateColumn, planUseDateEditRules } from '../config';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, { reload, validate, getDataSource, reloadData }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-POList-list-PlanUseDateModal',
      columns: planUseDateColumn,
      i18nConfig: {
        moduleCode: 'PorOrderColumn',
      },
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: planUseDateEditRules,
      position: 'modal',
    },
  });

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  async function init({ ids }) {
    changeLoading(true);
    const { code, data } = await getDetailPO(ids).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      reloadData(data);
    }
  }
  //提交
  async function handleSubmit() {
    if (await validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    changeOkLoading(true);
    const tableData = await getDataSource();
    const params = tableData.map(item => {
      return {
        id: item.id,
        planUseDate: dayjs(item.planUseDateNew).valueOf(),
        delayExplain: item.delayExplain,
      };
    });
    const res = await updatellanusedatePO(params).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    closeModal(); //关闭弹窗
    emit('reload');
  }
</script>
