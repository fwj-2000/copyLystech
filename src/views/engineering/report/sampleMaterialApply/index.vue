<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs @change="reloadTable" v-model:activeKey="activeKey" class="h-full">
          <a-tab-pane key="1" :tab="t('dict.sample.details')" class="h-full">
            <SampleDetails>
              <template #toolbar-actions>
                <a-button v-auth="'btn_batchExport'" @click="handleExport">
                  {{ t('common.batchExport') }}
                </a-button>
              </template>
              <template #nodeDetail="{ row }">
                <div class="table-a" @click="handleNodeModal(row)"> {{ t('common.viewDetails') }} </div>
              </template>
            </SampleDetails>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="t('dict.sample.statistics')" class="h-full">
            <div class="lydc-content-wrapper-search-box">
              <BasicForm @register="registerForm" />
            </div>
            <a-spin :spinning="loading" class="h-full">
              <div class="flex flex-col justify-start bg-white container-below-search">
                <div class="top-section">
                  <div class="left-section">
                    <demandOverview
                      :applyAreaSum="dataState.applyAreaSum"
                      :replyAreaSum="dataState.replyAreaSum"
                      :complianceRateSum="dataState.complianceRateSum"
                      :update-time="dataState.updateTime" />
                  </div>

                  <div class="right-section">
                    <demandTrends
                      :week-list="dataState.weekList"
                      :applyAreaList="dataState.applyAreaList"
                      :complianceRateList="dataState.complianceRateList"
                      :replyAreaList="dataState.replyAreaList"
                      :update-time="dataState.updateTime" />
                  </div>
                </div>

                <div class="bottom-section">
                  <Table :rows="dataState.detailList" @export="handleTableExport" />
                </div>
              </div>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, ref, toRefs } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { sampleDetailsGetColumns, sampleDetailsGetSchema } from '/@/views/engineering/report/sampleMaterialApply/config';
  import { getSampleMaterialReport, getStatistics } from '/@/api/engineering/report';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getFactoryList } from '/@/api/engineering/sample';
  import Table from './components/Table.vue';
  import demandOverview from './components/demandOverview.vue';
  import demandTrends from './components/demandTrends.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { getStatisticsReportExcel } from '/@/api/engineering/report';

  defineOptions({ name: 'engineering-sampleMaterialApply-report' });

  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const loading = ref(false);

  const state = reactive<Record<string, any>>({
    activeKey: '1',
  });

  const dataState = ref({
    amountList: [] as number[],
    applyAreaList: [] as number[],
    applyAreaSum: 0,
    complianceRateList: 0,
    weekList: [] as string[],
    complianceRateSum: 0,
    detailList: [] as number[],
    replyAreaList: [] as number[],
    replyAreaSum: 0,
    updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
  });

  function clearData() {
    dataState.value = {
      amountList: [] as number[],
      applyAreaList: [] as number[],
      applyAreaSum: 0,
      complianceRateList: 0,
      weekList: [] as string[],
      complianceRateSum: 0,
      detailList: [] as number[],
      replyAreaList: [] as number[],
      replyAreaSum: 0,
      updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
    };
  }

  const { activeKey } = toRefs(state);

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal }] = useModal();

  const factoryNameRef = ref<string>('');

  const [SampleDetails, { getSelectRows: sampleDetailsGetSelectRows, reload: sampleDetailsReload, getFetchParams }] = useVbenVxeGrid({
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
      schema: sampleDetailsGetSchema(hasBtnP),
      // i18nConfig: {
      //   moduleCode: 'PartNumberApplyColumn',
      //   transferRange: ['placeholder'],
      // },
    },
    gridOptions: {
      id: 'engineering-PCCBeta-PCCApply-list-tomake',
      columns: sampleDetailsGetColumns(hasBtnP),
      api: getSampleMaterialReport,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PCCApplyColumn',
      },
      beforeFetch: params => {
        if (params?.time?.length) {
          params.applyDateStart = dateUtil(params.time[0]).format('YYYY-MM-DD');
          params.applyDateEnd = dateUtil(params.time[1]).format('YYYY-MM-DD');
        }
        delete params.time;
        return params;
      },
      afterFetch: data => {
        state.tomakeCacheList = data.list;
      },
    },
  });

  async function handleExport() {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
      },
      api: getStatisticsReportExcel,
      exportOptions: sampleDetailsGetColumns(hasBtnP),
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: { moduleCode: 'ProcessCoverageStatisticsColumn' },
    });
  }

  async function handleTableExport(data) {
    const val = getFieldsValue();
    console.log(val, 'valvalvalvalvalvalval');
    const { applyDateStart, applyDateEnd } = resolveStartEnd(val);
    openExportModal(true, {
      listQuery: {
        ...val,
        applyDateStart,
        applyDateEnd,
      },
      api: data.api,
      exportOptions: data.exportOptions,
      nameProps: 'title',
      idProps: 'field',
    });
  }

  function isEmptyResponse(d: any) {
    const noTrend =
      (!d.weekList || d.weekList.length === 0) && (!d.applyAreaList || d.applyAreaList.length === 0) && (!d.replyAreaList || d.replyAreaList.length === 0);
    // (!d.overList || d.overList.length === 0) &&
    // (!d.closeList || d.closeList.length === 0);
    const noTable = !d.detailList || d.detailList.length === 0;
    const noSums = (d.replyAreaSum ?? 0) === 0 && (d.complianceRateSum ?? 0) === 0 && (d.applyAreaSum ?? 0) === 0;
    console.log(noTrend, noTable, noSums, 'noTrend, noTable, noSumsnoTrend, noTable, noSumsnoTrend, noTable, noSums');
    return noTrend && noTable && noSums;
  }

  const [registerForm, { getFieldsValue, setFieldsValue, validate, clearValidate, resetFields }] = useForm({
    layout: 'vertical',
    // labelWidth: 100,
    baseColProps: {
      span: 3,
    },
    showActionButtonGroup: true,
    showSubmitButton: true,
    showResetButton: true,
    actionColOptions: {
      span: 3,
      style: { display: 'flex', justifyContent: 'flex-end' },
    },
    model: { period: '3m' },
    schemas: [
      {
        field: 'factoryCode',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: { show: true, searchName: 'keyword' },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
          filterOption: false,
          placeholder: t('dict.CommonCol.factoryName'),
          onChange: async (val: string, option: any) => {
            const opt = option?.raw ?? option ?? {};
            const name = opt.Name || opt.label || opt.fullName || '';
            factoryNameRef.value = name;
            await setFieldsValue?.({ factoryCode: val, factoryName: name });
            if (!val) clearValidate?.(['factoryCode']);
            await nextTick();
          },
        },
        // rules: [{ required: true, trigger: 'change', message: t('common.required') }],
      },
      {
        label: '',
        field: 'applyUserName',
        component: 'Input',
        componentProps: {
          placeholder: '申请人',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'purchaseUserName',
        component: 'Input',
        componentProps: {
          placeholder: '采购',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'innerMaterialNumber',
        component: 'Input',
        componentProps: {
          placeholder: '材料八码',
          submitOnPressEnter: true,
        },
        colProps: { span: 2 },
      },
      {
        label: '',
        field: 'innerExternalNumber',
        component: 'Input',
        componentProps: {
          placeholder: '原厂商型号',
          submitOnPressEnter: true,
        },
        colProps: { span: 2 },
      },
      {
        label: '',
        field: 'time',
        component: 'DateRange',
        componentProps: {
          placeholder: ['开始日期', '结束日期'],
          submitOnPressEnter: true,
        },
        colProps: { span: 3 },
      },
      {
        label: '',
        field: 'period',
        component: 'Radio',
        componentProps: {
          // size: 'mini',
          optionType: 'button',
          buttonStyle: 'solid',
          style: { height: '32px', overflow: 'hidden' },
          // size: 'small',
          options: [
            { fullName: t('dict.PastMonth'), enCode: '1m' },
            { fullName: t('dict.PastThreeMonths'), enCode: '3m' },
            { fullName: t('dict.PastSixMonths'), enCode: '6m' },
            // { fullName: t('dict.lastMonth'), enCode: '1m' },
            // { fullName: t('dict.pastThreeMonths'), enCode: '3m' },
            // { fullName: t('dict.pastSixMonths'), enCode: '6m' },
          ],
          fieldNames: { label: 'fullName', value: 'enCode' },
          onChange: async (val: '1m' | '3m' | '6m') => {
            await setFieldsValue?.({ time: undefined, period: val });
            await nextTick();
            const cur = await getFieldsValue?.();
            if (!cur?.factoryCode) {
              createMessage.warning(t('dict.CommonCol.pleaseSelectFactory'));
              clearValidate?.(['factoryCode']);
              return;
            }
            fetchAndFill('periodChange', { period: val, factoryName: factoryNameRef.value });
          },
        },
        colProps: { span: 5 },
        defaultValue: '8w',
      },
    ],
    submitFunc: async () => {
      const ok = await validate?.();
      if (!ok) return;
      await fetchAndFill('submit', { factoryName: factoryNameRef.value });
    },
    resetFunc: async () => {
      await setFieldsValue?.({
        factory: undefined,
        factoryName: '',
        demandType: undefined,
        time: undefined,
        period: '8w',
      });
      factoryNameRef.value = '';
      clearData();
    },
  });

  function reloadTable() {
    if (state.activeKey == 1) {
    } else {
    }
  }

  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.flowBillId || record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  async function fetchAndFill(
    trigger: 'submit' | 'periodChange' | 'init',
    overrides?: Partial<{
      factoryCode: string;
      applyUserName: string;
      innerMaterialNumber: string;
      purchaseUserName: string;
      innerExternalNumber: [string, string];
      period: '4w' | '8w' | '12w';
    }>,
  ) {
    const vals = await getFieldsValue?.();
    console.log('🚀 ~ fetchAndFill ~ vals:', vals);
    console.log(vals);
    const merged = { ...vals, ...overrides };

    if (!merged?.factoryCode) {
      if (trigger !== 'init') {
        createMessage.warning(t('dict.CommonCol.pleaseSelectFactory'));
        clearValidate?.(['factoryCode']);
      }
      return;
    }

    // factoryName 兜底：优先表单，其次 ref
    const currentFactoryName = merged.factoryName || factoryNameRef.value || '';

    const { applyDateStart, applyDateEnd } = resolveStartEnd(merged);
    const payload = {
      applyDateStart,
      applyDateEnd,
      factoryCode: merged.factoryCode ?? '',
      factoryName: currentFactoryName,
      applyUserName: merged?.applyUserName ?? '',
      purchaseUserName: merged?.purchaseUserName ?? '',
      innerMaterialNumber: merged?.innerMaterialNumber ?? '',
      innerExternalNumber: merged?.innerExternalNumber ?? '',
    };
    loading.value = true;

    const res = await getStatistics(payload);
    console.log('🚀 ~ fetchAndFill ~ res: 111111111111111111', res);

    if (res?.code === 200 && res.data) {
      const d = res.data;
      if (isEmptyResponse(d)) {
        clearData();
        createMessage.info(t('common.noMatchingData'));
        return;
      }
      dataState.value = {
        amountList: d.amountList ?? 0,
        applyAreaList: d.applyAreaList ?? 0,
        applyAreaSum: d.applyAreaSum ?? 0,
        complianceRateList: d.complianceRateList ?? 0,
        complianceRateSum: d.complianceRateSum ?? [],
        detailList: d.detailList ?? [],
        weekList: d.weekList ?? [],
        replyAreaList: d.replyAreaList ?? [],
        replyAreaSum: d.replyAreaSum ?? 0,
        updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
      };
      loading.value = false;
    } else {
      clearData();
      createMessage.info(t('common.noMatchingData'));
      loading.value = false;
    }
  }

  // 以“今天”为 endDate；自定义日期优先；近N周=今天往前推N周（包含今天）
  function resolveStartEnd(formVals: any) {
    const now = dateUtil();
    const range = formVals?.time as [string, string] | undefined;
    if (range?.[0] && range?.[1]) {
      return {
        applyDateStart: dateUtil(range[0]).format('YYYY-MM-DD'),
        applyDateEnd: dateUtil(range[1]).format('YYYY-MM-DD'),
      };
    }
    const n = formVals?.period === '1m' ? 1 : formVals?.period === '3m' ? 3 : 6;
    return {
      applyDateStart: now.subtract(n, 'month').format('YYYY-MM-DD'),
      applyDateEnd: now.format('YYYY-MM-DD'),
    };
  }
</script>

<style scoped lang="less">
  @import url('/src/design/page.less');

  :deep(.lydc-content-wrapper-search-box) {
    height: 54px;
    padding: 12px;
  }

  .lydc-content-wrapper .lydc-content-wrapper-center .lydc-content-wrapper-search-box {
    margin-bottom: 0;
  }

  .container-below-search {
    flex: 1;
    flex-direction: column;
    gap: 12px;
    //height: calc(100% - 54px);
    height: 100%;
    width: 100%;
  }

  .top-section {
    flex-direction: row;
    gap: 20px;
    width: 100%;
    flex: 310;
    min-height: 0;
    display: flex;
  }

  .bottom-section {
    flex: 1;
    flex: 396;
    min-height: 0;
    width: 100%;
  }

  .left-section {
    margin-left: 10px;
    flex: 1;
    width: calc((100% - 40px) / 2);
    height: 100%;
  }

  .right-section {
    margin-right: 10px;
    flex: 1;
    width: calc((100% - 40px) / 2);
    height: 100%;
  }

  :deep(.ant-spin-nested-loading) {
    height: calc(100% - 54px);
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }

  :deep(.ant-spin-nested-loading > div > .ant-spin) {
    max-height: unset;
  }
</style>
