<template>
  <BasicModal
    :title="t('dict.CommonCol.transitionStage')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1000"
    @register="registerModal"
    destroy-on-close
    :showOkBtn="true"
    @ok="handleOK"
    :cancelText="t('common.closeText')">
    <Grid style="height: 300px"> </Grid>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TransitionStageColumn } from '../config';
  import { maintenanceHandle } from '/@/api/engineering/clientRollout';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(initData);

  const { createMessage } = useMessage();

  const [Grid, { reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-projectMaintain-transitionStageList',
      showIndexColumn: true,
      columns: TransitionStageColumn,
      i18nConfig: {
        moduleCode: 'NpiProjectStageColumn',
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
    },
  });

  function initData({ rows }) {
    reloadData(rows);
  }

  const handleOK = async () => {
    const dataList = getDataSource().map(item => {
      return {
        id: item.id,
        factoryCode: item.factoryCode,
        customerProductStage: item.customerProductStage,
        internalProductStage: item.internalProductStage,
        stageBeginDate: item.stageBeginDate,
        stageEndDate: item.stageEndDate,
      };
    });
    changeLoading(true);
    const { code, msg } = await maintenanceHandle({ dataList }).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closeModal();
      return;
    }
    createMessage.error(msg);
  };
</script>
