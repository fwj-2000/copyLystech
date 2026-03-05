<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey" :destroyInactiveTabPane="true">
          <a-tab-pane key="0" :tab="t('common.todoText')">
            <Grid>
              <template #toolbar-actions>
                <!-- <a-button type="primary" @click="handleAddFn">入库申请</a-button> -->
                <a-button type="primary" v-auth="'btn_review'" ghost @click="handleReview">{{ t('common.isApprovedText') }}</a-button>
                <a-button type="primary" v-auth="'btn_reject'" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
              </template>
              <template #action="{ row }">
                <TableAction outside :actions="getTableActions(row)" />
              </template>
              <template #nodeDetail="{ row }">
                <a @click="openNodeRecordModalFn(row)" class="table-a" v-auth="'btn_detail'">{{ t('common.viewDetails') }}</a>
              </template>
              <!-- <template #FilingsApplyNo="{ row }">
                <span class="table-a" @click="goDetail(row)" v-auth="'btn_detail'">{{ row.FilingsApplyNo }}</span>
              </template> -->
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
              <!-- <template #FilingsApplyNo="{ row }">
                <span class="table-a" @click="goDetail(row)" v-auth="'btn_detail'">{{ row.FilingsApplyNo }}</span>
              </template> -->
            </Grid>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ReviewPop @register="registerReviewPop"></ReviewPop>
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
  import { LEADERSHIP_COLUMNS, formConfig } from './config';
  import { transferFilling } from '/@/api/customerSerivce/fillingDemand';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { formatTableDefaultText } from '/@/utils';
  import DetailPop from './components/DetailPop.vue';
  import AddPop from './components/AddPop.vue';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { auditagree, bulkWithdraw, bulkStop, bulkDelete, getAuditpage, auditreject } from '/@/api/warehouse/warehouse';
  import { useModal } from '/@/components/Modal';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import ReviewPop from './components/ReviewPop.vue';
  import { NodeModal, RejectModal } from '/@/components/CustomComponents';

  defineOptions({ name: 'warehouseManagement-warehouseManagement' });
  const [registerDetailPop, { openPopup: openDetailPop }] = usePopup();
  const [registerReviewPop, { openPopup: openReviewPop }] = usePopup();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();

  const [registerAddPop, { openPopup: openAddPop }] = usePopup();
  const [registerNodeRecord, { openModal: openNodeRecordModal }] = useModal();
  const activeKey = ref('0');

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  // const [registerTable, { setProps, reload, getSelectRowKeys, getSelectRows, clearSelectedRowKeys }] = useTable({
  //   api: getAuditpage,
  //   beforeFetch: params => {
  //     const _p = {
  //       ...params,
  //       type: activeKey.value,
  //     };
  //     return _p;
  //   },
  //   columns: LEADERSHIP_COLUMNS,
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
      collapsed: false,
      showCollapseButton: false,
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
      id: 'warehouseManagement-warehousing-leadership-list',
      columns: LEADERSHIP_COLUMNS,
      // toolbarConfig: {
      //   superQuery: true,
      // },
      api: getAuditpage,
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
      transformCellText: ({ text }) => formatTableDefaultText(text),
    },
  });
  const { reload, getSelectRowKeys, clearSelectedRowKeys } = gridApi;

  //  驳回
  async function handleReject() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      openRejectModal(true, {
        api: auditreject,
        ids: idList,
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  function handleReview() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `是否同意审核?`,
      onOk: async () => {
        try {
          const { code, msg } = await auditagree(ids);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleReject is error ');
        }
      },
      onCancel: () => {},
    });
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

  async function handleStop() {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.warning(t('common.checkOperationText'));
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: `是否确认终止?`,
      onOk: async () => {
        try {
          const { code, msg } = await bulkStop(ids);
          if (code === 200) {
            message.success(msg);
            clearSelectedRowKeys();
            return reload();
          }
          message.error(msg);
        } catch (error) {
          throw new Error('handleReject is error ');
        }
      },
      onCancel: () => {},
    });
  }

  function goDetail(record) {
    openDetailPop(true, {
      title: '入库申请详情',
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
