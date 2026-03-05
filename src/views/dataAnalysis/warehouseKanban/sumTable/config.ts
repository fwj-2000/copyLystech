import xeUtils from 'xe-utils';
import { commonMediumTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';

import { commonDateRangeFormOptions, commonDayWeekMonthFormOptions } from '/@/views/dataAnalysis/config';
import dayjs from 'dayjs';

export const formOptions: TFormItemOption[] = [
  commonDayWeekMonthFormOptions,
  { ...commonDateRangeFormOptions, default: [dayjs().subtract(7, 'day'), dayjs().subtract(0, 'day')] },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      mergeConfig: {
        needMergeRow: true,
      },
      className: 'bg-white',
      title: '厂区',
      field: 'factory',
    },
    {
      ...commonMediumTextOption,
      mergeConfig: {
        needMergeRow: true,
      },
      className: 'bg-white',
      title: '仓库类型',
      field: 'title1',
    },
    {
      ...commonMediumTextOption,
      mergeConfig: {
        needMergeRow: true,
      },
      title: '分类',
      field: 'title2',
    },
    {
      ...commonMediumTextOption,
      title: '指标',
      field: 'title3',
    },
    {
      ...commonMediumValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'list',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          const { title2, title3 } = row;

          // 1. 特殊的
          if (title3 === 'PMC下单量') {
            return '/dataAnalysis/warehouseKanban/inventoryDetails';
          }

          // 2. 定义具体key-value
          const strategies = {
            出勤: () => '/dataAnalysis/warehouseKanban/attendIndDetail',
            人员出勤: () => '/dataAnalysis/warehouseKanban/attendIndDetail',

            收货: () => '/dataAnalysis/warehouseKanban/temporarilyCollect',
            品质检验: () => '/dataAnalysis/warehouseKanban/temporarilyCollect',

            入库: () => {
              return '/dataAnalysis/warehouseKanban/harvest';
              // const tempCollectItems = ['待入库笔数', '待入库面积'];
              // return tempCollectItems.includes(title3) ? '/dataAnalysis/warehouseKanban/temporarilyCollect' : '/dataAnalysis/warehouseKanban/harvest';
            },

            出库: () => {
              return '/dataAnalysis/warehouseKanban/shipment';
            },

            库存: () => {
              const badManageItems = ['总库存米数', '总库存面积', '不良库存米数', '不良库存面积'];
              const expireItems = ['已过期物料面积', '即将过期物料面积'];

              if (badManageItems.includes(title3)) return '/dataAnalysis/warehouseKanban/badManage';
              if (expireItems.includes(title3)) return '/dataAnalysis/warehouseKanban/aboutToExpire';
              return '';
            },
          };

          const handler = strategies[title2];
          return handler ? handler() : '';
        },
        getPathParams: ({ row, column }) => {
          const { title1, title2, title3 } = row;
          const { title } = column;
          const dateRangeParam = { dateRange: [dayjs(title), dayjs(title)] };
          // 1. 特殊的
          if (title3 === 'PMC下单量') {
            return { Ftrmi: dayjs(title) };
          }

          // 2. 定义具体key-value
          const strategies = {
            出勤: () => ({ ...dateRangeParam, ckType: title1.includes('整支仓') ? '整支仓' : title1 }), // 特殊处理 整支仓

            人员出勤: () => {
              if (title3 === '异常出勤人次') return { ...dateRangeParam, isAbnormal: '1' };
              return { ...dateRangeParam };
            },

            收货: () => ({ ...dateRangeParam }),
            品质检验: () => {
              const checkItems = ['待检验笔数', '待检验面积'];
              const checkItems2 = ['需检验笔数', '24H质检达成率'];

              if (checkItems.includes(title3)) return { ...dateRangeParam, insmk1: '未检验' };
              if (title3 === '检验完成笔数') return { ...dateRangeParam, insmk1: '已检验未过账;非限制' };
              if (checkItems2.includes(title3)) return { ...dateRangeParam, insmk1: '' };
              return { ...dateRangeParam };
            },

            入库: () => {
              const tempCollectItems = ['待入库笔数', '待入库面积'];
              return tempCollectItems.includes(title3) ? { ...dateRangeParam, insmk1: '已检验未过账' } : { ...dateRangeParam };
            },

            出库: () => {
              const toBeOutboundItems = ['待出库笔数', '待出库面积'];
              const outItems = ['出库笔数', '出库面积'];
              const transferItems = ['转工单笔数', '转工单面积'];
              if (toBeOutboundItems.includes(title3)) return { ...dateRangeParam, iszAufnr: '非转工单', zStatu: ['01', '06'] };
              if (outItems.includes(title3)) return { ...dateRangeParam, iszAufnr: '非转工单', zStatu: ['02', '06'] };
              if (transferItems.includes(title3)) return { ...dateRangeParam, iszAufnr: '转工单', zStatu: ['02', '06'] };
            },

            库存: () => {
              const manageItems = ['总库存米数', '总库存面积'];
              const badManageItems = ['不良库存米数', '不良库存面积'];

              if (manageItems.includes(title3)) return { ...dateRangeParam, isGoodProduct: '良品' };
              if (badManageItems.includes(title3)) return { ...dateRangeParam, isGoodProduct: '不良' };
              if (title3 === '已过期物料面积') return { ...dateRangeParam, zbStatus: '已过期' };
              if (title3 === '即将过期物料面积') return { ...dateRangeParam, zbStatus: '将过期' };
              return {};
            },
          };

          const handler = strategies[title2];
          return handler ? handler() : {};
        },
      },
      formatter: ({ cellValue }) => {
        if (!cellValue && cellValue !== 0) return '';
        if (xeUtils.isString(cellValue)) return cellValue;
        return xeUtils.commafy(cellValue, { digits: 0 });
      },
    },
  ];
  return columns;
};
