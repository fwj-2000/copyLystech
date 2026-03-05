import { getColumns } from '/@/views/dashboard/customerService/config';

import type { VxeGridPropTypes } from 'vxe-table';

// 表格字段配置
export const getAllColumns = (
  { currentNum } = {
    currentNum: 0,
  },
): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'seq' },
    {
      field: 'CustomerPerson',
    },
    {
      field: 'CustomerCode',
    },
    {
      field: 'CurrentWeek',
      title: `WK${currentNum}`,
      headerAlign: 'center',
      headerClassName: 'last-predict-header',
      children: [
        {
          field: 'LastActual',
          title: '预测需求记录',
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
        },
        {
          field: 'CurrentActual',
          title: '实际出货',
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
        },
        {
          field: 'DifferenceData',
          title: '差异',
          headerAlign: 'center',
          headerClassName: 'last-predict-header',
          align: 'right',
          sortable: true,
        },
      ],
    },
    {
      field: 'CauseAnalysis',
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
