<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button
                v-auth="'btn_edit'"
                type="primary"
                @click="handleEdit"
                v-if="activeKey === 'pending' || activeKey === 'PR' || activeKey === 'PO' || activeKey === 'scheduled'">
                {{ t('dict.CommonCol.modify') }}
              </a-button>
              <!-- 重新下推 -->
              <a-button v-auth="'btn_resentData'" type="primary" ghost v-if="activeKey === 'pending'" @click="resendData">{{ t('common.resend') }} </a-button>
              <!-- 更新数据 -->
              <a-button v-auth="'btn_updateData'" type="primary" ghost @click="updateDataFn">{{ t('common.updateData') }} </a-button>
              <!-- 试算建议排产数 -->
              <a-button v-auth="'btn_trialPPSCount'" type="primary" ghost v-if="activeKey === 'pending'" @click="handleOpenTrialQty">
                {{ t('dict.masterSchedule.trialSuggestPPSCount') }}
              </a-button>
              <!-- 下推主生产计划 -->
              <a-button v-auth="'btn_pushToProdPlan'" type="primary" ghost v-if="activeKey === 'PO'" @click="handlePushToProdPlan">{{
                t('dict.masterSchedule.pushToProdPlan')
              }}</a-button>
              <!-- 通知客服 -->
              <a-button v-auth="'btn_notifyCustomer'" type="primary" ghost v-if="activeKey === 'scheduled'" @click="handleSendmessage">
                {{ t('dict.MasterDemandPlanColumn.notifyCustomerDes') }}
              </a-button>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" block @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #errorMsg="{ row }">
            <LydcTag v-if="row.errorStatus == 1" theme="green" :text="row.errorMsg"></LydcTag>
            <a-tooltip v-if="row.errorStatus == 2">
              <template #title>
                <span style="font-size: 12px">{{ row.errorMsg }}</span>
              </template>
              <!-- 基础数据缺失 -->
              <a-tag class="tagCss">{{ t('tip.MPS.tip8') }}</a-tag>
            </a-tooltip>
            <LydcTag v-if="row.errorStatus == 3" theme="gray" :text="row.errorMsg"></LydcTag>
          </template>
          <template #fourWeek="{ row }">
            <!-- 4周 -->
            <div class="table-a" @click="handleFCDetailModal(row)">{{ formatWithOriginalDecimals(row.fourWeek) }}</div>
          </template>
          <template #mergeMaterialDes="{ row }">
            <div class="table-a" @click="handleMaterialDes(row)">{{ t('common.viewDetails') }}</div>
          </template>
          <template #prodLog="{ row }">
            <div class="table-a" @click="handleDetail(row, '建议排产数更新记录')">{{ t('common.viewDetails') }}</div>
          </template>
          <template #reqdLog="{ row }">
            <div class="table-a" @click="handleDetail(row, '要求排产数更新记录')">{{ t('common.viewDetails') }}</div>
          </template>
          <template #NodeRecords="{ row }">
            <span class="table-a" @click="handleNodeModal(row)">
              {{ t('common.searchDetail') }}
            </span>
          </template>
          <template #lastFourDemand="{ row }">
            <div v-if="row.lastFourDemandTips">
              {{ row.lastFourDemandTips }}
            </div>
            <div v-else class="flex-start">
              <span class="mr-3px">{{ formatWithOriginalDecimals(row.lastFourDemandRaw) }}</span>
              <lydc-tag :theme="row.lastFourDemand < 1 ? 'red' : 'blue'">
                {{ (row.lastFourDemand * 100).toFixed(1) + '%' }}
              </lydc-tag>
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <TrialQtyModal @register="registerTrialQty" @reload="reloadTable"> </TrialQtyModal>
    <ProdLogDetailModal @register="registerProdLogDetail" @reload="reloadTable"> </ProdLogDetailModal>
    <MaterialDesModal @register="registerMaterialDesModal" @reload="reloadTable"> </MaterialDesModal>
    <NodeModal @register="registerNodeModal"></NodeModal>
    <NotifyCustomerModal @register="registerNotifyCustomerModal" @reload="reloadTable"> </NotifyCustomerModal>
    <FcDetailModal @register="registerFcDetail" @reload="reloadTable"> </FcDetailModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed, onMounted } from 'vue';
  import { getMasterdemandplanPage, exportExcel, updateData, againPushMrp } from '/@/api/mps/productionPlan/MPS';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import TrialQtyModal from './components/TrialQtyModal.vue';
  import ProdLogDetailModal from './components/ProdLogDetailModal.vue';
  import MaterialDesModal from './components/MaterialDesModal.vue';
  import { getWeekDays } from './weekTime';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { NodeModal } from '/@/components/CustomComponents';
  import dayjs from 'dayjs';
  import NotifyCustomerModal from './components/NotifyCustomerModal.vue';
  import FcDetailModal from './components/FcDetailModal.vue';
  import { formatWithOriginalDecimals } from '/@/utils/baseinfo/number';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const emit = defineEmits(['handleEdit', 'handlePushToProdPlan', 'changeWeek']);
  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
    weeks: {
      type: String as any,
      default: '',
    },
  });
  const status = computed(() => {
    const queryTypeEnum = {
      pending: 1,
      PO: 2,
      PR: 3,
      scheduled: 4,
      replied: 5,
      all: 6,
    };
    return queryTypeEnum[props.activeKey];
  });
  const columns = ref<any[]>([]);

  const [registerExportModal, { closeModal }] = useModal();
  const [registerTrialQty, { openModal: openTrialQty }] = useModal();
  const [registerProdLogDetail, { openModal: openProdLogDetail }] = useModal();
  const [registerMaterialDesModal, { openModal: openMaterialDesModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal(); // 节点弹窗
  const [registerNotifyCustomerModal, { openModal: openNotifyCustomerModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
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
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormSchema(),
      handleSubmit: reloadTable,
      handleReset,
    },
    gridOptions: {
      id: 'pruductionPlan-main-masterSchedule-list-' + props.activeKey,
      columns: [],
      api: getMasterdemandplanPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
      },
      toolbarConfig: {
        superQuery: true,
      },
      proxyConfig: {
        autoLoad: false,
        ajax: {
          queryAll: async () => {
            const formValues = await getFromValue();
            const weeksDayjs = dayjs(formValues.searchDate || props.weeks);
            const queryParams = {
              queryType: status.value,
              searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
              pageSize: 999999999,
              currentPage: 1,
            };
            const { data } = await getMasterdemandplanPage(queryParams);
            return {
              list: processExportData(data.list),
              total: data.pagination.total,
            };
          },
        },
      } as any,
      exportConfig: {
        type: 'xlsx',
        types: ['xlsx'],
        mode: 'current',
        modes: ['current', 'all'],
      },
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          queryType: status.value,
          // searchDate: params.searchDate && params.searchDate.replace('-', 'WK'),
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
      cellStyle: ({ row, column }) => {
        if (column.field == 'lastFourDemand' && row.lastFourDemand < 1) {
          return {
            color: 'red',
          };
        }
      },
    },
  });
  const { reload, clearSelectedRowKeys, getSelectRows, reloadColumn, getSelectRowKeys, getFromValue, setLatestSubmissionValues, resetForm, setFieldValue } =
    gridApi;

  // 打开节点弹窗
  const handleNodeModal = record => {
    openNodeModal(true, {
      // api: getNodeList,
      id: record.id,
    });
  };

  // 通知客服
  const handleSendmessage = async () => {
    const formValues = await getFromValue();
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    // 判断是否有排程交期
    const schedulingDeliveryList = rows.map(item => {
      return item.schedulingDelivery ? item.schedulingDelivery : '';
    });
    if (schedulingDeliveryList.includes('')) {
      return createMessage.warning(t('tip.MPS.tip1')); // 含未有排程交期的数据，请重新选择
    }
    const notifyData = rows.map(item => {
      return {
        id: item.id,
        customerId: item.customerId,
        innerMaterialCode: item.innerMaterialCode,
        customerName: item.customerName,
        schedulingDelivery: item.schedulingDelivery,
        schedulingRemark: item.schedulingRemark,
      };
    });
    openNotifyCustomerModal(true, { notifyData, searchDate: formValues.searchDate });
  };

  const handleDetail = (row, title) => {
    openProdLogDetail(true, { ...row, title });
  };

  const handleMaterialDes = row => {
    openMaterialDesModal(true, { ...row });
  };

  // 打开FC的详情
  const [registerFcDetail, { openModal: openFcDetail }] = useModal();
  const handleFCDetailModal = row => {
    openFcDetail(true, {
      row: row,
    });
  };

  // 修改
  const handleEdit = async () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    const hasErrorStatus = rows.some(item => item.errorStatus == 2 || item.errorStatus == 3);
    if (hasErrorStatus) {
      return createMessage.warning(t('tip.MPS.tip9')); // 校验信息为正常状态的才能修改，请重新选择
    }
    const ids = rows.map(item => item.id);
    // 检测是否存在生产类型，若是不存在，则提示，且阻止弹出修改弹窗
    // for (let i = 0; i < rows.length; i++) {
    //   const item = rows[i];
    //   if (!item.productionType) {
    //     createMessage.warning(t('该料号未配置生产类型，请导出线下处理'));
    //     return;
    //   }
    //   ids.push(item.id);
    // }
    const fields = await getFromValue();
    emit('handleEdit', { ids: ids, activeKey: props.activeKey, searchDate: fields.searchDate });
  };

  // 重新下推
  const resendData = async () => {
    const rows = await getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }

    // 至于校验信息为正常的才能推送
    const hasErrorStatus = rows.some(item => item.errorStatus == 2 || item.errorStatus == 3);
    if (hasErrorStatus) {
      return createMessage.warning(t('tip.MPS.tip5')); // 只有检验信息为正常的数据才能重新推送
    }

    // 只有待推送的才能推送
    const hasInvalidStatus = rows.some(item => item.isPushMrp == 2 || item.isPushMrp == 3);
    if (hasInvalidStatus) {
      return createMessage.warning(t('tip.MPS.tip3')); // 只能重新推送 未推送 状态的数据
    }
    const ids = rows.map(item => item.id);
    const { code, msg } = await againPushMrp(ids);
    if (code == 200) {
      createMessage.success(msg);
      reload();
    } else {
      createMessage.error(msg);
    }
  };

  const updateDataFn = async () => {
    const ids = await getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    const { code, msg } = await updateData(ids);
    if (code == 200) {
      createMessage.success(msg);
      reloadTable();
    } else {
      createMessage.error(msg);
    }
  };

  // 试算建议排产数
  const handleOpenTrialQty = () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    if (rows.length > 1) return createMessage.warning(t('dict.CommonCol.selectedOneData'));
    const { id } = rows[0];
    if (rows[0].errorStatus != 1) {
      return createMessage.warning(t('tip.MPS.tip11')); // 请选择正常数据进行试算
    }
    openTrialQty(true, { id });
  };

  const handlePushToProdPlan = async () => {
    const rows = getSelectRows();
    if (!rows.length) return createMessage.warning(t('dict.CheckDataTip'));
    const ids = rows.map(item => item.id);
    const fields = await getFromValue();
    emit('handlePushToProdPlan', { ids: ids, searchDate: fields.searchDate });
  };

  // 处理把特殊列显示为文字
  const exportMaps = {
    errorStatus: { 1: t('dict.stopStatus.0'), 2: t('tip.MPS.tip8'), 3: t('dict.CommonCol.sysCal') },
    riskLevel: { 1: t('dict.riskLevel.1'), 2: t('dict.riskLevel.2'), 3: t('dict.riskLevel.3') },
    isPushMrp: { 1: t('dict.isPushed.1'), 2: t('dict.isPushed.2'), 3: t('dict.isPushed.3') },
    masterDemandPlanStatus: {
      1: t('dict.masterDemandPlanStatus.1'),
      2: t('dict.masterDemandPlanStatus.2'),
      3: t('dict.masterDemandPlanStatus.3'),
      4: t('dict.masterDemandPlanStatus.4'),
      5: t('dict.masterDemandPlanStatus.5'),
      6: t('dict.masterDemandPlanStatus.6'),
    },
    notifyCustomer: { 1: t('dict.isNotifyCustomer.1'), 2: t('dict.isNotifyCustomer.2') },
    demandType: { 1: t('dict.demandType.1'), 2: t('dict.demandType.2') },
    productionType: { 0: '', 1: t('dict.ProductionType.2'), 2: t('dict.ProductionType.2'), 3: t('dict.ProductionType.2') },
    isBonded: { 1: t('dict.Bool.1'), 2: t('dict.Bool.2') },
  };
  function processExportData(data) {
    return data.map(item => ({
      ...item,
      errorStatus: exportMaps.errorStatus[item.errorStatus] || item.errorStatus,
      riskLevel: exportMaps.riskLevel[item.riskLevel] || item.riskLevel,
      isPushMrp: exportMaps.isPushMrp[item.isPushMrp] || item.isPushMrp,
      masterDemandPlanStatus: exportMaps.masterDemandPlanStatus[item.masterDemandPlanStatus] || item.masterDemandPlanStatus,
      notifyCustomer: exportMaps.notifyCustomer[item.notifyCustomer] || item.notifyCustomer,
      demandType: exportMaps.demandType[item.demandType] || item.demandType,
      productionType: exportMaps.productionType[item.productionType] || '',
      isBonded: exportMaps.isBonded[item.isBonded] || item.isBonded,
      customerRequireDelivery: dayjs(item.customerRequireDelivery).format('YYYY-MM-DD'),
      requireSupplierDelivery: dayjs(item.requireSupplierDelivery).format('YYYY-MM-DD'),
    }));
  }
  // 批量导出
  const handleExport = async () => {
    gridApi.grid.openExport({
      excludeFields: ['checkbox', 'mergeMaterialDes', 'nodeLog', 'prodLog', 'reqdLog'],
      filename: () => `${t('dict.MasterDemandPlanColumn')}_${dayjs().format('YYYY-MM-DD')}`,
      beforeExportMethod: ({ $grid, options }) => {
        // 根据导出模式处理数据
        const tableData = $grid?.getFullData();
        if (options.mode === 'current') {
          options.data = processExportData(tableData);
        }
      },
    });

    // const formValues = await getFromValue();
    // const weeksDayjs = dayjs(formValues.searchDate);
    // const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    // openExportModal(true, {
    //   listQuery: {
    //     ...formValues,
    //     ...(await getFetchParams()),
    //     masterDemandPlanStatus: status.value,
    //     // searchDate: formValues.searchDate && formValues.searchDate.replace('-', 'WK'),
    //     searchDate: yearWeekFormat,
    //   },
    //   exportOptions: columns.value,
    //   nameProps: 'title',
    //   idProps: 'field',
    // });
  };
  const exportAction = query => {
    exportExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  async function reloadTable() {
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    emit('changeWeek', fields.searchDate);
    const dataList = getColumn(props.activeKey).map(item => {
      if (item.field === 'replyDeliveryDate') {
        return {
          ...item,
          children: getWeekDays(fields.searchDate),
        };
      } else {
        return { ...item };
      }
    });
    columns.value = dataList;
    reloadColumn(dataList);
    reload();
  }
  // 重置
  async function handleReset() {
    await resetForm();
    emit('changeWeek', '');
    reloadTable();
  }
  // 刷新表格
  const refreshTable = async week => {
    if (week) {
      await setFieldValue('searchDate', week);
    }
    clearSelectedRowKeys();
    reload();
  };

  onMounted(async () => {
    await setFieldValue('searchDate', props.weeks);
    reloadTable();
  });

  defineExpose({ refreshTable });
</script>

<style lang="less" scoped>
  .tagCss {
    background: rgb(255 77 79 / 10%);
    color: #ff4d4f;
    border: 0;
    padding: 1px 8px 1px 18px;
    font-size: 13px;
  }

  .tagCss::before {
    content: '●';
    position: absolute;
    left: 12px;
    top: 47%;
    transform: translateY(-50%);
    font-size: 13px;
  }

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
</style>
