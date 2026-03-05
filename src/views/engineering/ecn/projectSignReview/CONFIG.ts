import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { STATUS_OPTIONS } from '/@/utils/status/index';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();
const { t } = useI18n();
export function getFormConfig() {
  return [
    {
      label: '',
      fieldName: 'applyCode',
      component: 'Input',
      componentProps: {
        placeholder: 'ECN单号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'changeTheme',
      component: 'Input',
      componentProps: {
        placeholder: '变更主题',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'pd',
      component: 'Input',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'time',
      component: 'RangePicker',
      componentProps: {
        submitOnPressEnter: true,
        placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
      },
    },
    {
      label: '',
      fieldName: 'status',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '状态',
        submitOnPressEnter: true,
        api: () => baseStore.getDictionaryData('Flow.BillStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
  ];
}

export const waitGetColumns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: 'ECN单号',
    field: 'applyCode',
  },
  {
    title: '状态',
    field: 'status',
    // format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '变更主题',
    field: 'changeTheme',
  },
  {
    title: '当前处理人',
    field: 'handlerName',
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
  },
  {
    title: '节点记录',
    field: 'nodeDetail',
    slots: { default: 'nodeDetail' },
  },
  {
    title: 'PD',
    field: 'applyUserName',
  },
  {
    title: '申请人',
    field: 'applyUserName',
  },
  {
    title: '申请部门',
    field: 'applyDeptName',
  },
  {
    title: '申请日期',
    field: 'applyDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

// export function doneGetColumns(): BasicColumn[] {
//   return [
//     {
//       title: 'ECN单号',
//       dataIndex: 'ecrCode',
//     },
//     {
//       title: '状态',
//       dataIndex: 'status',
//       format: 'tag|' + JSON.stringify(STATUS_OPTIONS),
//     },
//     {
//       title: '变更主题',
//       dataIndex: 'insidePartNumber',
//     },
//     {
//       title: '产品内部料号',
//       dataIndex: 'insidePartNumber',
//     },
//     {
//       title: '新版本',
//       dataIndex: 'insidePartNumber',
//     },
//     {
//       title: '产品描述',
//       dataIndex: 'insidePartNumber',
//     },
//     {
//       title: '当前处理人',
//       dataIndex: 'handlerName',
//     },
//     {
//       title: '当前节点',
//       dataIndex: 'currentNodeName',
//     },
//     {
//       title: '节点记录',
//       dataIndex: 'nodeDetail',
//     },
//     {
//       title: 'PD',
//       dataIndex: 'applyUserName',
//     },
//     {
//       title: '申请人',
//       dataIndex: 'applyUserName',
//     },
//     {
//       title: '申请部门',
//       dataIndex: 'applyDeptName',
//     },
//     {
//       title: '申请日期',
//       dataIndex: 'applyDate',
//       format: 'date|YYYY-MM-DD',
//     },
//     {
//       title: '处理人',
//       dataIndex: 'applyDeptName',
//     },
//     {
//       title: '处理日期',
//       dataIndex: 'applyDate',
//       format: 'date|YYYY-MM-DD',
//     },
//   ];
// }
