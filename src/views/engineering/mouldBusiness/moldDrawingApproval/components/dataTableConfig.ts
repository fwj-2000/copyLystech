import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { getPartNumberFactoryList } from '/@/api/basicData/factory';
import { statusOptions } from '/@/views/engineering/mouldBusiness/components/moldDrawingConfig';
import { useUserStore } from '/@/store/modules/user';
import { useBaseStore } from '/@/store/modules/base';

const userStore = useUserStore();
const baseStore = useBaseStore();

export const columns: VxeGridPropTypes.Columns = [
  {
    type: 'checkbox',
    width: 50,
  },
  {
    type: 'seq',
    width: 50,
  },
  // {
  //   title: '单号',
  //   field: 'code',
  //   width: 180,
  //   filters: [{ data: '' }],
  //   filterRender: { name: 'Input' },
  // },
  {
    title: '来源类型',
    field: 'drawingSource',
    width: 180,
    formatter: ({ row }) => {
      return row.drawingSourceName || row.drawingSource || '';
    },
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
  },
  {
    title: '模具料号',
    field: 'moldNo',
    width: 180,
  },
  {
    title: '模具图纸',
    field: 'moldDrawings',
    width: 180,
    slots: {
      default: 'moldDrawings',
    },
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    width: 180,
  },
  {
    title: '旧版内部编码',
    field: 'insidePartNumberOld',
    width: 180,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '工厂',
    field: 'factory',
    width: 180,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
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
    width: 200,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    i18nField: 'CommonCol.currentNode',
    width: 200,
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    i18nField: 'CommonCol.nodeDetail',
    width: 200,
    slots: {
      default: 'nodeDetail',
    },
  },
  {
    title: '申请人',
    field: 'uploadProcessorName',
    i18nField: 'uploadProcessorId',
    width: 200,
  },
  {
    title: '申请时间',
    field: 'uploadProcessorDate',
    width: 200,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD hh:mm',
    },
  },
];

export function getSchemas(isTodo: boolean) {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '模具料号', allowClear: true },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      colProps: {
        span: 4,
      },
      componentProps: { placeholder: '产品内部料号', allowClear: true },
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
      fieldName: 'currentProcessorId',
      label: '',
      component: 'CustomUserSelect',
      i18nField: 'CommonCol.currentNodeUser',
      componentProps: {
        placeholder: '当前处理人',
        defaultValue: isTodo ? userStore.getUserInfo?.userId : null,
        allowClear: true,
      },
    },
    {
      fieldName: 'uploadProcessorId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
        allowClear: true,
      },
    },
  ];
}
