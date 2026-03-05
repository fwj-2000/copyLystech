import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { getPartNumberFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { isNullOrUnDef } from '/@/utils/is';

const { t } = useI18n();
const baseStore = useBaseStore();

/** 图纸文件状态，取自字典`MoldApply.DrawingFileStatus` */
export enum FILE_STATUS_ENUM {
  启用 = '1',
  禁用 = '2',
  废弃 = '3',
}

/** 图纸文件状态 选项 */
export const fileStatusOptions = [
  {
    fullName: t('dict.MoldApply.DrawingFileStatus.1'),
    id: FILE_STATUS_ENUM.启用,
    theme: 'green',
  },
  {
    fullName: t('dict.MoldApply.DrawingFileStatus.2'),
    id: FILE_STATUS_ENUM.禁用,
    theme: 'red',
  },
  {
    fullName: t('dict.MoldApply.DrawingFileStatus.3'),
    id: FILE_STATUS_ENUM.废弃,
    theme: 'red',
  },
];

/** 状态，取自字典`MoldApply.DrawingStatus` */
export enum STATUS_ENUM {
  在办 = '1',
  结案 = '2',
  撤回 = '3',
  驳回 = '4',
  // 废弃 = '5',
}

export const statusOptions = [
  // 在办
  { id: STATUS_ENUM.在办, fullName: t('dict.MoldApply.DrawingStatus.1'), theme: 'blue' },
  // 结案
  { id: STATUS_ENUM.结案, fullName: t('dict.MoldApply.DrawingStatus.2'), theme: 'green' },
  // 撤回
  { id: STATUS_ENUM.撤回, fullName: t('dict.MoldApply.DrawingStatus.3'), theme: 'purple' },
  // 驳回
  { id: STATUS_ENUM.驳回, fullName: t('dict.MoldApply.DrawingStatus.4'), theme: 'yellow' },
  // 废弃
  // { id: STATUS_ENUM.废弃, fullName: t('dict.MoldApply.DrawingStatus.5'), theme: 'red' },
];

/** 表格 筛选表单配置 */
export function getFormConfig() {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getPartNumberFactoryList,
        placeholder: '工厂',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        allowClear: true,
      },
    },
    {
      fieldName: 'uploadProcessorId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '上传人',
        allowClear: true,
      },
    },
    {
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CommonCol.currentNodeUser',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
  ];
}

/** 表格 列配置 */
export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '模具图纸',
      field: 'moldDrawings',
      width: 200,
      slots: {
        default: 'moldDrawings',
      },
    },
    {
      title: '图纸来源',
      field: 'drawingSource',
      formatter: ({ row }) => row.drawingSourceName || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('MoldApply.DrawingSource'),
          showSearch: false,
          filterOption: false,
          notFoundContent: null,
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
      width: 100,
    },
    {
      title: '模具料号',
      field: 'moldNo',
      width: 150,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insidePartNumberOld',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 160,
    },
    {
      title: '工厂',
      field: 'factoryName',
      i18nField: 'factory',
      width: 160,
      formatter: ({ row }) => {
        return [row.factory, row.factoryName].filter(Boolean).join('/');
      },
    },
    {
      title: '图纸状态',
      field: 'drawingStatus',
      width: 100,
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: fileStatusOptions, fieldNames: { value: 'id', label: 'fullName' } } },
      cellRender: {
        name: 'Tag',
        options: fileStatusOptions,
      },
    },
    {
      title: '图纸版本',
      field: 'drawingVersion',
      width: 100,
      formatter: ({ cellValue }) => (isNullOrUnDef(cellValue) ? '' : `T${cellValue}`),
      filters: [{ data: '' }],
      filterRender: { name: 'Input', props: { prefix: 'T' } },
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: statusOptions, fieldNames: { value: 'id', label: 'fullName' } } },
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '当前处理人',
      field: 'currentProcessorId',
      i18nField: 'CommonCol.currentNodeUser',
      formatter: ({ cellValue, row }) => row.currentProcessorName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      width: 160,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 100,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '上传人',
      field: 'uploadProcessorName',
      i18nField: 'uploadProcessorId',
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect' },
      width: 200,
    },
    {
      title: '上传时间',
      field: 'uploadProcessorDate',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '操作记录',
      field: 'operation',
      i18nField: 'CommonCol.operationLog',
      width: 100,
      slots: {
        default: 'operation',
      },
    },
    {
      title: '主要制程',
      field: 'mainProcessName',
      i18nField: 'mainProcess',
      width: 120,
    },
  ];
}

/** 导出列配置 */
export function getExportColumns() {
  return getColumn()
    .slice(2)
    .filter(item => item.field !== 'operation' && item.field !== 'nodeDetail');
}
