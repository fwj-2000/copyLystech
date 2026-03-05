import { VxeFormItemProps, VxeGridPropTypes } from '/@/components/VxeTable';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { transformI18nVxeTable } from '/@/utils';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: '0', theme: 'gray', color: '#999999', fullName: '未开始', rowKey: 'processStatusName' },
  { id: '1', theme: 'blue', color: '#1890FF', fullName: '进行中', rowKey: 'processStatusName' },
  { id: '2', theme: 'green', color: '#52C41A', fullName: '已完成', rowKey: 'processStatusName' },
  { id: '3', theme: 'red', color: '#FF4D4F', fullName: '已终止', rowKey: 'processStatusName' },
];
export const searchFormSchema = [
  {
    fieldName: 'factory',
    label: '',
    i18nField: 'factoryAreaName',
    component: 'ApiSelect',
    componentProps: {
      api: ListByUserfactory,
      placeholder: '所属厂区',
      showSearch: true,
      resultField: 'data',
      filterOption: (inputValue, path) => {
        return [path].some(option => option.label.includes(inputValue));
      },
      notFoundContent: null,
      immediate: true,
      labelField: 'Name',
      valueField: 'Code',
      defaultFirstOption: true,
      allowClear: false,
    },
  },
];

export const _vxeColumns: VxeGridPropTypes.Columns = [
  { field: 'checkbox', type: 'checkbox', width: '50', align: 'center' },
  {
    title: '排序',
    field: 'sort',
    width: '120',
    align: 'center',
    treeNode: true,
    dragSort: true,
    slots: { default: 'sortSlots' },
  },
  { field: 'seqNo', title: t('component.table.index'), type: 'seq', width: '160', align: 'left', slots: { default: 'seqNo' } },
  { title: t('dict.ProcessSchedulingColumn.workOrderNo'), field: 'workOrderNo', showOverflow: 'tooltip', width: '160' },
  { title: '模具编号', field: 'moldNo', showOverflow: 'tooltip', width: '160' },
  { title: '工程图纸', field: 'prjDrawingsName', showOverflow: 'tooltip', width: '160', slots: { default: 'prjDrawingsName' } },
  { title: '状态', field: 'processStatus', showOverflow: 'tooltip', width: '160', slots: { default: 'processStatus' } },
  { title: '模具工艺类型', field: 'moldTypeName', showOverflow: 'tooltip', width: '160' },
  { title: '产品类型', field: 'productTypeName', showOverflow: 'tooltip', width: '160' },
  {
    title: '计划完工时间',
    field: 'planCompleteTime',
    showOverflow: 'tooltip',
    width: '160',
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  {
    title: '客户要求交期',
    field: 'requireDeliveryTime',
    showOverflow: 'tooltip',
    width: '160',
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  { title: '材料', field: 'material', showOverflow: 'tooltip', width: '160' },
  { title: '材质', field: 'materialName', showOverflow: 'tooltip', width: '160' },
  { title: '工艺是否满足', field: 'isProcessMeet', showOverflow: 'tooltip', width: '160', slots: { default: 'isProcessMeet' } },
  {
    title: '交期确认',
    field: 'deliveryTime',
    showOverflow: 'tooltip',
    width: '160',
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  { title: '操作', field: 'action', showOverflow: 'tooltip', width: '80', fixed: 'right', slots: { default: 'action' } },
];
/**
 * 清单页 - 表格列配置
 */
export const vxeColumns = transformI18nVxeTable(_vxeColumns, 'ProcessSchedulingColumn');

export const vxeTableFormSchema = [
  {
    field: 'workOrderNo',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: t('dict.ProcessSchedulingColumn.workOrderNo'),
      },
    },
    span: 4,
  },
  {
    field: 'moldNo',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: t('dict.CommonCol.moldNo'),
      },
    },
    span: 4,
  },
  {
    field: 'date',
    title: '',
    itemRender: {
      name: 'ARangePicker',
      props: {
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
      },
    },
  },
  {
    field: 'status',
    title: '',
    itemRender: {
      name: 'ASelect',
      props: {
        options: STATUS_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
        style: 'width: 100%',
      },
    },
  },
  {
    align: 'left',
    className: '!pr-0',
    itemRender: {
      name: 'AButtonGroup',
      children: [
        {
          props: { type: 'primary', content: '查询', htmlType: 'submit' },
          attrs: { class: 'mr-2' },
        },
        { props: { type: 'default', htmlType: 'reset', content: '重置' } },
      ],
    },
  },
];
