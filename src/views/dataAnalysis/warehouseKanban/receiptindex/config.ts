import { commonTextOption, commonMediumValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
// import dayjs from 'dayjs';
// import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
// import { ETimeDimension } from '/@/views/dataAnalysis/types';
import { commonDateRangeFormOptions, commonDayWeekMonthFormOptions } from '/@/views/dataAnalysis/config';
import { commonOrgCodeSelectFormOptions } from '/@/views/dataAnalysis/warehouseKanban/config';
import xeUtils from 'xe-utils';
export const formOptions: TFormItemOption[] = [commonOrgCodeSelectFormOptions, commonDayWeekMonthFormOptions, commonDateRangeFormOptions];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonTextOption,
      title: '厂区',
      field: 'factory',
      mergeConfig: {
        needMergeRow: true,
      },
      className: 'bg-white',
    },
    {
      ...commonTextOption,
      title: '仓库分类',
      field: 'title1',
      mergeConfig: {
        needMergeRow: true,
      },
      className: 'bg-white',
    },
    {
      ...commonTextOption,
      title: '业务',
      field: 'title2',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      ...commonTextOption,
      title: '指标',
      field: 'title3',
    },
    {
      ...commonMediumValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'list',
      formatter: ({ cellValue }) => {
        if (!cellValue && cellValue !== 0) return '';
        if (xeUtils.isString(cellValue)) return cellValue;
        return xeUtils.commafy(cellValue, { digits: 0 });
      },
    },
  ];
  return columns;
};
