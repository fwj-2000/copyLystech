import { getColumns } from '/@/views/dashboard/operation/productionAndSalesRate/config';

import { BaseVxeTableTypes, ESlotDefault } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns = [
    {
      field: 'factory',
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      className: 'bg-white',
      params: {
        pathUrl: '/dashboard/operation/productionAndSalesRate/group',
        getPathParams: ({ row, searchFormValue }) => {
          const orgCode = row.orgcode || 'MQ';
          const query = {
            ...searchFormValue,
            orgCode,
          };
          return query;
        },
      },
    },
    {
      field: 'category',
    },
    { field: 'metric' },
    {
      field: 'vlist',
      className: ({ row, column }) => {
        const { metric } = row;
        const value = row[column.field] ?? '';
        const markMetric = ['产值达成率', '出货达成率', '产销率'];
        if (markMetric.includes(metric)) {
          return Number.parseInt(value, 10) < 100 ? 'text-red' : null;
        }
      },
    },
  ];
  return getColumns(columns);
};
