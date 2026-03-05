import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getKeywordlist, getProcesslist } from '/@/api/purchase/outsourcemanage';
import { get } from 'lodash-es';

const { t } = useI18n();
const baseStore = useBaseStore();

export const MODULE_TEMPLATE = {
  orderNo: null,
  moldNo: null,
  urgentLevel: null,
  moldType: null,
  estimateLifespan: null,
  insidePartNumber: null,
  moldRemark: null,
  insideProjectCode: null,
  immediateCustomerCode: null,
  factory: null,
  moldPurchaseId: null,
  moldUse: null,
  costAttribution: null,
  productType: null,
  mainMaterialThickness: null,
  projectPhase: null,
  quantity: null,
  salespersonId: null,
  requireDeliveryTime: null,
};

export function getAddColumns() {
  return [
    {
      title: '工单号',
      field: 'workOrderNo',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getKeywordlist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          valueField: 'workOrderNo',
          labelField: 'workOrderNo',
          immediate: true,
          placeholder: '工单号',
          onChange: (workOrderNo, data, { row }) => {
            getKeywordlist({
              keyword: workOrderNo,
            }).then(({ code, data }) => {
              if (code == 200) {
                const mouldNo = get(data, '0.mouldNo') || get(data, '0.productCode');
                row.mouldNo = mouldNo;
              }
            });
          },
        },
      },
    },
    {
      title: '模具编号',
      field: 'mouldNo',
      editRender: {
        placeholder: '自动带入',
        disabled: true,
      },
    },
    {
      title: '委外工序',
      field: 'process',
      i18nField: 'processName',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getProcesslist,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          valueField: 'code',
          labelField: 'name',
          immediate: true,
          placeholder: '委外工序',
        },
      },
    },
    {
      title: '委外数量',
      field: 'outsourceQuantity',
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '委外数量',
          min: 1,
        },
      },
    },
    {
      title: '要求交期',
      field: 'demandDeliveryTime',
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
          placeholder: '选择日期',
        },
      },
    },
    {
      field: 'supplier',
      title: '供应商',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '供应商',
        },
      },
    },
    {
      field: 'remark',
      title: '备注',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '备注',
        },
      },
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
}

export const ADD_COLUMNS: any[] = [
  {
    title: '工单号',
    dataIndex: 'workOrderNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'ApiSelect',
    cpmSetting: {
      api: getKeywordlist,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'keyword',
      },
      resultField: 'data',
      valueField: 'workOrderNo',
      labelField: 'workOrderNo',
      immediate: true,
      placeholder: '工单号',
    },
  },
  {
    title: '模具编号',
    dataIndex: 'mouldNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: { placeholder: '自动带入', disabled: true },
  },
  {
    title: '委外工序',
    dataIndex: 'process',
    i18nField: 'processName',
    isEdit: true,
    inputType: '',
    cpmType: 'ApiSelect',
    cpmSetting: {
      placeholder: '委外工序',
      showSearch: false,
      resultField: 'data',
      valueField: 'code',
      labelField: 'name',
      filterOption: false,
      immediate: false,
      disabled: false,
    },
  },
  {
    title: '委外数量',
    dataIndex: 'outsourceQuantity',
    isEdit: true,
    inputType: 'number',
    cpmType: 'Input',
    cpmSetting: { placeholder: '委外数量', min: 1 },
  },
  {
    title: '要求交期',
    dataIndex: 'demandDeliveryTime',
    isEdit: true,
    inputType: '',
    format: 'date|YYYY-MM-DD',
    cpmType: 'DatePicker',
    cpmSetting: {
      format: 'YYYY-MM-DD',
      placeholder: '选择日期',
    },
  },
  {
    title: '供应商',
    dataIndex: 'supplier',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '供应商',
      // showSearch: false,
      // resultField: 'data',
      // valueField: 'name',
      // labelField: 'name',
      // filterOption: false,
      // immediate: false,
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '备注',
    },
  },
];

export const singleColumns = [
  {
    // 工序
    title: t('dict.CommonCol.process'),
    field: 'processName',
  },
  {
    title: 'SN',
    field: 'snCode',
  },
  {
    // 操作
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const individualColumns = [
  {
    // 工单号
    title: '工单号',
    field: 'workOrderNo',
  },
  {
    // 模具编号
    title: '模具编号',
    field: 'mouldNo',
  },
  {
    // 工序
    title: '委外工序',
    field: 'processName',
  },
  {
    // 委外数量
    title: '委外数量',
    field: 'outsourceQuantity',
  },
  {
    // 操作
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];
