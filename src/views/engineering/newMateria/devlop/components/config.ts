import { getInnerPartNumber } from '/@/api/engineering/newMateria';
import { getFactoryList } from '/@/api/customerSerivce';
import { FormSchema } from '/@/components/Form';
import { getProductType } from '/@/api/engineering/pcc';
import { useBaseStore } from '/@/store/modules/base';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { getMetarialCode } from '/@/api/business/material';
import { IS_OPTION_LIST, getStatus } from '/@/components/CustomComponents/src/material/Constant';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();

interface FormConfig {
  labelWidth: number;
  layout: 'vertical' | 'inline' | 'horizontal';
  baseColProps?: {
    span: number;
  };
  rowProps?: any;
  schemas: FormSchema[];
}

export function baseFrorm(changeCallback?: CallableFunction): FormConfig {
  return {
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    rowProps: {
      align: 'top',
      justify: 'start',
      gutter: 5,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: [
      {
        field: 'insidePartNumber',
        label: '产品内部料号',
        component: 'ApiSelect',
        componentProps: {
          api: getInnerPartNumber,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'insidePartNumber',
          },
          resultField: 'data',
          valueField: 'InsidePartNumber',
          labelField: 'InsidePartNumber',
          params: {
            pageSize: 50,
          },
          onChange: (value, data) => {
            changeCallback && changeCallback(value, data);
            console.log(value, data);
            if (value) {
              //清空旧版成品编码
              changeCallback?.('clearOldNumber', { value });
            }
          },
        },
      },
      {
        field: 'insideNumberOld',
        label: '旧版成品编码',
        component: 'Input',
        componentProps: {
          onChange: value => {
            if (value) {
              changeCallback?.('clearNewNumber', { value });
            }
          },
        },
      },
      {
        field: 'terminalProject',
        label: '终端项目代码',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
        required: true,
      },
      {
        field: 'factoryId',
        i18nField: 'CommonCol.factory',
        label: '工厂',
        component: 'ApiSelect',
        componentProps: {
          api: getPartNumberFactoryList,
          placeholder: '请选择',
          resultField: 'data',
          valueField: 'Id',
          nameFormat: ['Code', '/', 'Name'],
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          filterOption: false,
        },
        required: true,
      },
      {
        field: 'applySpec',
        label: '申请规格',
        required: true,
        component: 'Input',
        componentProps: {
          palaceholder: '请输入',
        },
      },
      {
        field: 'deliveryDate',
        label: '要求交期',
        required: true,
        component: 'DatePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
        },
      },
      {
        field: 'terminalCustomerCode',
        i18nField: 'terminalCustomerName',
        label: '终端客户信息',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '自动带入',
          i18nField: 'CommonCol.fromSys',
        },
        required: true,
      },
      {
        field: 'productLineCode',
        label: '产品线',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '自动带入',
          i18nField: 'CommonCol.fromSys',
        },
        required: true,
      },
      {
        field: 'productTypeId',
        i18nField: 'productTypeName',
        label: '产品类型',
        component: 'ApiSelect',
        componentProps: {
          api: getProductType,
          apiSearch: {
            show: true,
            searchName: 'productCategory',
          },
          resultField: 'data',
          labelField: 'productCategory',
          valueField: 'id',
          showSearch: true,
          immediate: true,
          filterOption: false,
          alwaysLoad: true,
        },
        required: true,
      },
      {
        field: 'projectStage',
        label: '项目现阶段',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('ProjectStage');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'isNUD',
        i18nField: 'isNUDDesc',
        label: '是否NUD',
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
          options: IS_OPTION_LIST,
        },
        required: true,
      },
      {
        field: 'estimateTotal',
        label: '预估项目总量(W)',
        component: 'InputNumber',
        required: true,
        componentProps: {
          min: 1,
        },
      },
      {
        field: 'estimateProductionTime',
        i18nField: 'estimateProductionDateTime',
        label: '预计量产月份',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请选择预计量产月份',
          picker: 'month',
          format: 'YYYY-MM',
        },
        required: true,
      },
      {
        field: 'productSizeLong',
        label: '产品长度(MM)',
        component: 'InputNumber',
        componentProps: { placeholder: '请选择', min: 0 },
        required: true,
      },
      {
        field: 'productSizeWide',
        label: '产品宽度(MM)',
        component: 'InputNumber',
        required: true,
      },
      {
        field: 'consumption',
        label: '用量(M2/KPCS)',
        component: 'InputNumber',
        componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
      },
      {
        field: 'productArea',
        label: '预估总面积(M2)',
        component: 'InputNumber',
        componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
      },
      {
        field: 'pdManagerId',
        i18nField: 'pdManagerName',
        label: 'PD经理',
        required: true,
        component: 'CustomUserSelect',
        componentProps: { placeholder: '请选择', showSearch: true },
      },
      {
        field: 'technologyId',
        i18nField: 'technologyName',
        label: '技术中心负责人',
        required: true,
        component: 'CustomUserSelect',
        componentProps: { placeholder: '请选择', showSearch: true },
      },
      {
        field: 'purchaseUserId',
        i18nField: 'purchaseUserName',
        label: '开发采购',
        component: 'CustomUserSelect',
        required: true,
        componentProps: { placeholder: '请选择', showSearch: true },
      },
      {
        field: 'isCustomerRefers',
        i18nField: 'isCustomerRefersDesc',
        label: '是否客指',
        defaultValue: 0,
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
          options: IS_OPTION_LIST,
        },
        required: true,
      },
      {
        field: 'remarks',
        label: '备注',
        component: 'Input',
        componentProps: {
          placeholder: '请输入',
        },
        colProps: {
          span: 12,
        },
      },
    ],
  };
}

