import { FormProps, FormSchema } from '/@/components/Form';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getSupplierlist } from '/@/api/engineering/mould';
import { closeStatusOptions, executionResultOptions } from '../../config';
import { getFactoryAreaList } from '/@/api/productionPlan/planProduceQuantity';
import { DynamicProps } from '/#/utils';
import { getunitList } from '/@/api/common/constant';
import { badTypeOptions } from '/@/views/qms/iqc/iqcInputReview/config';
const { t } = useI18n();
const baseStore = useBaseStore();
// const badProductType = baseStore.getDictionaryData('badProductType');

export const BASICINFO_SCHEMAS: FormSchema[] = [
  // {
  //   field: 'flowId',
  //   label: '审批单模板',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getFlowTemplateList,
  //     placeholder: '请选择检测类型',
  //     showSearch: true,
  //     apiSearch: {
  //       show: true,
  //       searchName: 'name',
  //     },
  //     resultField: 'data',
  //     labelField: 'name',
  //     valueField: 'id',
  //     filterOption: false,
  //     defaultFirstOption: true,
  //     notFoundContent: null,
  //     immediate: true,
  //   },
  //   rules: [{ required: true, message: '', trigger: 'blur' }],
  //   colProps: {
  //     span: 6,
  //   },
  // },
  {
    field: 'badProductType', // 不良品类型
    i18nField: 'badProductTypeName',
    label: '不良品类型',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入不良品类型',
      allowClear: true,
      api: () => baseStore.getDictionaryData('badProductType'),
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'insidePartNumber',
    label: '产品料号',
    component: 'ApiSelect',
    slot: 'insidePartNumber',
    // componentProps: {
    //   api: getInnermaterialnumberlist,
    //   placeholder: '请选择产品料号',
    //   showSearch: true,
    //   apiSearch: {
    //     show: true,
    //     searchName: 'InnerMaterialNumber',
    //   },
    //   resultField: 'data',
    //   valueField: 'insidePartNumber',
    //   labelField: 'insidePartNumber',
    //   immediate: true,
    // },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'quantity',
    label: '数量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      disabled: false,
      placeholder: '请输入数量',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'unit',
    label: '计量单位',
    component: 'ApiSelect',
    componentProps: {
      api: getunitList,
      searchKey: 'InnerMaterialNumber',
      placeholder: '请选择',
      showSearch: false,
      resultField: 'data',
      valueField: 'Code',
      labelField: 'Name',
      filterOption: false,
      immediate: true,
      disabled: false,
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'poNo',
    label: 'PO单号',
    component: 'Input',
    componentProps: {
      disabled: false,
    },
    colProps: { span: 6 },
  },
  {
    field: 'factory',
    label: '料号厂区',
    i18nField: 'factoryName',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryAreaList,
      placeholder: '请选择厂区',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'searchKey',
      },
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      useChangeCopy: true,
      labelField: 'name',
      valueField: 'code',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'materialType',
    label: '材料类型',
    component: 'Input',
    // component: 'ApiSelect',
    // componentProps: {
    //   api: getInnermaterialnumberlist,
    //   placeholder: '请选择材料类型',
    //   showSearch: true,
    //   apiSearch: {
    //     show: true,
    //     searchName: 'InnerMaterialNumber',
    //   },
    //   resultField: 'data',
    //   valueField: 'insidePartNumber',
    //   labelField: 'insidePartNumber',
    //   immediate: true,
    // },
  },
  {
    field: 'badQuantity',
    label: '不良数量',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      disabled: false,
      placeholder: '请输入不良数量',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'supplierId',
    label: '供应商',
    i18nField: 'supplierName',
    component: 'ApiSelect',
    componentProps: {
      api: getSupplierlist,
      placeholder: '请选择供应商',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'searchKey',
      },
      resultField: 'data',
      valueField: 'id',
      labelField: 'name',
      immediate: true,
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    componentProps: {
      disabled: false,
    },
    colProps: { span: 6 },
  },
  {
    field: 'attachmentList',
    i18nField: 'CommonCol.reportName',
    label: '附件',
    component: 'Input',
    slot: 'file',
    // rules: [{ required: false, message: '', trigger: 'blur' }],
    colProps: { span: 24 },
  },
];

export const BASICINFO_FORMCONFIG: Partial<DynamicProps<FormProps>> = {
  labelWidth: 240,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  layout: 'vertical',
  // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
  schemas: BASICINFO_SCHEMAS,
  i18nConfig: {
    moduleCode: 'MrbApplyColumn',
    transferRange: ['placeholder', 'label'],
  },
};

