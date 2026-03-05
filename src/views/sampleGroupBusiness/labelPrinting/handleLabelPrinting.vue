<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_print'" type="primary" @click="labelPrintingFn()">{{ t('common.LabelPrinting') }}</a-button>
            <a-button v-auth="'btn_transfer'" type="primary" ghost @click="transferFn()" v-if="props.searchKey === '0'">{{ t('common.transfer') }}</a-button>
            <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
            <!-- 隐藏`撤回`按钮 -->
            <!-- <a-button v-auth="'btn_recall'" type="primary" ghost @click="revokeFn()" v-if="props.searchKey === '1'">{{ t('common.revoke') }}</a-button> -->
          </template>
          <template #nodeRecord="{ rowIndex, row }">
            <span v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
            <!-- <template v-if="column.dataIndex === 'status'">
              <LydcTag theme="green" :text="t('common.enableText')"></LydcTag>
            </template> -->
          </template>
          <template #moldDrawingsName="{ rowIndex, row }">
            <a
              @click="
                () => {
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
          <template #ypk="{ rowIndex, row }">
            <div class="table-a" @click="goDetailFn(row)">{{ t('common.viewDetails') }}</div>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <TransferModal @register="registerTransferModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, inject, ref, unref, watch } from 'vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { COLUMNS, HANDLED_COLUMNS, HANDLE_STATUS_OPTIONS, SEARCH_FORM_SCHEMA, STATUS_OPTIONS } from './config';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import {
    getSamplelabelprint,
    getSamplelabelprintHandledpage,
    exportUnhandleLabelPrint,
    exportHandleLabelPrint,
    bulkTransferLabelPrint,
    bulkWithdrawLabelPrint,
  } from '/@/api/engineering/sampleApply';
  import { getPccList } from '/@/api/engineering/pcc';
  import { TransferModal, NodeModal } from '/@/components/CustomComponents';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const filePreviewRef = ref<ModalComponent | null>(null);
  const openDetailPopFn: any = inject('openDetailPopFn');
  const openLabelPrintingFn: any = inject('openLabelPrintingFn');

  const props = defineProps({
    searchKey: { default: '0' },
  });
  const searchInfo = reactive({
    type: props.searchKey,
  });
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerTransferModal, { openModal: openTransferModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [Grid, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, setLoading, reload, setFieldValue, getFetchParams, updateSchema }] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-8 gap-4',
      schema: SEARCH_FORM_SCHEMA,
      i18nConfig: {
        moduleCode: 'SampleLabelPrintColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'ssampleGroupBusiness-labelPrinting-handleLabelPrinting',
      columns: [...(props.searchKey === '0' ? COLUMNS : HANDLED_COLUMNS), { title: '样品卡', field: 'ypk', slots: { default: 'ypk' } }] as any,
      showIndexColumn: true,
      showFooter: false,
      api: props.searchKey === '0' ? getSamplelabelprint : getSamplelabelprintHandledpage,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'SampleLabelPrintColumn',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        if (params.pickerVal) {
          params.StartTime = params.pickerVal[0];
          params.EndTime = params.pickerVal[1];
          delete params.pickerVal;
        }
        return {
          ...params,
          ...searchInfo,
        };
      },
    },
  });
  watch(
    () => props.searchKey,
    val => {
      updateSchema({
        field: 'status',
        componentProps: {
          options: Number(val) === 0 ? STATUS_OPTIONS : HANDLE_STATUS_OPTIONS,
        },
      });
    },
  );
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: openLabelPrintingFn.bind(null, { dataSource: [record] }),
        auth: 'btn_detail',
      },
    ];
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  function labelPrintingFn() {
    if (getSelectRowKeys().length) {
      openLabelPrintingFn({ dataSource: getSelectRows(), isHandled: props.searchKey === '1' });
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
    const r = await bulkTransferLabelPrint({
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
          const { code, msg } = await bulkWithdrawLabelPrint(getSelectRowKeys());
          if (code === 200) {
            initFn();
          } else {
            createMessage.error(msg);
          }
        },
      });
    } else {
      createMessage.warning(t('common.selectText'));
    }
  }

  // //导出
  async function handleExport() {
    const api = props.searchKey === '0' ? exportUnhandleLabelPrint : exportHandleLabelPrint;
    openExportModal(true, {
      api,
      listQuery: await getFetchParams(),
      exportOptions: COLUMNS,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  async function goDetailFn(record: any = '') {
    let pccCacheList = [];
    try {
      const { data, code } = await getPccList({ originCode: record.applyCode });
      if (code === 200) {
        pccCacheList = data.list;
        if (!pccCacheList.length) {
          return createMessage.warning(t('common.noDetailData')); //'暂无pcc详情数据'
        }
        openDetailPopFn({
          index: 0,
          mode: 'view',
          cacheList: pccCacheList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function initFn() {
    clearSelectedRowKeys();
    reload();
  }

  defineExpose({
    initFn,
  });
</script>
