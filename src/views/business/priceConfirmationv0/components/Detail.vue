<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :showOkBtn="hasBtnP('btn_edit')"
    okText="保存"
    destroyOnClose
    cancelText="取消"
    title="价格确认">
    <template #insertToolbar>
      <a-space :size="10">
        <a-button @click="handlePre">上一条</a-button>
        <a-button @click="handleNext" type="primary">下一条</a-button>
      </a-space>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
        <Subtitle title="基础信息" />
        <CustomRows :list="state.baseInfo" />
      </a-card>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb; background: #fbfbfb">
        <Subtitle title="价格" />
        <a-row>
          <a-col :span="4">
            <CustomRows
              :list="[
                {
                  label: '成本价格',
                  value: `￥${Number(currentData?.parentPartInfo?.singleCost)?.toLocaleString()}`,
                },
              ]" />
          </a-col>
          <a-col :span="18">
            <BasicForm @register="registerForm" />
          </a-col>
        </a-row>
        <a-card class="center-padding-none" v-if="currentData?.gpList?.length > 0">
          <b>报价价格</b>
          <CustomPriceRows
            :list="
              currentData?.gpList?.map((item, index) => {
                return {
                  priceTitle: `报价${index + 1}`,
                  price: `￥${Number(item.price)?.toLocaleString()}`,
                  gp: `${Number(item.gp * 100)?.toLocaleString()}`,
                  gpTitle: `GP${index + 1}(%)`,
                };
              })
            " />
          <a-divider />
          <b>竞价结果</b>
          <template v-if="currentData?.biddingResult">
            <ResultRows
              :data="{
                result: currentData?.biddingResult,
                price: currentData?.biddingPrice,
                remark: currentData?.biddingRemark,
              }" />
          </template>
          <template v-else>
            <div class="watting">待录入</div>
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
      label: '意见',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请输入意见',
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
      label: '备注',
      defaultValue: '',
      component: 'Input',
      componentProps: { placeholder: '请输入内容' },
      colProps: {
        span: 16,
      },
    },
  ];

  const columns: BasicColumn[] = [
    {
      title: '产品成本',
      dataIndex: 'productCost',
      children: [
        { title: '材料成本', dataIndex: 'materialCost', width: 180 },
        { title: '直接人工', dataIndex: 'directLaborCost', width: 180 },
        { title: '间接人工', dataIndex: 'indirectLaborCost', width: 180 },
        { title: '模夹治具', dataIndex: 'moldCost', width: 180 },
        { title: '委外加工', dataIndex: 'outsourcingCost', width: 180 },
        { title: '变动制费', dataIndex: 'dynamicEquipmentCost', width: 180 },
        { title: '固定制费', dataIndex: 'fixedEquipmentCost', width: 180 },
        { title: '管理费用', dataIndex: 'managementCost', width: 180 },
        { title: '直通率(%)', dataIndex: 'fpy', width: 180 },
        { title: '生产工时', dataIndex: 'productionTime', width: 180 },
      ],
    },
    { title: '单个成本', dataIndex: 'singleCost', width: 180 },
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
    const { code, msg } = await confirmQuotation({
      id: state.currentData.id,
      ...value,
    });
    if (code == 200) {
      createMessage.success('保存成功');
      emit('reload');
    }
    changeLoading(false);
  }
  function buildBaseInfo(currentData) {
    return [
      {
        label: '来源单号',
        value: currentData.qrApplyCode,
      },
      {
        label: '产品内部料号',
        value: currentData.insidePartNumber,
      },
      {
        label: '申请人',
        value: currentData.creatorUserName,
      },
      {
        label: '申请日期',
        value: currentData.creatorTime ? dayjs(currentData.creatorTime).format('YYYY-MM-DD') : '',
      },
      {
        label: 'MOQ(K)',
        value: currentData.moq,
      },
      {
        label: '报价用途',
        value: currentData.purpose,
      },
      {
        label: '产品描述',
        value: currentData.productDesc,
      },
    ];
  }

  function handlePre() {
    if (state.index == 0) return createMessage.warning('已经是第一条数据了');
    state.index = state.index - 1;
    init({
      record: state.cacheList[state.index],
      cacheList: state.cacheList,
    });
  }

  function handleNext() {
    if (state.index == state.cacheList.length - 1) return createMessage.warning('已经是最后一条数据了');
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

    /* 中文/正文14 */

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
