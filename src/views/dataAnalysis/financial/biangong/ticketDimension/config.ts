import dayjs from 'dayjs';
import { h } from 'vue';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { allColumnsOptions, commonBatchMenuItems, templateDownloadFile } from '../config';
import { commonDateTimeOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { isBainOptions } from '/@/views/dataAnalysis/financial/config';
import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';

import { BaseVxeTableTypes, EFilterSlot } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import { ETimeDimension } from '../types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';

export const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
  { text: '季度', value: ETimeDimension.QUARTER },
  { text: '年', value: ETimeDimension.YEAR },
];

// 批量导入导出菜单
export const batchMenuItems: MenuItemType[] = [
  // 原因分析
  {
    label: '原因分析',
    key: 'analysis',
    children: [
      {
        label: '模版下载',
        key: 'analysisDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '原因分析导入模板',
            },
          });
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/dimension/importanalysis',
          buttonText: '导入',
        }),
        key: 'analysisImport',
      },
    ],
  },
  ...commonBatchMenuItems,
  // end
];

// SAP状态更新
export const sapOptions = [
  {
    label: '反接收',
    value: '1',
  },
  {
    label: '已接收',
    value: '2',
  },
  {
    label: '已结算',
    value: '3',
  },
  {
    label: '反结算',
    value: '4',
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'Year',
      title: '年份',
    },
    {
      field: 'EntdateQ',
      title: '季度',
    },
    {
      field: 'BuName',
      title: 'bu',
    },
    {
      field: 'EntdateMo',
      title: '核算月份',
    },
    {
      field: 'EntdateWk',
      title: '周期',
    },
    {
      field: 'Budat',
      title: '工单技术关闭日期',
    },
    {
      field: 'Idat2a',
      title: '下达日期',
    },
    {
      field: 'Factory',
      title: '厂区',
    },
    {
      field: 'WorkShop',
      title: '车间',
      // slots: {
      //   filter: EFilterSlot.MULTI_SEARCH_SELECT_REMOTE,
      // },
      // params: {
      //   getFilters: () => {
      //     return [
      //       {
      //         text: '直供三',
      //         value: '直供三',
      //       },
      //     ];
      //   },
      //   getDefaultFilterValues: () => {
      //     return '';
      //   },
      // },
    },
    {
      field: 'Auart',
    },
    {
      field: 'AuartDm',
    },
    {
      field: 'Aufnr',
      title: '订单号',
    },
    {
      field: 'Matnr',
      title: '成品编码',
    },
    {
      field: 'Zj10m',
      title: '十码',
    },
    {
      field: 'Zj6m',
      title: '中间6码',
    },
    {
      field: 'Znbxm',
      title: '内部项目',
    },
    {
      field: 'Xxm',
      title: '小项目',
    },
    {
      field: 'Zzdkh',
      title: '客户划分类型',
    },
    {
      field: 'Zcplb',
      title: '产品类别',
    },
    {
      field: 'Bom',
      title: '是否有BOM',
    },
    {
      field: 'Gamng',
      title: '订单数量',
    },
    {
      field: 'Wemnga',
      title: '良品入库数量',
    },
    {
      field: 'Shsse0',
      title: '标准材料损失',
    },
    {
      field: 'ShsseH',
      title: '实际材料损失',
    },
    {
      field: 'Zclcs',
      title: '材料超损',
    },
    {
      field: 'Rgsse',
      title: '人工损失',
    },
    {
      field: 'Bzbgl',
      title: '标准边贡率',
    },
    {
      field: 'Sjbgl',
      title: '实际边贡率',
    },
    {
      field: 'Zbglcy',
      title: '边贡率差异',
    },
    {
      field: 'Bgdcl',
      title: '边贡达成率',
    },
    {
      field: 'Bzshl',
      title: '标准损耗率',
    },
    {
      field: 'Sjshl',
      title: '实际损耗率',
    },
    {
      field: 'Zshlcy',
      title: '损耗率差异',
    },
    {
      field: 'YieldRate',
      title: '入库良率',
    },
    {
      field: 'Yield',
      title: '3.8手工良率',
    },
    {
      field: 'Bzfqxlkh',
      title: '标准分切效率(K/H)',
    },
    {
      field: 'Bzmqxlkh',
      title: '标准模切效率(K/H)',
    },
    {
      field: 'Bzsgxlkh',
      title: '标准手工效率(K/H)',
    },
    {
      field: 'Bzbzxlkh',
      title: '标准包装效率(K/H)',
    },
    {
      field: 'Sjfqxlkh',
      title: '实际分切效率(K/H)',
    },
    {
      field: 'Sjmqxlkh',
      title: '实际模切效率(K/H)',
    },
    {
      field: 'Mqxldc',
      title: '模切效率达成',
    },
    {
      field: 'Sjsgxlkh',
      title: '实际手工效率(K/H)',
    },
    {
      field: 'Sgxldc',
      title: '手工效率达成',
    },
    {
      field: 'Sjbzxlkh',
    },
    {
      field: 'Zzrgcs',
      title: '工程师',
    },
    {
      field: 'Zxlxm',
      title: '新老项目',
    },
    {
      field: 'Verid',
      title: '生产版本',
    },
    {
      field: 'Stlal',
    },
    {
      field: 'Zrr',
      title: '车间责任人',
    },
    {
      field: 'Abtei',
      title: '业务范围',
    },
    {
      field: 'Werks',
      title: '工厂',
    },
    {
      field: 'Dispo',
      title: 'MRP控制者',
    },
    {
      field: 'Isbian',
      title: '是否纳入边贡指标',
    },
    {
      field: 'Bzfqgs',
      title: '标准分切工时',
    },
    {
      field: 'Bzmqgs',
      title: '标准模切工时',
    },
    {
      field: 'Bzsggs',
      title: '标准手工工时',
    },
    {
      field: 'Bzbzgs',
      title: '标准包装工时',
    },
    {
      field: 'Bzgshj',
      title: '标准工时合计',
    },
    {
      field: 'Sjfqgs',
      title: '实际分切工时',
    },
    {
      field: 'Sjmqgs',
      title: '实际模切工时',
    },
    {
      field: 'Sjsggs',
      title: '实际手工工时',
    },
    {
      field: 'Sjbzgs',
      title: '实际包装工时',
    },
    {
      field: 'Sjgshj',
      title: '实际工时合计',
    },
    {
      field: 'Cpx',
    },
    {
      ...commonDateTimeOption,
      field: 'DatasourceTime',
      title: '抽数时间',
    },
    {
      field: 'Provider',
    },
    {
      field: 'Analysis',
    },
    {
      field: 'Measures',
    },
  ];
  return columns.map(item => {
    return {
      ...(allColumnsOptions[item.field as string] ?? {}),
      ...item,
    };
  });
};

// 搜索表单配置
export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.WEEK,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '纳入边贡',
    default: '1',
    key: 'isBian',
    attrs: {
      allowClear: false,
    },
    options: isBainOptions,
  },
];
