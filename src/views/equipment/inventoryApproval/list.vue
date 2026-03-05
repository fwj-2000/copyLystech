<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="reloadTable" @reset="initData" />
      </div>

      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 同意 -->
              <a-button type="primary" v-auth="'btn_agree'" v-if="activeKey === 'pending'" @click="handleAgree">{{ t('common.agree') }}</a-button>
              <!-- 催办 -->
              <a-button class="mr-12px" type="primary" v-auth="'btn_urge'" ghost v-if="activeKey === 'pending'" @click="handleUrge">{{
                t('common.UrgingText')
              }}</a-button>
              <!-- 驳回 -->
              <a-button class="mr-12px" v-auth="'btn_reject'" @click="handleReject" v-if="activeKey === 'pending'">{{ t('common.rejectText') }}</a-button>
              <!-- 撤回 -->
              <a-button class="mr-12px" v-auth="'btn_recall'" v-if="activeKey === 'pending'" @click="handleWithdraw">{{ t('common.revoke') }}</a-button>
              <!-- 废弃 -->
              <a-button class="mr-12px" v-auth="'btn_scrap'" v-if="activeKey !== 'pending'" @click="handleScrap">{{ t('common.discard') }}</a-button>
            </a-space>
          </template>
          <template #batchNo="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleBatchNo(row)">{{ row.batchNo }} </div>
          </template>
          <template #record="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }} </div>
          </template>
          <template #analysisReport="{ row }">
            <div v-auth="'btn_detail'" class="table-a" @click="handleAnalysisReport(row)">{{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <RejectModal @register="registerRejectModal" @reload="reload" />
    <ScrapModal @register="registerScrapModal" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { computed, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { RejectModal, NodeModal } from '/@/components/CustomComponents';
  import ScrapModal from './components/ScrapModal.vue';
  import { getBatchpage, auditagree, auditreject, auditwithdraw, flowreminder, abandon } from '/@/api/equipment/equipmentLedger';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();
  const router = useRouter();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const status = computed(() => {
    return props.activeKey === 'pending' ? 0 : 1;
  });

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerScrapModal, { openModal: openScrapModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const { createConfirm } = useMessage();

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: getFormSchema(),
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      id: props.activeKey === 'pending' ? 'equipment-inventoryApproval-list-wait' : 'equipment-inventoryApproval-list-done',
      columns: getColumn(),
      api: getBatchpage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
      },
      beforeFetch: params => {
        const weeksDayjs = dayjs(getFieldsValue().weeks);
        return {
          type: status.value,
          ...params,
          ...getFieldsValue(),
          weeks: getFieldsValue().weeks ? `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}` : '',
        };
      },
    },
  });

  const handleBatchNo = row => {
    const { currentYear, currentWeek, factoryArea } = row;
    router.push({ path: '/equipment/equipmentLedger', query: { type: 'equipmentInventory', weeks: `${currentYear}-${currentWeek}`, factoryArea } });
  };

  // 查看节点记录
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
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
        const res = await auditagree(ids);
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  };

  const handleReject = async () => {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openRejectModal(true, {
        api: auditreject,
        ids: idList,
      });
    }
    message.info(t('common.selectText'));
  };

  const handleWithdraw = async () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchRecallTip'),
      onOk: async () => {
        const res = await auditwithdraw(ids);
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  };

  const handleUrge = async () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchRemindersTip'),
      onOk: async () => {
        const res = await flowreminder(ids);
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
  };

  const handleScrap = () => {
    const ids = getSelectRowKeys() || [];
    if (!ids.length) return message.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.CommonCol.performBatchDisposalTip'),
      onOk: async () => {
        const res = await abandon(ids);
        if (res.code === 200) {
          message.success(res.msg);
          reload();
        }
      },
    });
    // const idList = getSelectRowKeys();
    // if (!idList.length) return message.info(t('common.selectText'));
    // openScrapModal(true, {
    //   ids: idList,
    // });
  };

  const handleAnalysisReport = row => {
    const { currentYear, currentWeek, factoryArea } = row;
    router.push({ path: '/equipment/equipmentLedger', query: { type: 'ledgerInventory', weeks: `${currentYear}-${currentWeek}`, factoryArea } });
  };

  const initData = async () => {
    reloadTable();
  };

  async function reloadTable() {
    reload();
  }

  onMounted(async () => {
    reloadTable();
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
