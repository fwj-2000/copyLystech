<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content flex-col">
        <div class="lydc-content-wrapper-search-box">
          <BasicForm @register="registerForm" />
        </div>

        <a-spin :spinning="loading" class="h-full">
          <div class="flex flex-col justify-start bg-white container-below-search">
            <div class="top-section">
              <div class="left-section">
                <demandOverview
                  :initiatedSum="dataState.initiatedSum"
                  :inProgressSum="dataState.inProgressSum"
                  :overSum="dataState.overSum"
                  :closeSum="dataState.closeSum"
                  :update-time="dataState.updateTime" />
              </div>

              <div class="right-section">
                <demandTrends
                  :week-list="dataState.weekList"
                  :initiated-list="dataState.initiatedList"
                  :in-progress-list="dataState.inProgressList"
                  :over-list="dataState.overList"
                  :close-list="dataState.closeList"
                  :update-time="dataState.updateTime" />
              </div>
            </div>

            <div class="bottom-section">
              <Table :rows="tableRows" />
            </div>
          </div>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, computed, onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/engineering/sample';
  import { useMessage } from '/@/hooks/web/useMessage';
  import demandOverview from './demandOverview.vue';
  import demandTrends from './demandTrends.vue';
  import Table from './Table.vue';
  import { ProcessCoverageReportList } from '/@/api/business/processCoverageStatistics';
  import { dateUtil } from '/@/utils/dateUtil';

  defineOptions({ name: 'business-report-processCoverageStatistics' });

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  // 记录选中的工厂“名称”，用于给后端 factoryName
  const factoryNameRef = ref<string>('');

  const loading = ref(false);
  const dataState = ref({
    initiatedSum: 0,
    inProgressSum: 0,
    overSum: 0,
    closeSum: 0,
    weekList: [] as string[],
    initiatedList: [] as number[],
    inProgressList: [] as number[],
    overList: [] as number[],
    closeList: [] as number[],
    detailList: [] as any[],
    updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
  });

  const tableRows = computed(() =>
    (dataState.value.detailList ?? []).map((it: any) => ({
      factory: `${it.factory}/${it.factoryName}`,
      factoryCode: it.factory,
      factoryName: it.factoryName,
      requirementType: it.requirementType,
      requireTypeName: it.requireTypeName,
      initiatedQty: it.initiatedQty ?? 0,
      inProgressQty: it.inProgressQty ?? 0,
      overQty: it.overQty ?? 0,
      closeQty: it.closeQty ?? 0,
      closeRate: it.closeRate ?? null,
    })),
  );

  // 以“今天”为 endDate；自定义日期优先；近N周=今天往前推N周（包含今天）
  function resolveStartEnd(formVals: any) {
    const now = dateUtil();
    const range = formVals?.time as [string, string] | undefined;
    if (range?.[0] && range?.[1]) {
      return {
        startDate: dateUtil(range[0]).format('YYYY-MM-DD'),
        endDate: dateUtil(range[1]).format('YYYY-MM-DD'),
      };
    }
    // const n = formVals?.period === '4w' ? 4 : formVals?.period === '12w' ? 12 : 8;
    let n = 8;
    if (formVals?.period === '4w') {
      n = 4;
    } else if (formVals?.period === '12w') {
      n = 12;
    }
    return {
      startDate: now.subtract(n, 'week').format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD'),
    };
  }

  function clearData() {
    dataState.value = {
      initiatedSum: 0,
      inProgressSum: 0,
      overSum: 0,
      closeSum: 0,
      weekList: [],
      initiatedList: [],
      inProgressList: [],
      overList: [],
      closeList: [],
      detailList: [],
      updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
    };
  }

  function isEmptyResponse(d: any) {
    const noTrend =
      (!d.weekList || d.weekList.length === 0) &&
      (!d.initiatedList || d.initiatedList.length === 0) &&
      (!d.inProgressList || d.inProgressList.length === 0) &&
      (!d.overList || d.overList.length === 0) &&
      (!d.closeList || d.closeList.length === 0);
    const noTable = !d.detailList || d.detailList.length === 0;
    const noSums = (d.initiatedSum ?? 0) === 0 && (d.inProgressSum ?? 0) === 0 && (d.overSum ?? 0) === 0 && (d.closeSum ?? 0) === 0;
    return noTrend && noTable && noSums;
  }

  async function fetchAndFill(
    trigger: 'submit' | 'periodChange' | 'init',
    overrides?: Partial<{ factory: string; factoryName: string; demandType: string; time: [string, string]; period: '4w' | '8w' | '12w' }>,
  ) {
    const vals = await getFieldsValue?.();
    const merged = { ...vals, ...overrides };

    if (!merged?.factory) {
      if (trigger !== 'init') {
        createMessage.warning(t('dict.CommonCol.pleaseSelectFactory'));
        clearValidate?.(['factory']);
      }
      return;
    }

    // factoryName 兜底：优先表单，其次 ref
    const currentFactoryName = merged.factoryName || factoryNameRef.value || '';

    const { startDate, endDate } = resolveStartEnd(merged);
    const payload = {
      startDate,
      endDate,
      factory: merged.factory ?? '',
      factoryName: currentFactoryName,
      requirementType: merged?.demandType ?? '',
    };
    loading.value = true;

    const res = await ProcessCoverageReportList(payload);

    if (res?.code === 200 && res.data) {
      const d = res.data;
      if (isEmptyResponse(d)) {
        clearData();
        createMessage.info(t('common.noMatchingData'));
        return;
      }
      dataState.value = {
        initiatedSum: d.initiatedSum ?? 0,
        inProgressSum: d.inProgressSum ?? 0,
        overSum: d.overSum ?? 0,
        closeSum: d.closeSum ?? 0,
        weekList: d.weekList ?? [],
        initiatedList: d.initiatedList ?? [],
        inProgressList: d.inProgressList ?? [],
        overList: d.overList ?? [],
        closeList: d.closeList ?? [],
        detailList: d.detailList ?? [],
        updateTime: dateUtil().format('YYYY-M-D HH:mm:ss'),
      };
      loading.value = false;
    } else {
      clearData();
      createMessage.info(t('common.noMatchingData'));
      loading.value = false;
    }
  }

  const [registerForm, { getFieldsValue, setFieldsValue, validate, clearValidate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 100,
    showActionButtonGroup: true,
    showSubmitButton: true,
    showResetButton: true,
    actionColOptions: {
      span: 4,
      style: { display: 'flex', justifyContent: 'flex-end' },
    },
    model: { period: '8w' },
    schemas: [
      {
        field: 'factory',
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
            await setFieldsValue?.({ factory: val, factoryName: name });
            if (!val) clearValidate?.(['factory']);
            await nextTick();
          },
        },
        colProps: { span: 4 },
        rules: [{ required: true, trigger: 'change', message: t('common.required') }],
      },
      {
        label: '',
        field: 'demandType',
        component: 'ApiSelect',
        i18nField: 'demandTypeName',
        componentProps: {
          placeholder: '需求类型',
          submitOnPressEnter: true,
          api: () => baseStore.getDictionaryData('ProcessCoverageRequireType'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
        colProps: { span: 4 },
      },
      {
        label: '',
        field: 'time',
        component: 'DateRange',
        componentProps: {
          submitOnPressEnter: true,
          placeholder: [t('common.requirementReleaseStartDate'), t('common.requirementReleaseEndDate')],
          onChange: () => setFieldsValue?.({ period: undefined }),
        },
        colProps: { span: 6 },
      },
      {
        label: '',
        field: 'period',
        component: 'Radio',
        componentProps: {
          optionType: 'button',
          buttonStyle: 'solid',
          options: [
            { fullName: t('common.lastFourWeeks'), enCode: '4w' },
            { fullName: t('common.lastEightWeeks'), enCode: '8w' },
            { fullName: t('common.lastTwelveWeeks'), enCode: '12w' },
          ],
          fieldNames: { label: 'fullName', value: 'enCode' },
          onChange: async (val: '4w' | '8w' | '12w') => {
            await setFieldsValue?.({ time: undefined, period: val });
            await nextTick();
            const cur = await getFieldsValue?.();
            if (!cur?.factory) {
              createMessage.warning(t('dict.CommonCol.pleaseSelectFactory'));
              clearValidate?.(['factory']);
              return;
            }
            fetchAndFill('periodChange', { period: val, factoryName: factoryNameRef.value });
          },
        },
        colProps: { span: 6 },
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

  onMounted(() => {
    setFieldsValue?.({ period: '8w' });
    clearValidate?.(['factory']);
  });
</script>

<style lang="less" scoped>
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
