import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getProductLineList } from '/@/api/finance/materialPrice';
import { FormSchema } from '/@/components/Form';

const { t } = useI18n();
const baseStore = useBaseStore();

const mainProcessList = (await baseStore.getDictionaryData('MainProcess')) as any[];

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.PartNumberApplyStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
];

export const columns: VxeGridPropTypes.Columns = [
  // {
  //   field: 'checkbox',
  //   type: 'checkbox',
  //   width: '50',
  //   align: 'center',
  // },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: 'IQC单号',
    field: 'MainProcess',
    // formatter: ({ cellValue }) => {
    //   const fullName = mainProcessList.find(item => item.enCode === cellValue).fullName;
    //   return fullName;
    // },
  },
  {
    title: 'Lot No.',
    field: 'InsidePartNumber',
  },
  {
    title: '创建时间',
    field: 'Status',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
  },
  {
    title: '供应商名称',
    field: 'InsidePartNumber',
  },
  {
    title: '内部物料编码',
    field: 'InsidePartNumber',
  },
  {
    title: '检验结果',
    field: 'InsidePartNumber',
  },

  {
    title: '规格',
    field: 'InsidePartNumber',
  },
  {
    title: '检测类型',
    field: 'InsidePartNumber',
  },
  {
    title: '检测工具',
    field: 'InsidePartNumber',
  },
  {
    title: t('common.action'),
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'iqcchkno',
    label: '',
    // label: 'IQC单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入IQC单号',
      allowClear: true,
    },
  },
  {
    field: 'insidepartnumber',
    label: '',
    // label: '内部物料编码',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入内部物料编码',
      allowClear: true,
      api: getProductLineList,
      labelField: 'Name',
      valueField: 'Code',
      resultField: 'data',
      filterOption: false,
      nameFormat: ['Code', '-', 'Name'],
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    field: 'starttime',
    // label: '开始时间',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择开始时间',
      allowClear: true,
    },
  },
  {
    field: 'endtime',
    // label: '结束时间',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择结束时间',
      allowClear: true,
    },
  },
];