const baseStore = useBaseStore();

export const materialSchema = (handleValidate?: Function): FormSchema[] => {
  return [
    {
      field: 'developmentReason',
      label: '开发原因',
      component: 'Input',
      componentProps: {},
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'developmentType',
      label: '开发类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('DevelopmentTypeEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      required: true,
    },
    {
      field: 'materialAreaId',
      i18nField: 'materialAreaName',
      label: '材料归属',
      component: 'ApiSelect',
      componentProps: {
        api: getMaterialList,
        apiSearch: {
          show: false,
        },
        params: {
          isSelectRoot: 'true',
          displayArea: 'MaterialWarehouse',
        },
        resultField: 'data.list',
        labelField: 'fullName',
        valueField: 'id',
        showSearch: false,
        immediate: true,
        filterOption: false,
      },
      required: true,
    },
    {
      field: 'materialClassId',
      i18nField: 'materialClassName',
      label: '材料类型',
      component: 'ApiSelect',
      componentProps: {
        // fieldNames: {
        //   value: 'id',
        //   label: 'fullName',
        // },
        labelField: 'label',
        valueField: 'value',
        defaultLabel: '',
        options: [],
      },
      required: true,
    },
    {
      field: 'alternativeMaterialNumber',
      label: '被替/备选料号',
      component: 'ApiSelect',
      componentProps: {
        api: getMetarialCode,
        resultField: 'data',
        fieldNames: {
          value: 'MaterialCode',
          label: 'MaterialCode',
        },
        showSearch: true,
        filterOption: false,
        apiSearch: {
          show: true,
          searchName: 'materialCode',
        },
        immediate: true,
      },
    },
    {
      field: 'purposeType',
      label: '用途',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('PurposeTypeEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      required: true,
    },
    {
      field: 'applicationScenarios',
      label: '应用场景',
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'materialThickness',
      label: '基材厚度',
      component: 'InputNumber',
      componentProps: { min: 0 },
      rules: [
        {
          trigger: 'blur',
          message: t('common.totalThickTip'),
          validator: (ops, value, r) => handleValidate && handleValidate(ops, value, r),
        },
      ],
    },
    {
      field: 'materialThicknessTotal',
      label: '总厚度(MM)',
      component: 'InputNumber',
      componentProps: { min: 0 },
      rules: [
        {
          trigger: 'blur',
          message: t('common.totalThickTip'),
          validator: (ops, value, r) => handleValidate && handleValidate(ops, value, r),
        },
      ],
    },
    {
      field: 'colour',
      label: '颜色',
      component: 'Input',
      required: true,
      componentProps: {},
    },
    {
      field: 'materialQualityId',
      i18nField: 'materialQualityName',
      label: '基材类型',
      component: 'ApiSelect',
      componentProps: {
        // fieldNames: {
        //   value: 'id',
        //   label: 'fullName',
        // },
        labelField: 'label',
        valueField: 'value',
        defaultLabel: '',
        options: [],
      },
    },
    {
      field: 'singleDoubleLayer',
      label: '结构组成',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('SingleDoubleLayerEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      required: true,
    },
    {
      field: 'coatingType',
      label: '涂层类型',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('CoatingTypeEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      required: true,
    },
    {
      field: 'gram',
      label: '克重(G)',
      component: 'Input',
      required: true,
    },
    {
      field: 'resistStaticElectricityType',
      label: '抗静电功能',
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          return await baseStore.getDictionaryData('ResistStaticElectricityEnum');
        },
        apiSearch: {
          show: false,
        },
        resultField: '',
        labelField: 'fullName',
        valueField: 'enCode',
        showSearch: false,
        immediate: true,
        filterOption: false,
        notFoundContent: null,
      },
      required: true,
    },
    {
      field: 'resistStaticElectricity',
      label: '抗静电值',
      component: 'Input',
      componentProps: {
        min: 1,
      },
    },
    {
      field: 'beingPostedMaterial',
      label: '被贴物/材料',
      component: 'Input',
    },
    {
      field: 'residualAdhesionRate',
      label: '残粘要求',
      component: 'Input',
      componentProps: { placeholder: '残粘要求' },
    },
    {
      field: 'realMatchRange',
      label: '实配要求',
      component: 'Input',
      componentProps: { placeholder: '例如：实配胶带、温度、时间' },
      colProps: {
        span: 8,
      },
    },
    {
      field: 'realMatchTest',
      label: '实配测试方法',
      component: 'Input',
      componentProps: {},
      colProps: {
        span: 8,
      },
    },
    {
      field: 'isQualityTesting',
      i18nField: 'isQualityTestingDesc',
      label: '是否质检',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: IS_OPTION_LIST,
        disabled: true,
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'isMaterialVerification',
      i18nField: 'isMaterialVerificationDesc',
      label: '是否材料验证',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: IS_OPTION_LIST,
        disabled: true,
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'otherRequirements',
      label: '其他要求',
      component: 'Textarea',
      componentProps: {
        rows: 1,
        autoSize: true,
      },
      colProps: {
        span: 8,
      },
    },
    {
      field: 'materialDesc',
      label: '材料描述',
      component: 'Textarea',
      componentProps: {
        rows: 1,
        // disabled: true,
        autoSize: true,
        placeholder: '点击按钮生成，支持修改',
      },
      colProps: {
        span: 12,
      },
    },
  ];
};

export const refersMaterialSchema: FormSchema[] = [
  {
    field: 'materialModelNumber',
    label: '原厂商型号',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 8,
    },
  },
  {
    field: 'otherRequirements',
    label: '其他要求',
    component: 'Input',
    componentProps: {},
    colProps: {
      span: 16,
    },
  },
];

// export const searchFormSchema = ;
export function getSearchFormSchema() {
  return [
    {
      fieldName: 'applyNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '需求单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'applyUserId',
      i18nField: 'CommonCol.applyUser',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
        defaultValue: userStore.userInfo?.userId,
        allowClear: true,
      },
    },
    {
      fieldName: 'currentProcessorId',
      i18nField: 'CommonCol.currentNodeUser',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
    {
      fieldName: 'factoryId',
      i18nField: 'CommonCol.factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
        api: getFactoryList,
        resultField: 'data',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        valueField: 'Id',
        immediate: false,
        filterOption: false,
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: getStatus(),
        allowClear: true,
      },
    },
  ];
}
