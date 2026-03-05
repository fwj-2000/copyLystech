<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" :destroyInactiveTabPane="true">
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <Grid>
              <template #toolbar-actions>
                <a-button type="primary" v-auth="'btn_approve'" ghost @click="handleReview">{{ t('common.approval') }}</a-button>
                <a-button type="primary" v-auth="'btn_reject'" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
              <template #nodeDetail="{ row }">
                <a @click="openNodeRecordModalFn(row)" class="table-a" v-auth="'btn_detail'">{{ t('common.viewDetails') }}</a>
              </template>
            </Grid>
          </a-tab-pane>
          <a-tab-pane key="1" :tab="t('common.doneText')">
            <Grid>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
              <template #nodeDetail="{ row }">
                <a @click="openNodeRecordModalFn(row)" class="table-a" v-auth="'btn_detail'">{{ t('common.viewDetails') }}</a>
              </template>
            </Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ReviewPop @register="registerReviewPop" @reload="reload"></ReviewPop>
    <DetailPop @register="registerDetailPop"></DetailPop>
    <AddPop @register="registerAddPop" @reload="reload"></AddPop>
    <NodeModal @register="registerNodeRecord" />
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { WAREHOUSEAPPROVAL_COLUMNS, formConfig } from './config';
  import { transferFilling } from '/@/api/customerSerivce/fillingDemand';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import DetailPop from './components/DetailPop.vue';
  import AddPop from './components/AddPop.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { warehouseauditreject, bulkWithdraw, bulkStop, bulkDelete, getWarehouseauditpage } from '/@/api/warehouse/warehouse';
  import { useModal } from '/@/components/Modal';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import ReviewPop from './components/ReviewPop.vue';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';

  defineOptions({ name: 'warehouseManagement-warehouseManagement' });
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerReviewPop, { openPopup: openReviewPop }] = usePopup();

  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  const activeKey = ref('0');

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  // const [registerTable, { setProps, reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys }] = useTable({
  //   api: getWarehouseauditpage,
  //   beforeFetch: params => {
  //     const _p = {
  //       ...params,
  //       type: activeKey.value,
  //     };
  //     return _p;
  //   },
  //   columns: WAREHOUSEAPPROVAL_COLUMNS,
  //   useSearchForm: true,
  //   striped: true,
  //   ellipsis: true,
  //   rowSelection: { type: 'checkbox' },
  //   clickToRowSelect: false,
  //   actionColumn: {
  //     width: 100,
  //     title: t('common.action'),
  //     dataIndex: 'action',
  //   },
  //   tableSetting: {
  //     // delStatus: true,
  //   },
  //   showIndexColumn: false,
  //   isCanResizeParent: false,
  //   canResize: true,
  //   pagination: {
  //     pageSize: 100,
  //   },
  //   formConfig: formConfig as any,
  //   transformCellText: ({ text }) => formatTableDefaultText(text),
  // });
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: formConfig as any,
      // i18nConfig: {
      //   moduleCode: 'ECNColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'warehouseManagement-warehousing-warehouseApproval-list',
      columns: WAREHOUSEAPPROVAL_COLUMNS,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getWarehouseauditpage,
      useSearchForm: true,
      striped: true,
      ellipsis: true,
      clickToRowSelect: false,
      bordered: true,
      // i18nConfig: {
      //   moduleCode: 'ECNColumn',
      // },
      beforeFetch: params => {
        const _p = {
          ...params,
          type: activeKey.value,
        };
        return _p;
      },
      showIndexColumn: false,
      isCanResizeParent: false,
      canResize: true,
      pagination: {
        pageSize: 100,
      },
      tableSetting: {
        delStatus: true,
      },
      transformCellText: ({ text }) => formatTableDefaultText(text),
    },
  });
  const { reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys } = gridApi;

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openRejectModal(true, {
        api: warehouseauditreject,
        ids: idList,
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  function handleReview() {
    if (getSelectRowKeys().length) {
      openReviewPop(true, { dataSource: getSelectRows() });
    } else {
      createMessage.warning(t('common.checkOperationText'));
    }
  }

  function openNodeRecordModalFn(record: any = '') {
    openNodeRecordModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function goDetail(record) {
    openDetailPop(true, {
      title: t('dict.WarehouseFlowNode.warehouseApplyDetails'),
      data: [record],
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: goDetail.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  onMounted(() => {
    reload();
  });
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');
</style>

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

  :deep(.ant-tabs-nav) {
    padding-left: 12px !important;
  }
</style>
