<template>
  <Grid>
    <template #toolbar-actions>
      <template v-if="props.type === TAB_ENUM.待处理">
        <!-- 制作 -->
        <a-button v-auth="'btn_edit'" type="primary" @click="handleBatchEdit">{{ t('dict.filings.recordDataProduction') }}</a-button>
        <!-- 不维护 -->
        <a-button v-auth="'btn_pass'" danger :loading="updateMaintainedTypeLoading" @click="() => handleUpdateMaintainedType(1)">{{
          t('dict.filings.notMaintained')
        }}</a-button>
        <!-- 转办 -->
        <a-button v-auth="'btn_transfer'" @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
      </template>
      <template v-else>
        <!-- 撤回 -->
        <a-button v-auth="'btn_recall'" type="primary" :loading="updateMaintainedTypeLoading" @click="handleEnabledMaintainedType">{{
          t('common.revoke')
        }}</a-button>
      </template>
      <!-- 批量导出 -->
      <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
    </template>

    <template #auditRecord="{ row }">
      <div class="table-a cursor-pointer" @click="handleAuditRecordModal(row)"> {{ t('common.detailText') }} </div>
    </template>

    <template #action="{ row }">
      <TableAction :outside="true" :actions="getTableActions(row)" />
    </template>
  </Grid>

  <ExportModal @register="registerExportModal" />
  <TransferModal @register="registerModal" @reload="reload" />
  <AuditRecordModal @register="registerAuditRecordModal" />

  <Teleport defer to="#engineeringFilingsMaintainBox">
    <DetailPop @register="registerDetailPop" />
    <ApplyPop @register="registerApplyPop" @reload="reload" />
  </Teleport>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getFormConfig, getColumns, TAB_ENUM } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getList, exportExcel, bulkTransfer, updateMaintainedType } from '/@/api/engineering/customsAffairsEngineering';
  import { omit } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { TransferModal } from '/@/components/CustomComponents/index';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import ApplyPop from './components/ApplyPop.vue';
  import DetailPop from './components/detailPopup.vue';
  import AuditRecordModal from './components/auditRecordModal.vue';
  import { TableAction, ActionItem } from '/@/components/Table';

  const props = defineProps({
    type: {
      type: Number as PropType<TAB_ENUM>,
      default: TAB_ENUM.待处理,
    },
  });

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerModal, { openModal }] = useModal();
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-filings-maintain-list',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params, type: props.type }),
      pagerConfig: {
        autoHidden: false,
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, getFetchParams, getSelectRows, clearSelectedRowKeys } = gridApi;

  function getTableActions(record: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: goDetail.bind(null, record),
      },
      // {
      //   icon: 'icon-ym icon-ym-edit',
      //   auth: 'btn_edit',
      //   onClick: goEdit.bind(null, record),
      // },
    ];
  }

  /** 批量导出 */
  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcel,
      listQuery: { ...params, ...omit(pager, 'total'), type: props.type },
      exportOptions: getColumns().slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FilingsApplyColumn',
      },
    });
  };

  const handleTransferCB = async data => {
    const r = await bulkTransfer({
      ids: data.id.map(el => el.id),
      transferUserId: data.transferUser,
      transferRemarks: data.remark,
    });
    return r;
  };

  /** 转办 */
  const handleBatchTransfer = async () => {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }
    // 未建单无id
    openModal(true, {
      id: rows || [],
      submitCallback: handleTransferCB,
    });
    clearSelectedRowKeys();
  };

  /** 制作 */
  function handleBatchEdit() {
    const rows = getSelectRows();

    // 只能编辑一条数据
    if (rows.length !== 1) {
      return rows.length === 0 ? createMessage.warning(t('common.selectDataTip')) : createMessage.warning(t('dict.NewMoldColumn.selectOneItemTip'));
    }

    // 如果勾选了`已审核(2)`数据，提示该数据不可编辑
    if (rows.some(item => +item.engineeringStatus === 2)) {
      return createMessage.warning(t('common.verifiedDataModifyTip'));
    }

    openMenuPopup(true, {
      ids: rows.map(item => item.id),
      type: 'edit',
      title: t('common.editText'),
    });
    clearSelectedRowKeys();
  }

  const [registerDetailPop, { openPopup: openDetailPopup }] = usePopup();
  function goDetail(row: any) {
    openDetailPopup(true, { id: row.id });
  }

  const [registerAuditRecordModal, { openModal: openAuditRecordModal }] = useModal();
  /** 节点详情 */
  function handleAuditRecordModal(record: any) {
    openAuditRecordModal(true, {
      id: record.id,
      type: '1',
    });
  }

  const updateMaintainedTypeLoading = ref<boolean>(false);
  /**
   * 更新维护类型
   * @param maintainedType 维护类型 1-无需维护，2-启动维护
   */
  function handleUpdateMaintainedType(maintainedType: 1 | 2) {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    updateMaintainedTypeLoading.value = true;
    updateMaintainedType({
      ids: rows.map(item => item.id),
      maintainedType,
    })
      .then(() => {
        createMessage.success(t('common.operatorSuccess'));
        reload();
      })
      .finally(() => {
        updateMaintainedTypeLoading.value = false;
      });
  }

  /** 启用维护 */
  function handleEnabledMaintainedType() {
    const rows = getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectText'));
    }

    // 只能对【状态】为【不维护(`5`)】的数据才能撤回、启用维护
    const set = new Set(['1', '5']);
    if (rows.some(item => !set.has(`${item.engineeringStatus}`))) {
      return createMessage.warning(t('common.allowStatusTodo', [`${t('dict.FilingsApplyDataStatusEnum.1')}、${t('dict.FilingsApplyDataStatusEnum.5')}`]));
    }

    handleUpdateMaintainedType(2);
  }

  /** 路由进入详情页面处理 */
  function handleRouteParams(params) {
    const { id, status } = params;
    if (!id) {
      return;
    }
    const doneStatus = ['2', '5'];
    doneStatus.includes(`${status}`)
      ? goDetail({ id })
      : openMenuPopup(true, {
          ids: [id],
          type: 'edit',
          title: t('common.editText'),
        });
  }

  defineExpose({
    handleRouteParams,
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
