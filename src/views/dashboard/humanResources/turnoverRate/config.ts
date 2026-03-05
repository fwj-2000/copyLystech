import { getColumns } from '/@/views/dashboard/humanResources/config';

import type { VxeGridPropTypes } from 'vxe-table';

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [{ field: 'seq' }, { field: 'Factory' }, { field: 'DeptNameLevel5' }, { field: 'Nationality' }, { field: 'MarkType' }];
  return getColumns(columns);
};
