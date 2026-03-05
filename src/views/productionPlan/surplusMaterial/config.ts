import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * 列表配置
 */
export const columns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: '物料编码',
    field: 'materialCode',
  },
  {
    title: '宽度',
    field: 'width',
  },
  {
    title: '数量',
    field: 'qty',
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '单位',
    field: 'unit',
  },
  {
    title: '工厂',
    field: 'factory',
  },
  {
    title: '物料类型',
    field: 'materialType',
  },
  {
    title: '余料来源',
    field: 'createdFrom',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    showOverflow: 'tooltip',
    minWidth: '200',
    cellRender: {
      name: 'Date',
    },
  },
];

/**
 * 列表 - 查询表单
 */
export const schema = [
  {
    fieldName: 'materialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PsTableDataColumn.materialCode'),
      allowClear: true,
    },
  },
  {
    fieldName: 'factory',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      allowClear: true,
    },
  },
];