export const MEMBER_SCHEMAS: FormSchema[] = [
  {
    field: 'sqeUserId',
    label: 'SQE',
    i18nField: 'sqeUserName',
    component: 'CustomUserSelect',
    componentProps: {
      showSearch: false,
      placeholder: 'SQE',
    },
  },
  {
    field: 'pdUserId',
    label: '工程',
    i18nField: 'pdUserName',
    component: 'CustomUserSelect',
    componentProps: {
      showSearch: false,
      placeholder: '工程',
    },
  },
  {
    field: 'purchaseUserId',
    label: '采购',
    i18nField: 'purchaseUserName',
    component: 'CustomUserSelect',
    componentProps: {
      showSearch: false,
      placeholder: '采购',
    },
  },
];

export const MEMBER_FORMCONFIG: Partial<DynamicProps<FormProps>> = {
  labelWidth: 80,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  layout: 'vertical',
  // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
  schemas: MEMBER_SCHEMAS,
  i18nConfig: {
    moduleCode: 'MrbApplyColumn',
    transferRange: ['placeholder', 'label'],
  },
};

/**
 * 处理状态筛选
 */
export const statusOptions = [
  { label: t('common.todoText'), value: 6 },
  { label: t('common.doneText'), value: 7 },
];

export const BADPRODUCTTYPE_COLUMNS: VxeGridPropTypes.Columns = [
  {
    title: '类型',
    field: 'badType',
    editRender: {
      enabled: true,
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: badTypeOptions,
      },
    },
  },
  {
    title: '不良率(%)',
    field: 'badRate',
    editRender: {
      name: 'InputNumber',
      props: {
        placeholder: '',
        precision: 1,
        step: 0.1,
        // addonAfter:'%'
        formatter: (value: number) => (value ? `${value}%` : 0),
        parser: (value: string) => value.replace('%', ''),
      },
    },
  },
  {
    title: '不良描述',
    field: 'badDescription',
    editRender: {
      name: 'Input',
    },
  },
  {
    title: t('common.action'),
    width: '180',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const BADPRODUCTTYPE_COLUMNS_RELUS = {
  badType: [{ required: true, message: t('common.inputText'), trigger: 'blur' }],
  badRate: [{ required: true, message: t('common.inputText'), trigger: 'blur' }],
  badDescription: [{ required: true, message: t('common.inputText'), trigger: 'blur' }],
};

export const ORDER_BADPRODUCTTYPE_COLUMNS: VxeGridPropTypes.Columns = [
  {
    title: '工单号',
    field: 'workOrderNo',
    editRender: {
      name: 'Input',
      props: {
        placeholder: '',
      },
    },
  },
  {
    title: '不良数量',
    field: 'badQuantity',
    editRender: {
      name: 'InputNumber',
      props: {
        placeholder: '',
      },
    },
  },

  {
    title: t('common.action'),
    width: '180',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const EXECUTIONEXPLANATION_SCHEMAS: FormSchema[] = [
  {
    field: 'closeUserId',
    i18nField: 'closeUserName',
    component: 'CustomUserSelect',
    label: '关闭人',
    componentProps: {
      onChange: e => {
        console.log(666, e);
      },
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
  {
    field: 'executionResult',
    i18nField: 'executionResultName',
    component: 'Radio',
    label: '执行情况结果',
    componentProps: {
      options: executionResultOptions,
    },
    rules: [{ required: true, message: '', trigger: 'change' }],
  },
  {
    field: 'executionNote',
    component: 'Textarea',
    label: '执行情况说明',
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
];

export const EXECUTIONREVIEW_SCHEMAS: FormSchema[] = [
  {
    field: 'closeStatus',
    i18nField: 'closeStatusName',
    component: 'Radio',
    label: '关闭状态',
    componentProps: {
      options: closeStatusOptions,
    },
    rules: [{ required: true, message: '', trigger: 'change' }],
  },
  {
    field: 'closeRemark',
    component: 'Textarea',
    label: '审核说明',
    rules: [{ required: true, message: '', trigger: 'blur' }],
  },
];

export const MRBREVIEW_SCHEMAS: FormSchema[] = [
  {
    field: 'executionResult',
    i18nField: 'executionResultName',
    component: 'Radio',
    label: '审核情况结果',
    componentProps: {
      options: executionResultOptions,
    },
    rules: [{ required: true, message: '', trigger: 'change' }],
  },
  {
    field: 'remark',
    component: 'Textarea',
    label: '备注',
  },
];
