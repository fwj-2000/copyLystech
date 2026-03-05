import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { getdropdownlist } from '/@/api/business/projectMember';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export const formSchema = [
  {
    fieldName: 'checkConfigItemName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t(['dict.CommonCol.checkProject', 'dict.CommonCol.dutyPersonName']), //'点检项名称',
      allowClear: true,
    },
  },
];
// 主页form配置
export const schemaCheck = [
  {
    fieldName: 'checkConfigName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t(['dict.CommonCol.check', 'dict.CommonCol.dutyPersonName']), //'点检名称',
      allowClear: true,
    },
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: t(['dict.CommonCol.checkProject', 'dict.CommonCol.dutyPersonName']), //'点检项名称',
    field: 'checkConfigItemName',
    width: 180,
  },
  {
    title: 'sql',
    field: 'sql',

    minWidth: 150,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 'auto',
    fixed: 'right',
  },
];
export const columnCheck = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: t(['dict.CommonCol.check', 'dict.CommonCol.dutyPersonName']), //'点检名称',
    field: 'checkConfigName',
    width: 180,
  },
  {
    title: t(['dict.CommonCol.checkProject', 'dict.CommonCol.dutyPersonName']), //'点检项名称',
    field: 'itemNames',
    minWidth: 150,
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 'auto',
    fixed: 'right',
  },
];
