import type { VxeTableDefines } from 'vxe-table';

export type ExCustomStoreData = Omit<VxeTableDefines.CustomStoreData, 'sortData'> & {
  // `VxeTable`实际运行时，`sortData`是`Array<{ k: string }>`类型，官方定义为`Record<string, number>`
  // 此处进行兼容，统一使用`Array<{ k: string }>`形式(新版)
  sortData?: Record<string, number> | Array<{ k: string }>;
};
