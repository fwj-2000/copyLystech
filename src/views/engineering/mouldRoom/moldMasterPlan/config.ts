import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

import { getIssuedlist } from '/@/api/engineering/mould';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

const column = [
  {
    title: '模具编号',
    field: 'moldNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '项目名称',
    field: 'projectName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '制作状态',
    field: 'planStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'planStatus',
      props: {
        api: () => baseStore.getDictionaryData('planMakeStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.planMakeStatus.0'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.planMakeStatus.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'CommonCol.productionStatus',
  },
  {
    title: '产品名称',
    field: 'productName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '版本',
    field: 'version',
    width: 120,
  },
  {
    title: 'PD负责人',
    field: 'pdUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 220,
  },
  {
    title: 'T0交期',
    field: 't0DeliveryDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },

  {
    title: 'DFM附件',
    field: 'dfmAttaFile',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
    slots: { default: 'DfmAttaFile' },
    i18nField: 'CommonCol.DFMFile',
  },
  {
    title: '模流分析附件',
    field: 'mfaFile',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
    slots: { default: 'MfaFile' },
    i18nField: 'CommonCol.modelFlowAttachment',
  },
  {
    title: '客户图纸',
    field: 'customerFile',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
    slots: { default: 'CustomerFile' },
    i18nField: 'CommonCol.customerDraw',
  },
  {
    title: '厂区',
    field: 'factoryAreaName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '申请人',
    field: 'creatorUserName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '申请时间',
    field: 'creatorTime',
    filters: [{ data: '' }],
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 150,
  },
  {
    title: '备注',
    field: 'remark',
    filters: [{ data: '' }],
    width: 180,
  },
];

export function getColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  if (hasBtnP('btn_detail')) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    columnData.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export function getFormColumn() {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具编号',
      },
    },
    {
      fieldName: 'productName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品名称',
      },
    },
    {
      fieldName: 'projectName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
    {
      fieldName: 'pdUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'PD负责人',
      },
      i18nField: 'pdUserName',
    },
  ];
}

export const basicFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getIssuedlist,
      resultField: 'data',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'moldNo',
      },
      valueField: 'moldNo',
      labelField: 'moldNo',
      filterOption: false,
      immediate: false,
    },
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: {
      placeholder: t('请输入'),
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'cavityNumber',
    label: '模穴数',
    component: 'Input',
    componentProps: {
      placeholder: t('请输入'),
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'moldSupplier',
    label: '模具供应商',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'moldBaseMaterials',
    label: '模架材料',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
  },
];
