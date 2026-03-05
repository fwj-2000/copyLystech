import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();
// 主页表格column配置
export const column = [
  {
    title: '内部料号',
    sortable: true,
    field: 'InnerMaterialCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工厂代码',
    sortable: true,
    field: 'FactoryCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '工程代码',
    sortable: true,
    field: 'EngineeringCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建人',
    field: 'CreatorUserName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 140,
  },
  {
    title: '修改人',
    field: 'LastModifyUserName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 140,
  },
];

export function getColumn(): any {
  const columnData = cloneDeep(column);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  columnData.push({
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  });
  return columnData;
}
