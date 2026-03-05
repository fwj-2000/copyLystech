<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="btnType === 'add' ? true : false"
    v-loading="btnLoading"
    :title="t('common.enter')"
    destroyOnClose
    @ok="handleSave(0)"
    :okText="t('dict.SMAApplyStatus.Storage')"
    class="full-popup p-10px">
    <template #appendToolbar>
      <a-button type="primary" v-if="btnType === 'add'" @click="handleSave(1)" class="ml-12px">{{ t('dict.Flow.NodeAction.1') }}</a-button>
      <a-button type="primary" v-else @click="handleSave(2)" class="ml-12px">{{ t('common.saveText') }}</a-button>
    </template>

    <div class="title-stick">
      <div class="gun"></div>
      <div class="title">{{ t('dict.CommonCol.customerOnlineData') }}</div>
    </div>

    <Grid style="height: calc(100% - 74px)">
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { EntryColumn, editRules } from '../config';
  import { TableAction } from '/@/components/Table';
  import { enterOpt } from '/@/api/engineering/clientRollout';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);
  const btnType = ref('');

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-clientLaunchData-entryList',
      columns: EntryColumn,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      pagerConfig: {
        autoHidden: true,
      },
      editRules,
    },
  });

  function handleAfterPaster({ targetAreas, pasteCells }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }

    // IQC结论复制
    handleAfterPasterIQCConclusionsEnum(cols, rows, pasteCells);
    // 上线结论
    handleAfterPasterOnlineConclusionsEnum(cols, rows, pasteCells);
  }

  const conclusionsOption = ref([
    { fullName: 'OK', enCode: 1 },
    { fullName: 'NG', enCode: 2 },
  ]);

  /** IQC结论 复制处理 */
  function handleAfterPasterIQCConclusionsEnum(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'iQCConclusionsEnum');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      return Object.assign(item, {
        iQCConclusionsEnum: Number(targetValue),
        iQCConclusions: conclusionsOption.value.find(conclusions => Number(conclusions.enCode) === Number(targetValue))?.fullName,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  /** 上线结论 复制处理 */
  function handleAfterPasterOnlineConclusionsEnum(cols: Array<{ field: string }>, rows: Array<any>, pasteCells: any) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'onlineConclusionsEnum');
    if (targetIndex == -1) return false;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || '';
      return Object.assign(item, {
        onlineConclusionsEnum: Number(targetValue),
        onlineConclusions: conclusionsOption.value.find(conclusions => Number(conclusions.enCode) === Number(targetValue))?.fullName,
      });
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

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
    gridApi.remove(row);
  };

  async function init({ type, list }) {
    btnType.value = type;
    gridApi.reloadData(cloneDeep(list));
  }

  // 点击提交
  async function handleSave(optType) {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const params = {
      optType,
      inputDatas: gridApi.getDataSource().map(item => {
        return {
          id: item.id,
          numberOfIQCSamples: item.numberOfIQCSamples,
          ngNumberOfIQCSamples: item.ngNumberOfIQCSamples,
          detailsOfIQCExceptions: item.detailsOfIQCExceptions,
          iQCConclusions: item.iQCConclusionsEnum,
          customerOnlineNumber: item.customerOnlineNumber,
          customerOnlineNgNumber: item.customerOnlineNgNumber,
          onlineDetailsOfExceptions: item.onlineDetailsOfExceptions,
          onlineConclusions: item.onlineConclusionsEnum,
          remark: item.remark,
        };
      }),
    };
    changeLoading(true);
    const { code, msg } = await enterOpt(params).finally(() => {
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
