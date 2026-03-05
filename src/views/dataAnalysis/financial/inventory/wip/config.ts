import { commonDateRangeFormOptions, commonSignDateFormOptions, commonDayWeekMonthFormOptions, commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonMediumTextOption, commonLargeTextOption, commonValueOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { BaseVxeTableTypes, EFilterSlot, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { ETimeDimension } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

dayjs.extend(weekOfYear);

const mergeCommonMediumValueOption = {
  ...commonValueOption,
  formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
  exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 4, false),
};

// 搜索表单配置
export const formOptions = [commonSyOrgCodeFormOptions, commonDayWeekMonthFormOptions, commonDateRangeFormOptions, commonSignDateFormOptions];

/**
 * @description: `时间范围`及其`搜索值`枚举
 */
export enum DATE_RANGE_ENUM {
  '7天以内' = '0,7',
  '8-15天' = '8,15',
  '16-30天' = '16,30',
  '31-60天' = '31,60',
  '60天以上' = '60,99999',
  '合计' = '',
}

/**
 * 获取指定时间段内的最后一天
 * @param time 天：`YYYY-MM-DD`、周: `${YYYY}WK{XX}`、月: `YYYY-MM`
 * @param type 时间类型
 * @returns
 */
function getLastDayOfDateRange(time: any, type: `${ETimeDimension}`) {
  if (!time || type === ETimeDimension.DAY) {
    return time;
  }

  if (type === ETimeDimension.WEEK) {
    // 解析周字符串（如 "2025Wk24"）
    const [year, week] = time.split('WK').map(Number);

    // 获取该周的最后一天（周日）
    return dayjs().year(year).week(week).endOf('week').format('YYYY-MM-DD');
  }

  if (type === ETimeDimension.MONTH) {
    // 直接使用 endOf 方法获取月末
    return dayjs(time).endOf('month').format('YYYY-MM-DD');
  }
}

/** 链接配置 */
export function getLinkSettingConfig(type: `${DATE_RANGE_ENUM}`) {
  return {
    slots: {
      default: ESlotDefault.LINK_DEFAULT,
    },
    params: {
      getPathUrl: ({ row }) => {
        return row.TimeDate === '环比增减' ? '' : '/dataAnalysis/financial/inventory/wip/detail';
      },
      getPathParams: ({ row, searchFormValue }) => {
        const startDay = getLastDayOfDateRange(row.TimeDate, searchFormValue.dimension);
        return {
          orgCode: row.OrgCode ?? searchFormValue.orgCode,
          startDay: dayjs(startDay),
          type,
        };
      },
    },
  };
}

// 表头配置
export const getAllColumns = (week: string): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'FactoryName',
      title: '厂区',
      align: 'center',
      className: 'bg-white',
      width: 100,
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      ...commonLargeTextOption,
      field: 'TimeDate',
      title: '日期',
      align: 'center',
      width: 100,
    },
    {
      field: 'TicketDimension',
      title: '工单维度（单位：张）',
      align: 'center',
      children: [
        {
          ...mergeCommonMediumValueOption,
          field: 'CountLessThan7Days',
          title: '7天以内',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['7天以内']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Count8To15Days',
          title: '8-15天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['8-15天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Count16To30Days',
          title: '16-30天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['16-30天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Count31To60Days',
          title: '31-60天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['31-60天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'CountMoreThan60Days',
          title: '60天以上',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['60天以上']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'CountTotal',
          title: '合计',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['合计']),
        },
      ],
    },
    {
      field: 'WIPAmount',
      title: 'WIP金额（单位：万元）',
      align: 'center',
      children: [
        {
          ...mergeCommonMediumValueOption,
          field: 'SumLessThan7Days',
          title: '7天以内',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['7天以内']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Sum8To15Days',
          title: '8-15天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['8-15天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Sum16To30Days',
          title: '16-30天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['16-30天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'Sum31To60Days',
          title: '31-60天',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['31-60天']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'SumMoreThan60Days',
          title: '60天以上',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['60天以上']),
        },
        {
          ...mergeCommonMediumValueOption,
          field: 'SumTotal',
          title: '合计',
          ...getLinkSettingConfig(DATE_RANGE_ENUM['合计']),
        },
      ],
    },
    {
      width: 20,
      field: 'spaceCol',
      headerClassName: 'bg-white no-border',
      className: 'bg-white',
    },
    {
      field: 'WIPManagement',
      title: 'WIP管理',
      align: 'center',
      children: [
        {
          ...mergeCommonMediumValueOption,
          field: 'OutValue',
          title: `${week}产值`,
          width: 120,
        },
        // {
        //   ...mergeCommonMediumValueOption,
        //   field: 'OutVal',
        //   title: `${week}产值`,
        //   width: 90,
        // },
        {
          ...mergeCommonMediumValueOption,
          field: 'OutValProp',
          title: '产值占比',
          formatter: getFormatter({ decimal: 1, isRate: true, isH: true }),
        },
      ],
    },
  ];
  return columns;
};
