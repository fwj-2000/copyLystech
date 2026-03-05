<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('dict.CommonCol.maintenance')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup p-10px">
    <div class="title-stick mt-20px">
      <div class="gun"></div>
      <div class="title">{{ t('dict.CommonCol.projectMaintenance') }}</div>
    </div>

    <Grid style="height: calc(100% - 74px)">
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { MaintainColumn } from '../config';
  import { TableAction } from '/@/components/Table';
  import { maintenanceHandle } from '/@/api/engineering/clientRollout';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { t } = useI18n();

  const emits = defineEmits(['reload']);

  const { createMessage } = useMessage();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, { reloadData, remove, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-projectMaintain-maintainList',
      columns: MaintainColumn,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'NpiProjectStageColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-clearn',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  const handleDelete = row => {
    remove(row);
  };

  async function init({ rows }) {
    reloadData(rows);
  }

  // 点击提交
  async function handleSaveFn() {
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
      closePopup();
      return;
    }
    createMessage.error(msg);
  }

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }
</style>
