<template>
  <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
    <Subtitle title="基本信息" />
    <BasicForm @register="registerForm"></BasicForm>
    <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 16px">
      <Subtitle title="供应商报价" />
      <BasicForm @register="registerPriceForm"></BasicForm>
      <a-card style="background: #f7f7f7; margin-bottom: 16px">
        <BasicForm @register="registerCurrencyForm"></BasicForm>
        <a-row :gutter="36">
          <a-col :span="12">
            <b>{{ currentData.baseCurrencyName }}, 未税</b>
            <BasicForm @register="registerBeforeForm"></BasicForm>
          </a-col>
          <a-col :span="12">
            <b>{{ currentData.benchmarkCurrencyName }}</b>
            <BasicForm @register="registerAfterForm"></BasicForm>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="background: #f7f7f7; margin-bottom: 16px">
        <b>{{ currentData.baseCurrencyName }} --> {{ currentData.benchmarkCurrencyName }}, 未税, 到厂</b>
        <BasicForm @register="registerIntroForm"></BasicForm>
      </a-card>
    </a-card>
    <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 16px">
      <Subtitle :title="`报成本中心价格${currentData.baseCurrencyName}(包含buffer)`" />
      <BasicForm @register="registerSumFrom"></BasicForm>
    </a-card>
  </a-card>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getCurrencyList, getExchangeRateList, getMaterialCodeList, getProductLineList, getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { multiply } from 'mathjs';
  import { useBaseStore } from '/@/store/modules/base';
  import { buildArea } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildArea';
  import { buildCurrencyPrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildCurrencyPrice';
  import { buildPriceOc2bcUntaxedPurchasingUnit } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildPriceOc2bcUntaxedPurchasingUnit';
  import { buildPriceOc2bcUntaxedPriceUnit } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildPriceOc2bcUntaxedPriceUnit';
  import { buildGap } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/buildGap';
  import { useBuildGeneralTradePrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/useBuildGeneralTradePrice';
  import { useBuildBondedPrice } from '/@/views/purchase/basicInformation/materialPrice/components/buildViewUtils/useBuildBondedPrice';
  import { defineProps, nextTick, onMounted, reactive, toRefs, watch } from 'vue';
  import { isEqual } from 'lodash-es';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  const baseStore = useBaseStore();

  const props = defineProps(['sign']);

  const state = reactive({
    currentData: {},
    ExchangeRate: 0,
    currencyList: [],
  });

  const { currentData } = toRefs(state);

  const [registerForm, { setFieldsValue, validateFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getFormSchemas(),
    layout: 'vertical',
    labelWidth: 220,
  });
  const [
    registerPriceForm,
    {
      getFieldsValue: getPriceFieldsValue,
      validateFields: validatePriceFields,
      setFieldsValue: setPriceFieldsValue,
      updateSchema: priceUpdateSchema,
      setProps: setPriceProps,
    },
  ] = useForm({
    schemas: getFormPriceSchemas(),
    layout: 'vertical',
    labelWidth: 220,
  });
  const [registerCurrencyForm, { validateFields: validateCurrencyFields, setFieldsValue: setCurrencyFields, setProps: setCurrencyProps }] = useForm({
    schemas: getFormCurrencySchemas(),
    layout: 'horizontal',
  });
  const [
    registerBeforeForm,
    { getFieldsValue: getBeforeFieldsValue, validateFields: validateBeforeFields, setFieldsValue: setBeforeFieldsValue, setProps: setBeforeProps },
  ] = useForm({
    layout: 'vertical',
    schemas: getFormBeforeSchemas(),
  });
  const [
    registerAfterForm,
    { getFieldsValue: getAfterFieldsValue, validateFields: validateAfterFields, setFieldsValue: setAfterFieldsValue, setProps: setAfterProps },
  ] = useForm({
    layout: 'vertical',
    schemas: getFormAfterSchemas(),
  });
  const [
    registerIntroForm,
    {
      setFieldsValue: setIntroFieldsValue,
      validateFields: validateIntroFields,
      getFieldsValue: getIntroFieldsValue,
      updateSchema: updateIntroFieldValue,
      setProps: setIntroProps,
    },
  ] = useForm({
    layout: 'vertical',
    schemas: getFormIntroSchemas(),
    labelWidth: 220,
  });
  const [registerSumFrom, { setFieldsValue: setSumFieldsValue, validateFields: validateSumFields }] = useForm({
    layout: 'vertical',
    schemas: getFormSumSchemas(),
    labelWidth: 220,
  });

  watch(
    () => props.sign,
    (value, oldValue) => {
      if (isEqual(value, oldValue)) return;
      if (value === 'view') {
        nextTick(() => {
          setProps({
            disabled: true,
          });
          setPriceProps({
            disabled: true,
          });
          setCurrencyProps({
            disabled: true,
          });
          setBeforeProps({
            disabled: true,
          });
          setAfterProps({
            disabled: true,
          });
          setIntroProps({
            disabled: true,
          });
        });
      } else {
        nextTick(() => {
          setProps({
            disabled: false,
          });
          setPriceProps({
            disabled: false,
          });
          setCurrencyProps({
            disabled: false,
          });
          setBeforeProps({
            disabled: false,
          });
          setAfterProps({
            disabled: false,
          });
          setIntroProps({
            disabled: false,
          });
        });
        getTypeOption();
      }
    },
    { deep: true, immediate: true },
  );

  function getFormSchemas(): FormSchema[] {
    return [
      {
        field: 'id',
        label: '报价单号',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '系统生成',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'insideCode',
        label: '材料内部料号',
        component: 'ApiSelect',
        componentProps: {
          api: getMaterialCodeList,
          placeholder: '请输入材料内部编码',
          showSearch: true,
          apiSearch: {
            show: true,
            // 搜索字段名
            searchName: 'keyword',
          },
          // memoInputVal: true,
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          onChange: (e, v) => {
            if (!e) return;
            delete v.id;
            setFieldsValue({
              ...v,
              materialArea: multiply(v.materialLength || 0, v.materialWidth || 0),
            });
            updateSchema([
              {
                field: 'materialLength',
                componentProps: {
                  disabled: !!v.materialLength,
                },
              },
              {
                field: 'materialWidth',
                componentProps: {
                  disabled: !!v.materialWidth,
                },
              },
              {
                field: 'materialArea',
                componentProps: {
                  disabled: true,
                },
              },
              {
                field: 'supplierCode',
                componentProps: {
                  disabled: true,
                },
              },
              {
                field: 'materialName',
                componentProps: {
                  disabled: true,
                },
              },
              {
                field: 'sizeUnit',
                componentProps: {
                  disabled: true,
                },
              },
            ]);
          },
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
            validator: (_, str) =>
              new Promise((res, rej) => {
                const fieldsValue = getFieldsValue();
                if (!fieldsValue.materialTypeFromManufacturer && !str) {
                  rej('请选择材料内部编码或输入原厂商材料型号');
                } else {
                  res();
                }
              }),
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'materialTypeFromManufacturer',
        label: '原厂商材料型号',
        component: 'Input',
        componentProps: {
          placeholder: '请输入原厂商内部料号',
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
            validator: (_, str) =>
              new Promise((res, rej) => {
                const fieldsValue = getFieldsValue();
                if (!fieldsValue.insideCode && !str) {
                  rej('请选择材料内部编码或输入原厂商材料型号');
                } else {
                  res();
                }
              }),
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'terminalCustomerCode',
        label: '终端客户',
        component: 'ApiSelect',
        componentProps: {
          api: getBaseDataTerminalCustomerList,
          placeholder: '请选择终端客户',
          labelField: 'terminalCustomerName',
          valueField: 'terminalCustomerCode',
          nameFormat: ['terminalCustomerCode', '-', 'terminalCustomerName'],
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'productLineCode',
        label: '产品线代码',
        component: 'ApiSelect',
        componentProps: {
          api: getProductLineList,
          placeholder: '请选择产品线',
          showSearch: true,
          apiSearch: {
            show: true,
          },
          labelField: 'Name',
          valueField: 'Code',
          resultField: 'data',
          filterOption: false,
          nameFormat: ['Code', '-', 'Name'],
          notFoundContent: null,
          immediate: true,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
            validator: () => Promise.resolve(),
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'materialLength',
        label: '长(M)',
        component: 'InputNumber',
        componentProps: {
          placeholder: '自动带入',
          thousands: true,
          precision: 6,
          disabled: false,
          onChange: e => {
            buildViewData({ materialLength: e });
          },
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'materialWidth',
        label: '宽(MM)',
        component: 'InputNumber',
        componentProps: {
          placeholder: '自动带入',
          disabled: false,
          precision: 6,
          thousands: true,
          onChange: e => {
            buildViewData({ materialWidth: e });
          },
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'materialArea',
        label: '面积',
        component: 'InputNumber',
        helpMessage: ['(宽MM /1000) * 长M', '保留6位小数'],
        componentProps: {
          placeholder: '系统计算',
          precision: 6,
          disabled: false,
          thousands: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'supplierCode',
        label: '供应商',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: false,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'materialDescription',
        label: '物料名称',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: false,
        },
        colProps: {
          span: 12,
        },
      },
      {
        field: 'sizeUnit',
        label: '尺寸单位',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '自动带入',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'purchasingUnit',
        label: '采购单位',
        component: 'ApiSelect',
        componentProps: {
          api: getUnitListByKeyword,
          placeholder: '请选择采购单位',
          showSearch: true,
          apiSearch: {
            show: true,
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
          onChange: e => {
            buildViewData({ purchasingUnit: e });
          },
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
            validator: () => Promise.resolve(),
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'priceUnit',
        label: '单价单位',
        component: 'ApiSelect',
        componentProps: {
          api: getUnitListByKeyword,
          placeholder: '请选择单价单位',
          showSearch: true,
          apiSearch: {
            show: true,
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
          onChange: e => {
            buildViewData({ priceUnit: e });
          },
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
            validator: () => Promise.resolve(),
          },
        ],
        colProps: {
          span: 6,
        },
      },
      {
        field: 'proportionOfPriceReduction',
        label: '本次降价比例',
        component: 'Input',
        componentProps: {
          placeholder: '请输入本次降价比例',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'quotationType',
        label: '报价类型',
        component: 'ApiSelect',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PurchaseQuotation.QuotationType');
          },
          placeholder: '请选择报价类型',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'responsiblePersonId',
        label: '负责人',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '请选择负责人',
          allowClear: true,
          showSearch: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'effectiveDate',
        label: '生效日期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择生效日期',
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'expirationDate',
        label: '失效日期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择失效日期',
          format: 'YYYY-MM-DD',
        },
        colProps: {
          span: 6,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'quotationTime',
        label: '报价时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择报价时间',
          disabled: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'supplierToCustomerPrice',
        label: 'supplier to customer price',
        component: 'InputNumber',
        componentProps: {
          placeholder: 'supplier to customer price',
          thousands: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'gap1',
        label: 'Gap1',
        component: 'Input',
        componentProps: {
          placeholder: '请输入 Gap1',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'supplierToCompetitorPrice',
        label: 'supplier to competitor price',
        component: 'InputNumber',
        componentProps: {
          placeholder: 'supplier to competitor price',
          thousands: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'gap2',
        label: 'Gap2',
        component: 'Input',
        componentProps: {
          placeholder: '请输入 Gap2',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'originLocation',
        label: '原产国',
        component: 'Input',
        componentProps: {
          placeholder: '请输入原产国',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'moq',
        label: 'MOQ',
        component: 'Input',
        componentProps: {
          placeholder: '请输入MOQ',
          thousands: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'lt',
        label: 'L/T',
        component: 'Input',
        componentProps: {
          placeholder: '请输入L/T',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'applyUserId',
        label: '创建人',
        component: 'UserSelect',
        componentProps: {
          placeholder: '请输入创建人',
          disabled: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'creatorTime',
        label: '创建时间',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请输入创建时间',
          disabled: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'status',
        label: '是否启用',
        component: 'ApiSelect',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PurchaseQuotation.Status');
          },
          placeholder: '请选择是否启用',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'remark',
        label: '备注',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入备注内容',
          autoSize: { minRows: 1, maxRows: 2 },
        },
        colProps: {
          span: 12,
        },
      },
    ];
  }

  function getFormPriceSchemas(): FormSchema[] {
    return [
      {
        field: 'baseCurrency',
        label: '本位币币别',
        component: 'Select',
        defaultValue: 'CNY',
        componentProps: {
          placeholder: '请选择本位币币别',
          showSearch: true,
          filterOption,
          onChange: e => {
            state.beforeTitle = e;
            const { originalCurrency } = getPriceFieldsValue();
            getExchangeRate(e, originalCurrency);
          },
        },
        colProps: {
          span: 3,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'originalCurrency',
        label: '原币币别',
        defaultValue: 'USD',
        component: 'Select',
        componentProps: {
          placeholder: '请选择原币币别',
          showSearch: true,
          filterOption,
          // onChange: e => {
          //   state.afterTitle = e;
          //   const { baseCurrency } = getPriceFieldsValue();
          //   getExchangeRate(baseCurrency, e);
          // },
        },
        colProps: {
          span: 3,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'priceType',
        label: '价格类型',
        component: 'ApiSelect',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PurchaseQuotation.PriceType');
          },
          placeholder: '请选择价格类型',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 3,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'benchmarkCurrency',
        label: '基准币别',
        component: 'Select',
        componentProps: {
          placeholder: '请选择基准币别',
          showSearch: true,
          filterOption,
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'suggestedPurchaseCurrency',
        label: '建议采购币别',
        component: 'Select',
        componentProps: {
          placeholder: '请选择建议采购币别',
          showSearch: true,
          filterOption,
          onChange: e => {
            buildViewData({
              suggestedPurchaseCurrency: e,
            });
          },
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'reservedBuffer',
        label: '预留buffer(%)',
        component: 'Input',
        componentProps: {
          placeholder: '请输入预留buffer',
          suffix: '%',
          onChange: e => {
            buildViewData({
              reservedBuffer: e,
            });
          },
        },
        colProps: {
          span: 4,
        },
      },
      {
        field: 'usdRmbGap',
        label: `Gap(%)`,
        helpMessage: ['Gap=((单价单位(本位币) + 运费(本位币) / 物料面积)-未税到厂价(单价单位))/((单价单位(本位币) + 运费(本位币) / 物料面积)'],
        component: 'InputNumber',
        labelWidth: 220,
        componentProps: {
          placeholder: '系统计算',
          disabled: true,
        },
        colProps: {
          span: 3,
        },
      },
    ];
  }

  function getFormCurrencySchemas(): FormSchema[] {
    return [
      {
        field: 'deliveryTerms',
        label: '交货条件',
        component: 'ApiSelect',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PurchaseQuotation.DeliveryTerms');
          },
          placeholder: '请选择交货条件',
          labelField: 'fullName',
          valueField: 'enCode',
          nameFormat: ['enCode', '-', 'fullName'],
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        colProps: {
          span: 6,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      // {
      //   field: 'freightUnit',
      //   label: '运费单位',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: getUnitListByKeyword,
      //     showSearch: true,
      //     apiSearch: {
      //       show: true,
      //     },
      //     resultField: 'data',
      //     filterOption: false,
      //     notFoundContent: null,
      //     immediate: true,
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     nameFormat: ['Name', '(', 'Code', ')'],
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      //   rules: [
      //     {
      //       required: true,
      //       trigger: 'blur',
      //       message: '必填',
      //     },
      //   ],
      // },
    ];
  }

  // CNY 未税
  function getFormBeforeSchemas(): FormSchema[] {
    return [
      {
        field: 'supplierPriceBaseCurrency',
        label: '采购价格',
        helpMessage: [
          '本位币采购价格计算规则',
          '1、如采购单位=单价单位, 采购价格=单位价格(手动输入)',
          '2、如采购单位=平方米(M2), 采购价格=单位价格(手动输入) / 面积((长 * 宽 / 1000))',
          '3、如采购单位=米(M), 采购价格=单位价格(手动输入) * 长',
          '4、如采购单位=克(G)并且单价单位=千克(KG), 采购价格=单位价格(手动输入) / 1000',
          '5、如采购单位=千克(KG)并且单价单位=克(G), 采购价格=单位价格(手动输入) * 1000',
        ],
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '默认系统生成',
        },
        labelWidth: 220,
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'supplierUnitPriceBaseCurrency',
        label: '单位价格',
        component: 'InputNumber',
        componentProps: {
          placeholder: '单位价格',
          onChange: e => {
            buildViewData({
              supplierUnitPriceBaseCurrency: e,
            });
          },
        },
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'freightBaseCurrency',
        label: '运费',
        component: 'InputNumber',
        componentProps: {
          placeholder: '运费',
          onChange: e => {
            buildViewData({ freightBaseCurrency: e });
          },
        },
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
    ];
  }

  function getFormAfterSchemas(): FormSchema[] {
    return [
      {
        field: 'supplierPriceOriginalCurrency',
        label: '采购价格',
        component: 'InputNumber',
        helpMessage: [
          '原币采购价格计算规则',
          '1、如采购单位=单价单位, 采购价格=单位价格(手动输入)',
          '2、如采购单位=平方米(M2), 采购价格=单位价格(手动输入) / 面积((长 * 宽 / 1000))',
          '3、如采购单位=米(M), 采购价格=单位价格(手动输入) / 长',
          '4、如采购单位=克(G)并且单价单位=千克(KG), 采购价格=单位价格(手动输入) * 1000',
          '5、如采购单位=千克(KG)并且单价单位=克(G), 采购价格=单位价格(手动输入) / 1000',
        ],
        labelWidth: 220,
        componentProps: {
          disabled: true,
          placeholder: '默认系统计算',
        },
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'supplierUnitPriceOriginalCurrency',
        label: '单位价格',
        component: 'InputNumber',
        componentProps: {
          placeholder: '单位价格',
          onChange: e => {
            buildViewData({ supplierUnitPriceOriginalCurrency: e });
          },
        },
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
      {
        field: 'freightOriginalCurrency',
        label: '运费',
        component: 'InputNumber',
        componentProps: {
          placeholder: '运费',
          onChange: e => {
            buildViewData({ freightOriginalCurrency: e });
          },
        },
        colProps: {
          span: 8,
        },
        rules: [
          {
            required: true,
            trigger: 'blur',
            message: '必填',
          },
        ],
      },
    ];
  }

  // USD --> CNY, 未税 到厂
  function getFormIntroSchemas(): FormSchema[] {
    return [
      {
        field: 'exchangeRate',
        helpMessage: ['本位币转原币汇率 本位币1元 --> 原币'],
        label: '报价当月汇率',
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '关联财务',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'tariff',
        label: '关税',
        component: 'InputNumber',
        defaultValue: '50',
        componentProps: {
          placeholder: '关联财务',
          formatter: value => `${value}%`,
          parser: value => value.replace('%', ''),
          onChange: e => {
            buildViewData({ tariff: e });
          },
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'priceOc2bcUntaxedPurchasingUnit',
        // label: `${currentData.baseCurrency}转${currentData.benchmarkCurrency}未税到厂价(采购单位)`,
        label: `未税到厂价(采购单位)`,
        helpMessage: ['(采购价格 * 汇率) * (1 + 关税) + (原币运费 * 汇率)'],
        component: 'InputNumber',
        componentProps: {
          placeholder: '系统计算',
          disabled: true,
        },
        labelWidth: 250,
        colProps: {
          span: 6,
        },
      },
      {
        field: 'priceOc2bcUntaxedPriceUnit',
        // label: `${state.afterTitle}转${state.beforeTitle}未税到厂价(单价单位)`,
        label: `未税到厂价(单价单位)`,
        helpMessage: [
          '1、如采购单位=单价单位, 原币转本位币未税到厂价(单价单位)=原币转本位币未税到厂价(采购单位)',
          '2、如采购单位=平方米(M2), 原币转本位币未税到厂价转原币转本位币未税到厂价(单价单位)=原币转本位币未税到厂价转原币转本位币未税到厂价(采购单位) / 面积(长 * 宽 / 1000)',
          '3、如采购单位=米(M), 原币转本位币未税到厂价转原币转本位币未税到厂价(单价单位)=原币转本位币未税到厂价转原币转本位币未税到厂价(采购单位) / 长',
          '4、如采购单位=克(G)并且单价单位=千克(KG), 原币转本位币未税到厂价转原币转本位币未税到厂价(单价单位)=原币转本位币未税到厂价转原币转本位币未税到厂价(采购单位) / 1000',
          '5、如采购单位=千克(KG)并且单价单位=克(G), 原币转本位币未税到厂价转原币转本位币未税到厂价(单价单位)=原币转本位币未税到厂价转原币转本位币未税到厂价(采购单位) * 1000',
        ],
        component: 'InputNumber',
        labelWidth: 250,
        componentProps: {
          placeholder: '系统计算',
          disabled: true,
        },
        colProps: {
          span: 6,
        },
      },
    ];
  }

  function getFormSumSchemas(): FormSchema[] {
    return [
      {
        field: 'generalTradePricePurchasingUnit',
        label: '一般贸易价(采购单位)',
        helpMessage: [
          '采购币别等于USD时，原币转本位币未税到厂价(采购单位) * (1+预留Buffer)',
          '采购币别不等于USD时，供应商报价-采购价格(本位币) * （1+预留Buffer) + 运费(原币)',
        ],
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '系统计算',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'generalTradePricePriceUnit',
        label: '一般贸易价(单价单位)',
        helpMessage: [
          '1、如采购单位=单价单位, 一般贸易价(单价单位)=原币转本位币未税到厂价(单价单位)',
          '2、如采购单位=平方米(M2), 一般贸易价(单价单位)=原币转本位币未税到厂价(单价单位) / 面积(长 * 宽 / 1000)',
          '3、如采购单位=米(M), 一般贸易价(单价单位)=原币转本位币未税到厂价(单价单位) / 长',
          '4、如采购单位=克(G)并且单价单位=千克(KG), 一般贸易价(单价单位)=原币转本位币未税到厂价(单价单位) * 1000',
          '5、如采购单位=千克(KG)并且单价单位=克(G), 一般贸易价(单价单位)=原币转本位币未税到厂价(单价单位) / 1000',
        ],
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '系统计算',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'bondedPricePurchasingUnit',
        label: '保税价(采购单位)',
        helpMessage: [
          '关税大于等于10，（供应商报价-采购价格（原币）*1.03*(1+预留Buffer)+供应商报价-单位价格（原币）)*报价当月汇率',
          '关税小于10，（供应商报价-采购价格（原币）*1.02*(1+预留Buffer)+供应商报价-单位价格（原币）)*报价当月汇率',
        ],
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '系统计算',
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'bondedPricePriceUnit',
        label: '保税价(采购单位)',
        helpMessage: [
          '1、如采购单位=单价单位, 保税价(单价单位)=原币转本位币未税到厂价(单价单位)',
          '2、如采购单位=平方米(M2), 保税价(单价单位)=原币转本位币未税到厂价(单价单位) / 面积(长 * 宽 / 1000)',
          '3、如采购单位=米(M), 保税价(单价单位)=原币转本位币未税到厂价(单价单位) / 长',
          '4、如采购单位=克(G)并且单价单位=千克(KG), 保税价(单价单位)=原币转本位币未税到厂价(单价单位) / 1000',
          '5、如采购单位=千克(KG)并且单价单位=克(G), 保税价(单价单位)=原币转本位币未税到厂价(单价单位) * 1000',
        ],
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          placeholder: '系统计算',
        },
        colProps: {
          span: 6,
        },
      },
    ];
  }

  function filterOption(input: string, option: any) {
    return option.ShortName.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  function buildViewData(type) {
    const { materialWidth, materialLength, purchasingUnit, priceUnit } = getFieldsValue();
    const { suggestedPurchaseCurrency, reservedBuffer } = getPriceFieldsValue();
    const { supplierUnitPriceBaseCurrency, freightBaseCurrency } = getBeforeFieldsValue();
    const { supplierUnitPriceOriginalCurrency } = getAfterFieldsValue();

    const { tariff } = getIntroFieldsValue();
    const { freightOriginalCurrency } = getAfterFieldsValue();

    const values = {
      materialWidth,
      materialLength,
      purchasingUnit,
      priceUnit,
      suggestedPurchaseCurrency,
      reservedBuffer,
      supplierUnitPriceBaseCurrency,
      freightBaseCurrency,
      supplierUnitPriceOriginalCurrency,
      tariff,
      freightOriginalCurrency,
      exchangeRate: state.ExchangeRateNow,
      ...type,
    };
    const materialArea = buildArea(values);
    const [supplierPriceBaseCurrency, supplierPriceOriginalCurrency] = buildCurrencyPrice(values);

    const priceOc2bcUntaxedPurchasingUnit = buildPriceOc2bcUntaxedPurchasingUnit({
      ...values,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
    });
    const priceOc2bcUntaxedPriceUnit = buildPriceOc2bcUntaxedPriceUnit({
      ...values,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
    });

    const gap = buildGap({
      ...values,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });

    setFieldsValue({
      materialArea,
    });
    setBeforeFieldsValue({
      supplierPriceBaseCurrency,
    });
    setAfterFieldsValue({
      supplierPriceOriginalCurrency,
    });

    const [generalTradePricePurchasingUnit, generalTradePricePriceUnit] = useBuildGeneralTradePrice({
      ...values,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    const [bondedPricePurchasingUnit, bondedPricePriceUnit] = useBuildBondedPrice({
      ...values,
      supplierPriceBaseCurrency,
      supplierPriceOriginalCurrency,
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    setIntroFieldsValue({
      priceOc2bcUntaxedPurchasingUnit,
      priceOc2bcUntaxedPriceUnit,
    });
    setPriceFieldsValue({
      usdRmbGap: gap,
    });
    setSumFieldsValue({
      generalTradePricePurchasingUnit,
      generalTradePricePriceUnit,
      bondedPricePurchasingUnit,
      bondedPricePriceUnit,
    });
  }

  onMounted(() => {
    getTypeOption();
  });

  async function setCurrentData(value) {
    console.log(value);
    await getTypeOption();
    value.baseCurrencyName = state.currencyList.find(item => value.baseCurrency == item.ISOCode)?.ShortName;
    value.benchmarkCurrencyName = state.currencyList.find(item => value.benchmarkCurrency == item.ISOCode)?.ShortName;
    state.currentData = value;
    state.ExchangeRateNow = value.exchangeRate;
    // updateIntroFieldValue([
    //   {
    //     field: 'priceOc2bcUntaxedPurchasingUnit',
    //     label: `${value.baseCurrency}转${value.benchmarkCurrency}未税到厂价(采购单位)`,
    //   },
    //   {
    //     field: 'priceOc2bcUntaxedPriceUnit',
    //     label: `${value.baseCurrency}转${value.benchmarkCurrency}未税到厂价(单价单位)`,
    //   },
    // ]);
    setFieldsValue(value);
    setCurrencyFields(value);
    setBeforeFieldsValue(value);
    setPriceFieldsValue({
      ...value,
      reservedBuffer: value.reservedBuffer * 100,
    });
    setAfterFieldsValue(value);
    setIntroFieldsValue({
      ...value,
      tariff: value.tariff * 100,
    });
    setSumFieldsValue(value);
  }
  async function getTypeOption() {
    const { code, data } = await getCurrencyList({ keyword: '' });
    state.currencyList = data;
    return new Promise((res, rej) => {
      if (code === 200) {
        const list = data.map(item => {
          return {
            ISOCode: item.ISOCode,
            ShortName: item.ShortName,
          };
        });
        priceUpdateSchema([
          {
            field: 'baseCurrency',
            componentProps: {
              options: list,
              fieldNames: {
                value: 'ISOCode',
                label: 'ShortName',
              },
            },
          },
          {
            field: 'originalCurrency',
            componentProps: {
              options: list,
              fieldNames: {
                value: 'ISOCode',
                label: 'ShortName',
              },
            },
          },
          {
            field: 'benchmarkCurrency',
            componentProps: {
              options: list,
              fieldNames: {
                value: 'ISOCode',
                label: 'ShortName',
              },
            },
          },
          {
            field: 'suggestedPurchaseCurrency',
            componentProps: {
              options: list,
              fieldNames: {
                value: 'ISOCode',
                label: 'ShortName',
              },
            },
          },
        ]);
        res('success');
      }
    });
  }

  async function getCurrencyFields() {
    const baseFields = await validateFields();
    if (!baseFields) return;
    const priceFields = await validatePriceFields();
    if (!priceFields) return;
    const currencyFields = await validateCurrencyFields();
    if (!currencyFields) return;
    const beforeFields = await validateBeforeFields();
    if (!beforeFields) return;
    const afterFields = await validateAfterFields();
    if (!afterFields) return;
    const introFields = await validateIntroFields();
    if (!introFields) return;
    const sumFields = await validateSumFields();
    if (!sumFields) return;

    const params = {
      ...baseFields,
      ...priceFields,
      ...currencyFields,
      ...beforeFields,
      ...afterFields,
      ...introFields,
      ...sumFields,
      tariff: Number(introFields.tariff / 100),
      reservedBuffer: Number(priceFields.reservedBuffer / 100),
    };

    return params;
  }

  defineExpose({
    setCurrentData,
    getCurrencyFields,
  });
</script>
