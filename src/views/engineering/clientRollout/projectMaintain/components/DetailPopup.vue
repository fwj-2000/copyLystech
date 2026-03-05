<template>
  <BasicModal
    :title="t('dict.CommonCol.phaseChangeRecord')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="1000"
    @register="registerModal"
    destroy-on-close
    :showOkBtn="false"
    :cancelText="t('common.closeText')">
    <Grid style="height: 300px"> </Grid>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getStageChangeRecord } from '/@/api/engineering/clientRollout';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { StageChangeLogColumn } from '../config';
  const { t } = useI18n();

  const [registerModal, { closeModal }] = useModalInner(initData);

  const id = ref('');

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-projectMaintain-stageChangeRecordlist',
      showIndexColumn: true,
      columns: StageChangeLogColumn,
      api: getStageChangeRecord,
      i18nConfig: {
        moduleCode: 'NpiProjectStageColumn',
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
      proxyConfig: {
        response: {
          list: 'data',
        },
      },
      beforeFetch: params => {
        return {
          ...params,
          projectStageId: id.value,
        };
      },
    },
  });

  function initData(data) {
    id.value = data.id;
    reload();
  }
</script>
