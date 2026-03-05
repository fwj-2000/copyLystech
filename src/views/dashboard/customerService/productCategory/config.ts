import { getColumns } from '/@/views/dashboard/customerService/config';
import { getLastDimensionNum, getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';

import { ETimeDimension } from '/@/views/dashboard/customerService/types';
import type { VxeGridPropTypes } from 'vxe-table';
import XEUtils from 'xe-utils';

// 表格字段配置
export const getAllColumns = (
  {
    currentNum,
    dimension,
  }: {
    currentNum: string | number;
    dimension: ETimeDimension;
  } = {
    currentNum: 0,
    dimension: ETimeDimension.WEEK,
  },
): VxeGridPropTypes.Columns => {
  const lastDimensionNum = getLastDimensionNum({
    dimension,
    currentNum,
  });
  const lastMetricName = getMetricNameByDimension({
    dimension,
    value: lastDimensionNum,
  });
  const currentMetricName = getMetricNameByDimension({
    dimension,
    value: currentNum,
  });
  const lastMetricTitle = `${lastMetricName}预测${currentMetricName}`;
  const columns = [
    {
      field: 'seq',
    },
    {
      field: 'ProductCategory',
      filters: [
        {
          data: [],
        },
      ],
    },
    {
      field: 'Amount',
      title: '金额',
      headerClassName: 'amount-header',
      headerAlign: 'center',
      children: [
        {
          width: 90,
          field: 'LastTotalPrice',
          title: lastMetricTitle,
          headerClassName: 'amount-header',
          headerAlign: 'center',
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
          width: 80,
          field: 'CurrentTotalPrice',
          title: currentMetricName,
          headerClassName: 'amount-header',
          headerAlign: 'center',
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
          width: 80,
          field: 'ChangeRateTotalPrice',
          title: '变化率',
          formatter({ cellValue }) {
            return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
          },
          headerClassName: 'amount-header',
          headerAlign: 'center',
          align: 'right',
          sortable: true,
        },
      ],
    },
    {
      field: 'Quantity',
      title: '数量',
      headerAlign: 'center',
      headerClassName: 'quantity-header',
      children: [
        {
          width: 90,
          field: 'LastQuantity',
          title: lastMetricTitle,
          headerClassName: 'quantity-header',
          headerAlign: 'center',
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
          width: 80,
          field: 'CurrentQuantity',
          title: currentMetricName,
          headerClassName: 'quantity-header',
          headerAlign: 'center',
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
          width: 80,
          field: 'ChangeRateQuantity',
          title: '变化率',
          formatter({ cellValue }) {
            return `${XEUtils.commafy(Number(cellValue), { digits: 1 })}%`;
          },
          headerClassName: 'quantity-header',
          headerAlign: 'center',
          align: 'right',
          sortable: true,
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
      filters: null,
    },
  ];
  return getColumns(columns);
};
