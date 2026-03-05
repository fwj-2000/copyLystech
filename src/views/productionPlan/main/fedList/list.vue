<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_agree'" type="primary" v-if="activeKey === 'pending'" @click="handleAgree">{{ t('common.agree') }}</a-button>
              <a-button v-auth="'btn_reject'" type="primary" ghost v-if="activeKey === 'pending'" @click="handleReject">{{ t('common.rejectText') }}</a-button>
              <a-button v-auth="'btn_sendEmail'" type="primary" v-if="activeKey === 'processing'" @click="handleSendEmail">{{
                t('dict.FeedList.sendEmail')
              }}</a-button>
              <a-button v-auth="'btn_enterSupplierDeliveryDate'" type="primary" ghost v-if="activeKey === 'processing'" @click="handleEnterDeliveryDate">{{
                t('dict.FeedList.enterSupplierDeliveryDate')
              }}</a-button>
              <a-button v-auth="'btn_updateSupplierDeliveryDate'" type="primary" ghost v-if="activeKey === 'processing'" @click="handleUpdateDeliveryDate">{{
                t('dict.FeedList.updateSupplierDeliveryDate')
              }}</a-button>
              <a-button v-auth="'btn_terminateFeeding'" type="primary" ghost v-if="activeKey === 'processing'" @click="terminateFeedingFn">{{
                t('dict.FeedList.terminateFeeding')
              }}</a-button>
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #PONumber="{ row }">
            <div class="table-a cursor-pointer" @click="openPODetail(row)"> {{ t('common.viewDetails') }} </div>
          </template>
          <template #supplierDateLog="{ row }">
            <div class="table-a cursor-pointer" @click="openSupplierDateListDetail(row)"> {{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <PODetailModal @register="registerPODetailModal" @reload="reloadTable"> </PODetailModal>
    <LogListModal @register="registerLogListModal" @reload="reloadTable"> </LogListModal>
    <RejectModal @register="registerRejectModal" @reload="reloadTable" />
    <ExportModal @register="registerExportModal" @reload="reloadTable" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formSchema, getColumn, columnExport } from './config';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getFeedList, poApprovedbatch, poAbortBatch, feedListExport } from '/@/api/mps/productionPlan/MPS';
  import { getWeekDays } from '/@/views/productionPlan/main/materialPlan/weekTime';
  import { message } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import PODetailModal from './components/PODetailModal.vue';
  import LogListModal from './components/LogListModal.vue';
  import RejectModal from './components/RejectModal.vue';

  const { t } = useI18n();

  const emit = defineEmits(['handleSendEmail', 'handleEnterDeliveryDate', 'handleUpdateDeliveryDate']);
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    const fedListStatusEnum = {
      pending: 0,
      processing: 1,
      handled: 2,
    };
    return fedListStatusEnum[props.activeKey];
  });
  const columns = ref<any[]>([]);

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerPODetailModal, { openModal: openPODetailModal }] = useModal();
  const [registerLogListModal, { openModal: openLogListModal }] = useModal();
  const { createConfirm, createMessage } = useMessage();

  const [Grid, { reload, getFetchParams, reloadColumn, resetForm, getFromValue, setLatestSubmissionValues, getSelectRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: formSchema,
      handleSubmit: reloadTable,
      handleReset,
      // i18nConfig: {
      //   moduleCode: '	FeedListColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'productionPlan-main-fedList-list-wait12' : 'productionPlan-main-fedList-list-done23',
      columns: [],
      api: getFeedList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: '	FeedListColumn',
      },
      proxyConfig: {
        autoLoad: false,
      } as any,
      beforeFetch: params => {
        return {
          status: status.value,
          ...params,
        };
      },
    },
  });

  function openPODetail(row) {
    openPODetailModal(true, {
      row,
    });
  }

  function openSupplierDateListDetail(row) {
    openLogListModal(true, {
      row,
    });
  }

  const handleAgree = async () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchConsentTip'),
      onOk: async () => {
        const { code, msg } = await poApprovedbatch('1', ids);
        if (code === 200) {
          createMessage.success(msg);
          reload();
        } else {
          createMessage.error(msg);
        }
      },
    });
  };

  const handleReject = async () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    if (ids.length) {
      openRejectModal(true, {
        ids,
      });
    }
  };

  const handleSendEmail = () => {
    const rows = getSelectRows() || [];
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    // 只能同一个供应商发邮件
    const firstSupplierName = rows[0]['supplierName'];
    const flag = rows.every(obj => obj.supplierName === firstSupplierName);
    const inMaterialNos = rows.map(item => {
      return item.inMaterialNo;
    });
    if (flag) {
      emit('handleSendEmail', { inMaterialNos });
    } else {
      return message.warning(t('只能选择同一供应商进行发送邮件'));
    }
  };

  const handleEnterDeliveryDate = () => {
    const rows = getSelectRows() || [];
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    const inMaterialNos = rows.map(item => {
      return item.inMaterialNo;
    });
    if (inMaterialNos.length) {
      emit('handleEnterDeliveryDate', { inMaterialNos });
    }
  };

  const handleUpdateDeliveryDate = () => {
    const rows = getSelectRows() || [];
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    const inMaterialNos = rows.map(item => {
      return item.inMaterialNo;
    });
    if (inMaterialNos.length) {
      emit('handleUpdateDeliveryDate', { inMaterialNos });
    }
  };

  const terminateFeedingFn = () => {
    const ids = getSelectRowKeys();
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('dict.FeedList.kindReminder'),
      content: t('dict.FeedList.terminateFeedingTip'),
      onOk: async () => {
        const res = await poAbortBatch(ids);
        if (res.code === 200) {
          reload();
        }
      },
    });
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      api: feedListExport,
      listQuery: {
        ...(await getFetchParams()),
        status: status.value,
      },
      exportOptions: columnExport,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'FeedListColumn',
      },
    });
  };

  async function reloadTable() {
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    const dataList = getColumn(props.activeKey);
    columns.value = dataList;
    reloadColumn(dataList);
    reload();
  }

  async function handleReset() {
    await resetForm();
    reloadTable();
  }

  onMounted(() => {
    reloadTable();
  });

  defineExpose({ reload });
</script>

<style lang="less" scoped>
  ::v-deep(.cell-red) {
    color: red;
  }
</style>
