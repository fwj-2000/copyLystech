<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_response'" type="primary" @click="requireDeliveryTimeFn()" v-if="props.searchKey === '0'">{{
              t('dict.SampleDeliveryReplyNode.DeliveryReply')
            }}</a-button>
            <a-button v-auth="'btn_transfer'" type="primary" ghost @click="transferFn()" v-if="props.searchKey === '0'">{{ t('common.transfer') }}</a-button>
            <a-button v-auth="'btn_reject'" type="primary" ghost @click="handleReject" v-if="props.searchKey === '0'">{{ t('common.rejectText') }}</a-button>
            <a-button v-auth="'btn_recall'" type="primary" ghost @click="revokeFn()" v-if="props.searchKey === '1'">{{ t('common.revoke') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
          </template>
          <template #nodeRecord="{ row }">
            <span v-if="row.quantitativeId" v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
          </template>
          <template #moldDrawingsName="{ row }">
            <a
              @click="
                () => {
                  filePreviewRef &&
                    filePreviewRef.init({
                      name: row.moldDrawingsName,
                      Id: row.moldDrawingsId,
                      previewType: 'localPreview',
                      noCache: false,
                      isCopy: 0,
                    });
                }
              "
              >{{ row.moldDrawingsName }}</a
            >
          </template>
          <template #ypk="{ row }">
            <div class="table-a" @click="goDetailFn(row)">{{ t('common.viewDetails') }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
    <RejectModal @register="registerRejectModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import Record from '/@/views/extend/printData/components/Record.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { inject, ref, nextTick } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { COLUMNS, SEARCH_FORM_SCHEMA } from './config';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { exportunhandle, exporthandled, getList, handledpage, bulkTransfer, bulkWithdraw, bulkReject } from '/@/api/engineering/sampleApply';
  // import { getNodelist } from '/@/api/engineering/sampleApply';
  import { getNodelist } from '/@/api/business/quantitation';
  import { getPccList } from '/@/api/engineering/pcc';
  import { formatTableDefaultText } from '/@/utils';
  import { TransferModal, NodeModal, RejectModal } from '/@/components/CustomComponents';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { omit } from 'lodash-es';

  const emits = defineEmits(['reload']);
  const filePreviewRef = ref<ModalComponent | null>(null);
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openDeliveryDateResponseFn: any = inject('openDeliveryDateResponseFn');

  const props = defineProps({
    searchKey: { default: '0' },
  });

  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

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
      schema: SEARCH_FORM_SCHEMA,
      i18nConfig: {
        moduleCode: 'SampleDeliveryReplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: `sampleGroupBusiness-requireDelivery-${props.searchKey === '0' ? 'todo' : 'done'}-list`,
      api: props.searchKey === '0' ? getList : handledpage,
      beforeFetch: (params: any) => {
        const query = {
          ...omit(params, 'pickerVal'),
          startTime: params?.pickerVal?.[0] || '',
          endTime: params?.pickerVal?.[1] || '',
        };
        return query;
      },
      columns: getColumns(),
      rowConfig: {
        keyField: 'id',
      },
      stripe: true,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'SampleDeliveryReplyColumn',
      },
    },
  });

  const { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, reload, getFetchParams } = gridApi;

  nextTick(() => {
    gridApi.formApi.setFieldValue('type', props.searchKey);
  });

  function getTableActions(record: any): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: openDeliveryDateResponseFn.bind(null, { dataSource: [record] }),
        auth: 'btn_detail',
      },
    ];
  }

  function getColumns() {
    let columns = [...COLUMNS, { title: '样品卡', field: 'ypk', slots: { default: 'ypk' } }];
    if (props.searchKey === '0') {
      columns = columns.filter(item => item.field !== 'sampleEstimateDeliveryTime');
      columns.push({
        title: t('common.action'),
        field: 'action',
        slots: { default: 'action' },
        width: 50,
        fixed: 'right',
      });
    }
    console.log(columns);
    return columns;
  }

  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodelist,
      id: record.quantitativeId,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function requireDeliveryTimeFn() {
    if (getSelectRowKeys().length) {
      openDeliveryDateResponseFn({ dataSource: getSelectRows() });
    } else {
      createMessage.warning(t('common.selectText'));
    }
  }

  function transferFn() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openTransferModal(true, {
      id: idList || [],
      submitCallback: handleTransferCB,
    });
  }
  const handleTransferCB = async data => {
    const r = await bulkTransfer({
      list: getSelectRows(),
      transferRemarks: data.remark,
      transferUserId: data.transferUser,
    });
    return r;
  };

  function revokeFn() {
    const tips = t('common.withdrawSelectedData');
    if (getSelectRowKeys().length) {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: tips,
        onOk: async () => {
          const { code, msg } = await bulkWithdraw(getSelectRowKeys());
          if (code === 200) {
            initFn();
          } else {
            createMessage.error(msg);
          }
        },
      });
    } else {
      createMessage.warning(t('dict.DrawingsReviewColumn.selectDataToSubmit'));
    }
  }

  // //导出
  function handleExport() {
    const api = props.searchKey === '1' ? exporthandled : exportunhandle;
    openExportModal(true, {
      api,
      listQuery: {
        ...getFetchParams(),
      },
      exportOptions: COLUMNS,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  async function goDetailFn(record: any = '') {
    // let pccCacheList = [];
    // try {
    //   const { data, code } = await getPccList({
    //     originCode: record.applyCode,
    //     insidePartNumber: record.insidePartNumber,
    //     authorize: 1,
    //   });
    //   if (code === 200) {
    //     pccCacheList = data.list;
    //     if (!pccCacheList.length) {
    //       return createMessage.warning(t('common.noData'));
    //     }
    //     openDetailPopFn({
    //       index: 0,
    //       mode: 'view',
    //       cacheList: pccCacheList,
    //     });
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    openDetailPopFn({
      index: 0,
      mode: 'view',
      cacheList: [
        {
          ...record,
          id: record.pccId,
        },
      ],
    });
  }

  function initFn() {
    clearSelectedRowKeys();
    reload();
    emits('reload');
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 驳回
   */
  function handleReject() {
    const idList = getSelectRowKeys();
    if (!idList.length) return createMessage.warning(t('common.selectText'));
    openRejectModal(true, {
      api: bulkReject,
      ids: idList,
    });
  }

  defineExpose({
    initFn,
  });
</script>
