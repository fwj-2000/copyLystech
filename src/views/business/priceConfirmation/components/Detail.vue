<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    :okText="t('common.saveText')"
    destroyOnClose
    :cancelText="t('common.cancelText')"
    :title="t('dict.QuotationFlowNode.Confirm')">
    <template #insertToolbar>
      <a-space :size="10">
        <a-button @click="handlePre">{{ t('common.prevRecord') }}</a-button>
        <a-button @click="handleNext" type="primary">{{ t('common.nextRecord') }}</a-button>
      </a-space>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
        <Subtitle :title="t('common.baseinfo')" />
        <CustomRows :list="state.baseInfo" />
      </a-card>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
        <Subtitle :title="t('common.price')" />
        <a-row>
          <a-col :span="4">
            <CustomRows
              :list="[
                {
                  label: t('common.costPrice'),
                  value: `￥${Number(currentData?.parentPartInfo?.singleCost)?.toLocaleString()}`,
                },
              ]" />
          </a-col>
          <a-col :span="18">
            <BasicForm @register="registerForm" />
          </a-col>
        </a-row>
        <a-card class="center-padding-none" v-if="currentData?.gpList?.length > 0">
          <b>{{ t('common.quotedPrice') }}</b>
          <CustomPriceRows
            :list="
              currentData?.gpList?.map((item, index) => {
                return {
                  priceTitle: `${t('dict.DrawingsReview.OriginType.2')}${index + 1}`,
                  price: `￥${Number(item.price)?.toLocaleString()}`,
                  gp: `${Number(item.gp * 100)?.toLocaleString()}`,
                  gpTitle: `GP${index + 1}(%)`,
                };
              })
            " />
          <a-divider />
          <b>{{ t('dict.QuotationColumn.biddingResult') }}</b>
          <template v-if="currentData?.biddingResult">
            <ResultRows
              :data="{
                result: currentData?.biddingResult,
                price: currentData?.biddingPrice,
                remark: currentData?.biddingRemark,
              }" />
          </template>
          <template v-else>
            <div class="watting">{{ t('common.pendingEntry') }}</div>
          </template>
        </a-card>
      </a-card>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb"> </a-card>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
        <BasicTable @register="registerTable"></BasicTable>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { reactive, toRefs } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import CustomRows from '/@/views/engineering/data/produce/components/CustomRows.vue';
  import CustomPriceRows from './CustomRows.vue';
  import ResultRows from './ResultRows.vue';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { confirmQuotation } from '/@/api/engineering/quotatios';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { hasBtnP } = usePermission();

  const state = reactive({
    currentData: {},
    cacheList: [],
    index: 0,
    baseInfo: [],
    dataSource: [],
  });

  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();

  const searchFormSchema: FormSchema[] = [
    {
      field: 'confirmOpinion',
      label: t('dict.SampleApplyColumn.opinion'),
      component: 'ApiSelect',
      componentProps: {
        placeholder: t('dict.SampleApplyColumn.opinion'),
        api: () => {
          return baseStore.getDictionaryData('Quotation.ConfirmOpinion');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: {
        span: 8,
      },
    },
    {
      field: 'confirmRemark',
      label: t('dict.SalesForecastColumn.remark'),
      defaultValue: '',
      component: 'Input',
      colProps: {
        span: 16,
      },
    },
  ];

  const columns: BasicColumn[] = [
    {
      title: t('common.productCost'),
      dataIndex: 'productCost',
      children: [
        { title: t('common.materialCost'), dataIndex: 'materialCost', width: 180 },
        { title: t('common.DirectLabor'), dataIndex: 'directLaborCost', width: 180 },
        { title: t('common.indirectLabor'), dataIndex: 'indirectLaborCost', width: 180 },
        { title: t('common.fixtureAndJig'), dataIndex: 'moldCost', width: 180 },
        { title: t('common.fixtureAndJig'), dataIndex: 'outsourcingCost', width: 180 },
        { title: t('dict.LaborRateColumn.changeCost'), dataIndex: 'dynamicEquipmentCost', width: 180 },
        { title: t('dict.LaborRateColumn.fixedCost'), dataIndex: 'fixedEquipmentCost', width: 180 },
        { title: t('common.administrativeExpenses'), dataIndex: 'managementCost', width: 180 },
        { title: t('common.firstPassYield'), dataIndex: 'fpy', width: 180 },
        { title: t('common.productionHours'), dataIndex: 'productionTime', width: 180 },
      ],
    },
    { title: t('common.unitCost'), dataIndex: 'singleCost', width: 180 },
  ];

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerForm, { setFieldsValue, validate, updateSchema, getFieldsValue }] = useForm({
    schemas: searchFormSchema,
    // labelWidth: 120,
  });

  const [registerTable, { updateTableDataRecord, setTableData }] = useTable({
    columns,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    pagination: false,
    scroll: {
      y: 100,
    },
  });

  const { currentData } = toRefs(state);

  async function init(data) {
    const { record, cacheList } = data;
    state.currentData = cloneDeep(record);
    state.cacheList = cacheList;
    state.index = cacheList.findIndex(item => item.id === record.id);
    changeLoading(true);
    state.baseInfo = buildBaseInfo(record);
    state.dataSource[0] = {
      ...record.parentPartInfo,
    };

    setFieldsValue({
      confirmOpinion: record.confirmOpinion + '',
      confirmRemark: record.confirmRemark,
    });

    setTableData([
      {
        ...record.parentPartInfo,
        fpy: record.parentPartInfo.fpy * 100,
      },
    ]);

    setTimeout(() => {
      changeLoading(false);
    }, 300);
  }

  async function handleSaveAction() {
    changeLoading(true);
    const value = getFieldsValue();
    const { code } = await confirmQuotation({
      id: state.currentData.id,
      ...value,
    });
    if (code == 200) {
      createMessage.success(t('component.batchImport.saveSuccess'));
      emit('reload');
    }
    changeLoading(false);
  }
  function buildBaseInfo(currentData) {
    return [
      {
        label: t('dict.FilingsApplyColumn.QuantitativeApplyNo'),
        value: currentData.qrApplyCode,
      },
      {
        label: t('dict.ECNColumn.insidePartNumber'),
        value: currentData.insidePartNumber,
      },
      {
        label: t('dict.ECNColumn.applyUserName'),
        value: currentData.creatorUserName,
      },
      {
        label: t('dict.ECNColumn.applyDate'),
        value: currentData.creatorTime ? dayjs(currentData.creatorTime).format('YYYY-MM-DD') : '',
      },
      {
        label: 'MOQ(K)',
        value: currentData.moq,
      },
      {
        label: t('dict.QuotationRequirementsColumn.PurposeName'),
        value: currentData.purpose,
      },
      {
        label: t('dict.CloudMeasureColumn.materialDesc'),
        value: currentData.productDesc,
      },
    ];
  }

  function handlePre() {
    if (state.index == 0) return createMessage.warning(t('common.alreadyAtTheFirstDataEntry'));
    state.index = state.index - 1;
    init({
      record: state.cacheList[state.index],
      cacheList: state.cacheList,
    });
  }

  function handleNext() {
    if (state.index == state.cacheList.length - 1) return createMessage.warning(t('common.alreadyAtTheLastDataEntry'));
    state.index = state.index + 1;
    init({
      record: state.cacheList[state.index],
      cacheList: state.cacheList,
    });
  }
</script>

<style lang="less" scoped>
  //.cus-rows {
  //  display: inline-block;
  //}
  //:deep(.ant-form) {
  //  display: inline-block;
  //}
  .watting {
    color: #666;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }

  :deep(.center-padding-none .ant-card-body) {
    padding: 10px;
  }

  :deep(.ant-divider-horizontal) {
    margin: 10px 0;
  }
</style>
