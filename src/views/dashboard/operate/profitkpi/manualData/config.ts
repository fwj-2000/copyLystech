import dayjs from 'dayjs';

import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { VxeGridPropTypes } from 'vxe-table';

export const getCommonReqParams = (searchFromValue: Record<string, any>) => {
  const { dateRange } = searchFromValue;
  const [startDate, endDate] = dateRange;
  return {
    startTime: `${startDate.format('YYYY')}WK${startDate.week()}`,
    endTime: `${endDate.format('YYYY')}WK${endDate.week()}`,
  };
};

export const allOptions: TFormItemOption[] = [
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: 'week',
    },
  },
];

// 通用字段配置
export const commonOption = {
  minWidth: 100,
  headerAlign: 'center' as any,
};
// 获取表头配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    {
      field: 'Gsber',
      title: '业务范围',
      ...commonOption,
    },
    {
      field: 'Weeks',
      title: '周期',
      ...commonOption,
    },
    {
      field: 'Wgcz',
      title: '外购产值',
      ...commonOption,
    },
    {
      field: 'Zdcz',
      title: '终端产值',
      ...commonOption,
    },
    {
      field: 'CpbfCz',
      title: '成品报废—产值',
      ...commonOption,
    },
    {
      field: 'Zsbh',
      title: '销售补货发出',
      ...commonOption,
    },
    {
      field: 'XshhTh',
      title: '销售换货发出/退回',
      ...commonOption,
    },
    {
      field: 'FgbfCz',
      title: '返工报废—产值',
      ...commonOption,
    },
    {
      field: 'Mfdd',
      title: '免费订单',
      ...commonOption,
    },
    {
      field: 'Kk',
      title: '扣款',
      ...commonOption,
    },
    {
      field: 'Zjcl',
      title: '直接材料',
      ...commonOption,
    },
    {
      field: 'Zjrg',
      title: '直接人工',
      ...commonOption,
    },
    {
      field: 'Wwjgf',
      title: '委外加工费',
      ...commonOption,
    },
    {
      field: 'MjfYsh',
      title: '模具费（已收货）代码',
      ...commonOption,
    },
    {
      field: 'Jwl',
      title: '机物料',
      ...commonOption,
    },
    {
      field: 'Sddlf',
      title: '水电动力费',
      ...commonOption,
    },
    {
      field: 'Kcclbf',
      title: '库存材料报废（原材/半成品报废——成本）',
      ...commonOption,
    },
    {
      field: 'Zzll',
      title: '部门领料-制造领料',
      ...commonOption,
    },
    {
      field: 'Dzyhp',
      title: '低值易耗品',
      ...commonOption,
    },
    {
      field: 'Qtzfl',
      title: '其他-制费类',
      ...commonOption,
    },
    {
      field: 'Jjrg',
      title: '间接人工',
      ...commonOption,
    },
    {
      field: 'Zktx',
      title: '折旧和摊销',
      ...commonOption,
    },
    {
      field: 'Qtgdzf',
      title: '其他固定制费',
      ...commonOption,
    },
    {
      field: 'Xsll',
      title: '销售样品',
      ...commonOption,
    },
    {
      field: 'Qtxsfy',
      title: '其他销售费用',
      ...commonOption,
    },
    {
      field: 'Yfll',
      title: '研发领料',
      ...commonOption,
    },
    {
      field: 'Qtyffy',
      title: '其他研发费用',
      ...commonOption,
    },
    {
      field: 'Glfy',
      title: '管理费用',
      ...commonOption,
    },
    {
      field: 'Sjfj',
      title: '税金及附加',
      ...commonOption,
    },
    {
      field: 'Zjzycb',
      title: '资金占用成本',
      ...commonOption,
    },
    {
      field: 'Bgnft',
      title: 'BG内分摊',
      ...commonOption,
    },
    {
      field: 'Qygg',
      title: '区域公共',
      ...commonOption,
    },
    {
      field: 'Qtsr',
      title: '其他收入',
      ...commonOption,
    },
    {
      field: 'CreateTime',
      title: '创建日期',
      ...commonOption,
    },
  ];
  return columns;
};
