import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();
const { t } = useI18n();
export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'gray', rowKey: 'statusDesc' },
];
export const formSchemas = [
  {
    field: 'electrodeName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '电极名称',
      submitOnPressEnter: true,
    },
  },
  {
    field: 'electrodeMaterial',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '材质',
      submitOnPressEnter: true,
    },
  },
  {
    field: 'cuttingSize',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '下料尺寸',
      submitOnPressEnter: true,
    },
  },
];

export const column = [
  // { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '电极名称',
    sortable: true,
    field: 'electrodeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '下料尺寸',
    field: 'cuttingSize',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '净尺寸',
    field: 'netSize',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '材质',
    field: 'electrodeMaterial',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '总数量',
    field: 'totalQuantity',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '精',
    field: 'fine',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '中',
    field: 'medium',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '粗',
    field: 'rough',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '是否启用',
    field: 'enabledStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
  },
  {
    title: '备注',
    field: 'remark',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'CommonCol.creatorUserName',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 160,
    i18nField: 'CommonCol.creatorTime',
  },
];

export function getColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  if (hasBtnP('btn_detail')) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    columnData.push({
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export const importColumns = [
  {
    title: '行号',
    dataIndex: 'number',
    width: 120,
    i18nField: 'CommonCol.lineNumber',
  },
  {
    title: '电极名称',
    dataIndex: 'electrodeName',
    width: 120,
  },
  {
    title: '下料尺寸',
    dataIndex: 'cuttingSize',
    width: 120,
  },
  {
    title: '净尺寸',
    dataIndex: 'netSize',
    width: 120,
  },
  {
    title: '材质',
    dataIndex: 'electrodeMaterial',
    width: 120,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 120,
  },
  {
    title: '精',
    dataIndex: 'fine',
    width: 120,
  },
  {
    title: '中',
    dataIndex: 'medium',
    width: 120,
  },
  {
    title: '粗',
    dataIndex: 'rough',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
];

export const ElectrodeInfoColumn: any[] = [
  {
    title: '电极名称',
    field: 'electrodeName',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '下料尺寸',
    field: 'cuttingSize',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '净尺寸',
    field: 'netSize',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '数量',
    field: 'quantity',
    minWidth: 120,
    editRender: {
      name: 'InputNumber',
    },
  },
  {
    title: '精',
    field: 'fine',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '中',
    field: 'medium',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '粗',
    field: 'rough',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '重量(kg)',
    field: 'weight',
    minWidth: 120,
    editRender: {
      name: 'InputNumber',
    },
  },
  {
    title: '是否启用',
    field: 'enabledStatus',
    minWidth: 120,
    editRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('enableStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        onChange(_: any, option: any, { row }) {
          row.enabledStatus = option?.label || '';
        },
      },
    },
    i18nField: 'CommonCol.isEnable',
  },
  {
    title: '备注',
    field: 'remark',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const ELECTRODE_TABLE_ROW_DATA = {
  electrodeName: '',
  cuttingSize: '',
  netSize: '',
  quantity: '',
  fine: '',
  medium: '',
  rough: '',
  weight: '',
  remark: '',
};

export const detailFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
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
    field: 'partNo',
    label: '零件编号',
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
    field: 'electrodeMaterial',
    label: '电极材质',
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
    field: 'electrodeDesigner',
    label: '电极设计',
    component: 'Input',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'totalWeight',
    label: '总重量(kg)',
    component: 'InputNumber',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'totalQuantity',
    label: '总数量',
    component: 'InputNumber',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
];
