import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

export const column = [
  { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: '销售组织',
    field: 'Werks',
  },
  {
    title: '售达方',
    field: 'SellerCode',
    filters: [{ data: '' }],
  },
  {
    title: '创建人员',
    field: 'CreatorUserId',
    sortable: true,
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    sortable: true,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 65,
    fixed: 'right',
  },
];

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

/**
 * 编辑表单
 */
export const formSchema = [
  // 产品内部料号
  {
    label: '销售组织',
    field: 'Werks',
    component: 'Input',
  },
  {
    label: '售达方',
    field: 'SellerCode',
    component: 'Input',
  },
];
