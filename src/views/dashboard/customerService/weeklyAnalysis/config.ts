import type { VxeGridPropTypes } from 'vxe-table';
import { getColumns } from '../config';

import { ETimeDimension } from '/@/views/dashboard/customerService/types';
import { getMetricNameByDimension } from '/@/views/dashboard/customerService/utils';
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
  const currentMetricName = getMetricNameByDimension({
    dimension,
    value: currentNum,
  });
  const columns = [
    {
      field: 'seq',
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
          title: '上周实际金额',
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
          title: `${currentMetricName}`,
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
          title: '上周实际需求',
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
          title: `${currentMetricName}`,
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
