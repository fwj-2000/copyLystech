<template>
  <div class="lydc-content-wrapper-content bg-white h-full">
    <Grid>
      <template #toolbar-actions>
        <!-- 撤回 -->
        <ModelConfirmButton
          v-auth="'btn_recall'"
          v-bind="{
            modelConfirm: {
              title: t('common.tipTitle'),
              content: t('views.filings.sureRevokeData'),
              onOk: handleRecall.bind(null),
            },
            type: 'primary',
          }">
          <span>{{ t('common.revoke') }}</span>
        </ModelConfirmButton>
        <!-- 终止 -->
        <a-button type="primary" danger v-auth="'btn_stop'" @click="handleStop">
          {{ t('common.stopText') }}
        </a-button>
        <!-- 批量删除 -->
        <a-button v-auth="'btn_batchRemove'" type="primary" ghost danger @click="handleBatchDelete">{{ t('common.batchDelText') }}</a-button>
        <!-- 批量导出 -->
        <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
      </template>
      <template #nodeDetail="{ row }">
        <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
      </template>
      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
  </div>
  <NodeModal @register="registerNodeModal" />
  <ExportModal @register="registerExportModal" />
  <StopModal @register="registerStopModal" @reload="reload" />

  <Teleport defer to="#popupwrap">
    <DetailPopup @register="registerApplyPop" @reload="reload" />
  </Teleport>
</template>
<script lang="ts" setup>
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { ModelConfirmButton } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import { getColumns, getFormConfig } from './config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';
  import { getList, exportExcel, getNodeList, bulkBackReview, bulkBackTermination, bulkDelete } from '/@/api/customerSerivce/customsAffairsApply';
  import DetailPopup from './detailPopup.vue';
  import { STATUS_ENUM } from '../../config';

  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
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
      id: 'customerService-filings-demand-todoList',
      columns: getColumns() as any,
      beforeFetch: formatParams,
      api: (params: any) => getList({ ...params, identification: '2' }),
      pagerConfig: {
        autoHidden: false,
      },
      // toolbarConfig: {
      //   delStatus: true
      // },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  function formatParams(params: any) {
    const newParams = { ...params };
    if (Array.isArray(params.time) && params.time.length > 0) {
      newParams.startTime = params.time[0];
      newParams.endTime = params.time[1];
      delete newParams.time;
    }
    return newParams;
  }

  const { reload, getFetchParams, getSelectRowKeys } = gridApi;

  /**
   * 打开 详情页面
   * @param record
   */
  function edit(record: any) {
    openMenuPopup(true, {
      id: record.id,
    });
  }
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        auth: 'btn_detail',
        onClick: edit.bind(null, record),
      },
    ];
  }

  const handleExport = async () => {
    const params = await getFetchParams();
    const { pager } = gridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportExcel,
      listQuery: { ...formatParams(params), ...omit(pager, 'total'), identification: '2' },
      exportOptions: getColumns().slice(2),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    });
  };

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  async function handleRecall() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return bulkBackReview(idList).finally(reload);
    }
    createMessage.warn(t('common.selectText'));
  }

  //  终止
  const [registerStopModal, { openModal: openStopModal }] = useModal();
  async function handleStop() {
    const idList = getSelectRowKeys() || [];
    if (!idList.length) {
      return createMessage.warn(t('common.selectText'));
    }
    openStopModal(true, {
      api: bulkBackTermination,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: idList,
          terminationRemarks: params.remark,
        };
      },
    });
  }

  /** 批量删除 */
  function handleBatchDelete() {
    const rows = gridApi.getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    }

    // 只能删除状态为【终止(`12`)】的数据
    if (rows.some(r => +r.status !== STATUS_ENUM.终止)) {
      return createMessage.warning(t('common.delStatusCheckTip', [t('dict.FilingsApplyStatusEnum.12')]));
    }

    return createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () =>
        bulkDelete(rows.map(r => r.id)).then(() => {
          createMessage.success(t('common.delSuccess'));
          reload();
        }),
    });
  }

  defineExpose({
    /** 打开详情页面 */
    openDetail: edit,
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
