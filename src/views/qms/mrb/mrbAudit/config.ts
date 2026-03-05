import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { formatDictOptions } from '/@/utils/dictFormat';

const { t } = useI18n();
const baseStore = useBaseStore();

export const mrbApplyStatusOptions = await formatDictOptions({
  dictKey: 'mrbApplyStatus',
  themeMap: {
    0: 'gray',
    1: 'blue',
    2: 'yellow',
    3: 'green',
    4: 'red',
  },
});

export const closeStatusOptions = await formatDictOptions({
  dictKey: 'closeStatus',
  themeMap: {
    0: 'gray',
    1: 'green',
    2: 'red',
  },
});

export const executionResultOptions = await formatDictOptions({
  dictKey: 'executionResult',
  themeMap: {
    0: 'green',
    1: 'blue',
    2: 'yellow',
    3: 'red',
    4: 'purple',
    5: 'red',
    6: 'gray',
    7: 'red',
  },
});

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.PartNumberApplyStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
];

const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: 'MRB申请单号',
    field: 'mrbApplyNo', // 对应接口中的 mrbApplyNo
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    minWidth: 160,
    sortable: true,
  },
  {
    title: '关联单号',
    field: 'relationNo', // 对应接口中的 relationNo
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '状态',
    field: 'status', // 对应接口中的 status
    cellRender: {
      name: 'Tag',
      options: mrbApplyStatusOptions,
    },
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'ASelect',
      props: {
        options: mrbApplyStatusOptions,
      },
    },
    width: 120,
    sortable: true,
  },
  {
    title: 'LOT NO.',
    field: 'lotNo', // 对应接口中的 lotNo
    minWidth: 220,
    sortable: true,
  },
  {
    title: '产品料号',
    field: 'insidePartNumber', // 对应接口中的 insidePartNumber
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '数量',
    field: 'quantity', // 对应接口中的 quantity
    minWidth: 120,
    sortable: true,

    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '计量单位',
    field: 'unit', // 对应接口中的 unit
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '不良品类型',
    field: 'badProductTypeName', // 对应接口中的 badProductType
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '不良数量',
    field: 'badQuantity', // 对应接口中的 badQuantity
    minWidth: 160,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '抽检数',
    field: 'checkQuantity', // 对应接口中的 checkQuantity
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '样品不良率(%)',
    field: 'sampleBadRate', // 对应接口中的 sampleBadRate
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '问题描述',
    field: 'remark', // 对应接口中的 remark
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  // {
  //   title: '执行情况结果',
  //   field: 'executionResult', // 对应接口中的 executionResult
  //   minWidth: 220,
  // },
  {
    title: '执行情况结果',
    field: 'executionResult', // 对应接口中的 status
    i18nField: 'executionResultName',
    cellRender: {
      name: 'Tag',
      options: executionResultOptions,
    },
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'ASelect',
      props: {
        options: executionResultOptions,
      },
    },
    width: 180,
    sortable: true,
  },
  {
    title: '执行情况说明',
    field: 'executionNote', // 对应接口中的 executionNote
    minWidth: 220,
  },
  {
    title: '关闭状态',
    field: 'closeStatus', // 对应接口中的 status
    i18nField: 'closeStatusName',
    cellRender: {
      name: 'Tag',
      options: closeStatusOptions,
    },
    filters: [
      {
        data: '',
      },
    ],
    filterRender: {
      name: 'ASelect',
      props: {
        options: closeStatusOptions,
      },
    },
    width: 120,
    sortable: true,
  },
  {
    title: '关闭人',
    field: 'closeUserName', // 对应接口中的 closeUserId
    minWidth: 220,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '关闭备注',
    field: 'closeRemark',
    minWidth: 220,
  },
  {
    title: '申请人',
    field: 'creatorUserName', // 对应接口中的 applyUserId
    minWidth: 220,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '创建时间',
    field: 'creatorTime', // 对应接口中的 applyTime
    minWidth: 220,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss', // 日期格式
    },
  },
  {
    title: '备注',
    field: 'remark', // 对应接口中的 remark
    minWidth: 220,
  },
  {
    title: t('common.action'),
    width: 100,
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'badProductType', // 不良品类型
      label: '',
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
    },
    {
      fieldName: 'mrbApplyNo', // MRB申请单号
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入MRB申请单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumber', // 产品料号
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入产品料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorUserName',
      label: '',
      // label: 'Lot No.',
      component: 'Input',
      componentProps: {
        placeholder: '请输入申请人.',
        allowClear: true,
      },
      immediate: true,
    },
    {
      fieldName: 'status', // 状态
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择状态',
        api: () => baseStore.getDictionaryData('mrbApplyStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
    },
    {
      fieldName: 'startTime', // 创建时间
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        allowClear: true,
      },
    },
    {
      fieldName: 'endTime', // 结束时间
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        allowClear: true,
      },
    },
  ];
}

// 主页表格column配置
export function getColumn() {
  return columns;
}
