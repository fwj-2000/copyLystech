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
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 文件名称
  {
    title: t('dict.PsTableDataColumn.fileName'),
    field: 'fileName',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 机台号
  {
    title: t('dict.PsTableDataColumn.machineNo'),
    field: 'machineNo',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // SAP单号
  {
    title: t('dict.PsTableDataColumn.sapOrderNo'),
    field: 'sapOrderNo',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 工单号
  {
    title: t('dict.PsTableDataColumn.workOrderNo'),
    field: 'workOrderNo',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 物料编码
  {
    title: t('dict.PsTableDataColumn.materialCode'),
    field: 'materialCode',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 工艺
  {
    title: t('dict.PsTableDataColumn.technology'),
    field: 'technology',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 下达天数
  {
    title: t('dict.PsTableDataColumn.flwgFollowingDays'),
    field: 'flwgFollowingDays',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 排产产能
  {
    title: t('dict.PsTableDataColumn.pcCapacity'),
    field: 'pcCapacity',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 工单数量
  {
    title: t('dict.PsTableDataColumn.wqQuantity'),
    field: 'wqQuantity',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 预计工时
  {
    title: t('dict.PsTableDataColumn.expWorkHour'),
    field: 'expWorkHour',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 计划数量
  {
    title: t('dict.PsTableDataColumn.planQuantity'),
    field: 'planQuantity',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 模切计划工时
  {
    title: t('dict.PsTableDataColumn.dieCutPlanWorkTime'),
    field: 'dieCutPlanWorkTime',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 班次
  {
    title: t('dict.PsTableDataColumn.classesDes'),
    field: 'classesDes',
    showOverflow: 'tooltip',
    minWidth: '140',
  },
  // 排产日期
  {
    title: t('dict.PsTableDataColumn.psDate'),
    field: 'psDate',
    showOverflow: 'tooltip',
    minWidth: '140',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  // 创建时间
  {
    title: t('dict.PsTableDataColumn.creatorTime'),
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
  // 机台号
  {
    field: 'machineNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PsTableDataColumn.machineNo'),
      allowClear: true,
    },
  },
  // 物料编码
  {
    field: 'materialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PsTableDataColumn.materialCode'),
      allowClear: true,
    },
  },
  // 文件名称
  {
    field: 'fileName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PsTableDataColumn.fileName'),
      allowClear: true,
    },
  },
  //时间
  {
    field: 'pickerVal',
    label: '',
    labelWidth: 100,
    component: 'DateRange',
  },
];
