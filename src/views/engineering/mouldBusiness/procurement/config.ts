import type { VxeGridPropTypes } from 'vxe-table';

import { SUB_COLUMNS } from '../components/expandTable/config';

const SUPPLIER_CONTACT_COLUMNS: VxeGridPropTypes.Columns = [
  {
    title: '联系人',
    field: 'designatedEngReviewerId',
    width: 200,
    formatter: ({ row }) => row.designatedEngReviewerName || row.designatedEngReviewerId || '',
  },
];

/**
 * 模具采购待处理、已处理：
 * 列表页增加【联系人】放在采购类型后面；
 */
function getExpandColumns() {
  const supplierIndex = SUB_COLUMNS.findIndex(item => item.field === 'supplier');
  if (supplierIndex === -1) {
    return [...SUB_COLUMNS, ...SUPPLIER_CONTACT_COLUMNS];
  }
  return [...SUB_COLUMNS.slice(0, supplierIndex + 1), ...SUPPLIER_CONTACT_COLUMNS, ...SUB_COLUMNS.slice(supplierIndex + 1)];
}

/**
 * 展开子表列配置
 */
export const EXPAND_COLUMNS = getExpandColumns();
