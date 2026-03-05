import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema as VxeFormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

/** 列表页 - 搜索表单项配置 */
export const getFormConfig: VxeFormSchema[] = [
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '材料内部料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'innerExternalNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '原厂商型号',
      allowClear: true,
    },
  },
  {
    fieldName: 'purchaseUserName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '采购',
      allowClear: true,
    },
  },
];

/** 列表页 - 列配置 */
export const tableColumn: VxeGridPropTypes.Columns = [
  // 勾选框
  {
    type: 'checkbox',
    field: 'checkbox',
  },
  // TODO: 根据业务设置需要展示的列配置
  {
    title: '单号',
    field: 'applyNumber',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
  },
  {
    title: '材料内部料号',
    field: 'innerMaterialNumber',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 180,
  },
  {
    title: '原厂商型号',
    field: 'innerExternalNumber',
    sortable: true,
    width: 160,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 180,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 130,
    slots: {
      default: 'nodeDetail',
    },
  },
  {
    title: '备注',
    field: 'remark',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    minWidth: 200,
  },
  {
    title: '申请人',
    field: 'applyUserId',
    i18nField: 'applyUserName',
    formatter: ({ cellValue, row }) => row.applyUserName || cellValue || '',
    filters: [{ data: '' }],
    filterRender: { name: 'CustomUserSelect' },
    width: 200,
  },
  {
    title: '申请时间',
    field: 'applyDate',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 150,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: '操作',
    width: 60,
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];
