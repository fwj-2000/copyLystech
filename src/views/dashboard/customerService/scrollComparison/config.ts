import dayjs from 'dayjs';
import { getColumns } from '/@/views/dashboard/customerService/config';

import type { VxeGridPropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

// 表格字段配置
export const getAllColumns = (
  { currentWeek } = {
    currentWeek: 1,
  },
): VxeGridPropTypes.Columns => {
  const current = dayjs().tz().week(Number.parseInt(currentWeek, 10));
  const lastWeek = current.subtract(1, 'week').week();
  const columns = [
    { field: 'seq' },
    {
      field: 'LastWeekPredict',
      title: `WK${lastWeek}预测`,
      headerAlign: 'center',
      headerClassName: 'last-predict-header',
      children: [
        {
          field: 'LastWeekPredictQuantity1',
          title: `WK${currentWeek}`,
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'LastWeekPredictQuantity2',
          title: `WK${current.add(1, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'LastWeekPredictQuantity3',
          title: `WK${current.add(2, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'LastWeekPredictQuantity4',
          title: `WK${current.add(3, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
      ],
    },
    {
      field: 'CurrentWeekPredict',
      title: `WK${currentWeek}预测`,
      headerAlign: 'center',
      headerClassName: 'current-predict-header',
      align: 'right',
      children: [
        {
          field: 'CurrentWeekActualQuantity',
          title: `WK${currentWeek}实际`,
          width: 80,
          headerAlign: 'center',
          headerClassName: 'current-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'CurrentWeekPredictQuantity1',
          title: `WK${current.add(1, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'current-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'CurrentWeekPredictQuantity2',
          title: `WK${current.add(2, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'current-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
        {
          field: 'CurrentWeekPredictQuantity3',
          title: `WK${current.add(3, 'week').week()}`,
          headerAlign: 'center',
          headerClassName: 'current-predict-header',
          align: 'right',
          sortable: true,
          formatter: ({ cellValue }) => {
            if (!cellValue) {
              return cellValue;
            }
            return XEUtils.commafy(cellValue, { digits: 2 });
          },
        },
      ],
    },
    {
      field: 'CauseAnalysis',
    },
    {
      field: 'CustomerCode',
    },
    {
      field: 'CustomerPerson',
    },
    {
      field: 'OrgName',
    },
    {
      field: 'Project',
    },
    {
      field: 'ProjectPhase',
    },
    {
      field: 'ProductCategory',
    },
    {
      field: 'Custprodno',
    },
    {
      field: 'InnerMaterialNumber',
    },
    {
      field: 'VmiOrJit',
    },
    {
      field: 'TradeCurrency',
    },
  ];
  return getColumns(columns);
};
