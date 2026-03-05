import type { VxeGridPropTypes } from 'vxe-table';
import { getColumns } from '/@/views/dashboard/humanResources/config';

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [{ field: 'seq' }, { field: 'Factory' }, { field: 'DeptNameLevel5' }, { field: 'MarkType' }, { field: 'PostName' }];
  return getColumns(columns);
};
