import { getColumns } from '/@/views/dashboard/customerService/config';

import type { VxeGridPropTypes } from 'vxe-table';

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'seq' },
    {
      field: 'VmiOrJit',
    },
    {
      field: 'TradeCurrency',
    },
    {
      field: 'CurrentTotalPrice',
    },
    {
      field: 'CurrentQuantity',
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
      field: 'ProductCategory',
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
  ];
  return getColumns(columns);
};
