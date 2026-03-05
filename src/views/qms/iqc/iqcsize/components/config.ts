import dayjs from 'dayjs';
import { FormSchema } from '/@/components/Form';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

export const schemas: FormSchema[] = [
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

  {
    field: 'insidepartnumber',
    // label: '内部物料编码',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入内部物料编码',
      allowClear: true,
      // api: getProductLineList,
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
    field: 'insidepartnumber1',
    // label: '检测规格',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入内部物料编码',
      allowClear: true,
      // api: getProductLineList,
      labelField: 'Name',
      valueField: 'Code',
      resultField: 'data',
      filterOption: false,
      nameFormat: ['Code', '-', 'Name'],
      notFoundContent: null,
      immediate: true,
    },
  },
];
