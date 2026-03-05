import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/factory';
import dayjs from 'dayjs';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: any = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: '推送状态',
    field: 'isPushMds',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: [
        { id: 3, fullName: t('dict.isPushed.3'), theme: 'green' },
        { id: 2, fullName: t('dict.isPushed.2'), theme: 'red' },
        { id: 1, fullName: t('dict.isPushed.1'), theme: 'gray' },
      ],
    },
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    showOverflow: 'tooltip',
    minWidth: 100,
  },
  // 批次号
  {
    title: '批次号',
    field: 'batchNumber',
    showOverflow: 'tooltip',
    minWidth: '100',
  },
  // 内部料号
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    showOverflow: 'tooltip',
    minWidth: 180,
  },
  // 年份
  {
    title: '年份',
    field: 'currentYear',
    showOverflow: 'tooltip',
    minWidth: 60,
  },
  // 周数
  {
    title: '周数',
    field: 'currentWeek',
    showOverflow: 'tooltip',
    minWidth: 50,
  },
  // 客户代码
  {
    title: '客户代码',
    field: 'customerCode',
    showOverflow: 'tooltip',
    minWidth: 100,
  },
  // 工厂
  {
    title: 'SAP工厂',
    field: 'factory',
    showOverflow: 'tooltip',
    minWidth: '100',
  },
  // 客服
  {
    title: '客服',
    field: 'customerPerson',
    showOverflow: 'tooltip',
    minWidth: '120',
  },
  // 内部项目
  {
    title: '内部项目',
    field: 'project',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 项目阶段
  {
    title: '项目阶段',
    field: 'projectPhase',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 中间料号
  {
    title: '中间料号',
    field: 'middleMaterialCode',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 用量
  {
    title: '用量',
    field: 'useQuantity',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 交易币种
  {
    title: '交易币种',
    field: 'tradeCurrency',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 产品类别
  {
    title: '产品类别',
    field: 'productCategory',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 备料建议(FYI)
  {
    title: '备料建议(FYI)',
    field: 'materialPrinciple',
    showOverflow: 'tooltip',
    minWidth: 120,
  },
  // VMI/JIT
  {
    title: 'VMI/JIT',
    field: 'vmiOrJit',
    showOverflow: 'tooltip',
    minWidth: 80,
  },
  // 上周需求
  {
    title: '上周需求',
    field: 'lastWeekQd',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Number',
    },
  },
  // 上周欠数
  {
    title: '上周欠数',
    field: 'lastWeeQo',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Number',
    },
  },
  // 本周较上周F/C变化%.
  {
    title: '本周较上周F/C变化%',
    field: 'changeRatio',
    showOverflow: 'tooltip',
    minWidth: '100',
    cellRender: {
      name: 'Number',
    },
  },
  // 客户库存(FYI).
  {
    title: '客户库存(FYI)',
    field: 'cmi',
    showOverflow: 'tooltip',
    minWidth: '100',
    cellRender: {
      name: 'Number',
    },
  },
  // 客户库存可使用周数.
  {
    title: '客户库存可使用周数',
    field: 'cmiUseWeek',
    showOverflow: 'tooltip',
    minWidth: '100',
    cellRender: {
      name: 'Number',
    },
  },
  // 备成品库存.
  {
    title: '备成品库存',
    field: 'finishedPi',
    showOverflow: 'tooltip',
    minWidth: 90,
    cellRender: {
      name: 'Number',
    },
  },
  // 当周
  {
    title: t('dict.FcMiddleDataColumn.currentQuantity'),
    field: 'currentQuantity',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Number',
    },
  },
  // 当周修正
  {
    title: t('dict.FcMiddleDataColumn.currentUpQuantity'),
    field: 'currentUpQuantity',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Number',
    },
  },
  // 四周
  {
    title: t('dict.FcMiddleDataColumn.fourWeekQuantity'),
    field: 'fourWeekQuantity',
    showOverflow: 'tooltip',
    minWidth: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: 'FC备注',
    field: 'fcRemark',
    width: 80,
  },
];

/**
 * 列表 - 查询表单
 */
export const schema = [
  //周数
  {
    field: 'searchDate',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      valueFormat: 'YYYY-ww',
    },
  },
  // 工厂
  {
    field: 'factoryArea',
    i18nField: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      placeholder: '工厂',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    colProps: { span: 3 },
  },
  // 内部料号
  {
    field: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.FcMiddleDataColumn.innerMaterialCode'),
      allowClear: true,
    },
  },
];

export const schemaForm = [
  //周数
  {
    fieldName: 'searchDate',
    label: '',
    component: 'WeekPicker',
    componentProps: {
      placeholder: t('dict.FcDataColumn.searchDate'),
      // valueFormat: 'YYYY-ww',
    },
    defaultValue: dayjs(new Date()),
  },
  // 工厂
  {
    fieldName: 'factoryArea',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getFactoryList,
      placeholder: '工厂',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      nameFormat: ['Code', '/', 'Name'],
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
    },
    colProps: { span: 3 },
  },
  // 内部料号
  {
    fieldName: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.FcMiddleDataColumn.innerMaterialCode'),
      allowClear: true,
    },
  },
];
