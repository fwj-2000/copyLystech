<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane :key="TABS_ENUM.待处理" :tab="t('common.todoText')">
            <TodoGrid>
              <template #toolbar-actions>
                <a-space>
                  <a-button v-auth="'btn_confirm_delivery'" type="primary" @click="handleConcat">{{ t('common.deliveryComfirm') }}</a-button>
                  <a-button v-auth="'btn_transfer'" type="primary" ghost @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
                  <a-button v-auth="'btn_download'" @click="handleDownload">{{ t('common.batchExport') }}</a-button>
                  <a-button v-auth="'btn_verify'" @click="handleStatusVerify">{{ t('common.verifyQuick') }}</a-button>
                </a-space>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction :actions="getTableActions(row)" />
              </template>
            </TodoGrid>
          </a-tab-pane>

          <a-tab-pane :key="TABS_ENUM.已处理" :tab="t('common.doneText')">
            <DoneGrid>
              <template #toolbar-actions>
                <a-button v-auth="'btn_download'" @click="handleDownload">{{ t('common.batchExport') }}</a-button>
              </template>
              <template #nodeDetail="{ row }">
                <span class="table-a" @click="handleNodeModal(row)"> {{ t('common.searchDetail') }} </span>
              </template>
              <template #action="{ row }">
                <TableAction :actions="getTableActions(row)" />
              </template>
            </DoneGrid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <TransferModal @register="registerModal" @reload="reload"></TransferModal>
    <ExportModal @register="registerExportModal" />
    <DetailPop @register="registerDetailModal" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { tabelConfig, columns, TABS_ENUM, formatRequestParams, schemas } from './tableConfigVxe';
  import { TransferModal, NodeModal } from '/@/components/CustomComponents/index';
  import { getPMListAPI, getPMtransferuserAPI, exportPMExleAPI, checkAllAPI } from '/@/api/productionPlan/mainplan';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import DetailPop from './components/DetailPopup.vue';
  import { getNodelist } from '/@/api/business/quantitation';
  import { useRoute } from 'vue-router';
  import { handleCheckType } from '/@/utils/quanlity/isCheck';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { merge, omit } from 'lodash-es';

  const emits = defineEmits(['edit', 'detail']); // 批量需求整合、查看详情
  defineOptions({ name: 'business-deliveryConfirm' });

  const { t } = useI18n();

  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待处理);

  const [TodoGrid, todoGridApi] = useVbenVxeGrid(
    merge({}, tabelConfig, {
      formOptions: {
        schema: schemas(TABS_ENUM.待处理),
      },
      gridOptions: {
        id: 'business-deliveryConfirm-todo',
        api: (params: any) => getPMListAPI({ ...params, identification: TABS_ENUM.待处理 }),
        toolbarConfig: {
          superQuery: true,
        },
      },
    }),
  );
  const { reload, getSelectRows, getFetchParams, getSelectRowKeys } = todoGridApi;

  const [DoneGrid, doneGridApi] = useVbenVxeGrid(
    merge({}, tabelConfig, {
      formOptions: {
        schema: schemas(TABS_ENUM.已处理),
      },
      gridOptions: {
        id: 'business-deliveryConfirm-done',
        toolbarConfig: {
          superQuery: true,
        },
        api: (params: any) => getPMListAPI({ ...params, identification: TABS_ENUM.已处理 }),
      },
    }),
  );

  // 跳转到详情页
  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('common.detailText'),
        icon: 'icon-ym icon-ym-view',
        auth: 'btn_detail',
        onClick: handleDetail.bind(null, record.id),
      },
    ];
  }

  // 批量下载
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerDetailModal, { openPopup: openDetailModal }] = usePopup();
  const handleDownload = async () => {
    const isTodoTab = activeKey.value === TABS_ENUM.待处理;

    const params = isTodoTab ? await getFetchParams() : await doneGridApi.getFetchParams();
    const { pager } = isTodoTab ? todoGridApi.grid.getProxyInfo()! : doneGridApi.grid.getProxyInfo()!;

    openExportModal(true, {
      api: exportPMExleAPI,
      listQuery: {
        ...formatRequestParams(params),
        ...omit(pager, 'total'),
        identification: activeKey.value,
      },
      exportOptions: columns.slice(2, -1),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'QuantitativeDeliveryConfirmColumn',
      },
    });
  };

  // 处理转办
  const [registerModal, { openModal }] = useModal();
  // 批量转办
  const handleBatchTransfer = async () => {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.selectDataTip'));
    }
    openModal(true, {
      ids: ids || [],
      api: getPMtransferuserAPI,
      beforeFetch: params => {
        return {
          ids: ids || [],
          transferRemarks: params.remark,
          transferUserId: params.transferUser,
        };
      },
    });
  };

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.quantitativeApplyId,
    });
  }

  // 批量处理
  const handleConcat = () => {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.selectDataTip'));
    }
    const rowList = getSelectRows();
    if (handleCheckType(rowList)) {
      openDetailModal(true, {
        ids,
      });
    }
  };
  // 点击详情
  const handleDetail = id => {
    openDetailModal(true, {
      ids: [id],
    });
  };

  // 一键校验
  const handleStatusVerify = () => {
    checkAllAPI().then(res => {
      if (res.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        reload();
      }
    });
  };
  const route = useRoute();
  onMounted(() => {
    // 从路由进入详情时，路由上`id`不是当前数据的（是流程`id`）
    // 不能直接使用`id`获取详情，改为使用【单号(`billNo`)】和【产品内部料号(`partNumber`)】获取详情
    const { billNo, partNumber } = route.query as any;
    if (billNo && partNumber) {
      openDetailModal(true, {
        applyNo: billNo,
        innerMaterialNumber: partNumber,
      });
    }
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');

  :deep(.lydc-content-wrapper-content) {
    .vxe-grid {
      padding-top: 0;
    }

    .ant-tabs.ant-tabs-top,
    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }

    .vxe-form--wrapper .vxe-form--item:first-child .vxe-form--item-content {
      padding-left: 0;
    }
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
