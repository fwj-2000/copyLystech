import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { getAllPrintTemplate, GetCurrentDetailBySnOrDocNo, PrintApi, getPrintTemplateDetail } from '/@/api/productionDeal/packagePrint';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export const formSchema = [
  {
    fieldName: 'qrCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '二维码',
      allowClear: true,
    },
  },
  {
    fieldName: 'templateId',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPrintTemplate,
      placeholder: '请选择标签模板',
      showSearch: false,
      alwaysLoad: true,
      apiSearch: {
        show: true,
      },
      labelField: 'name',
      valueField: 'id',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      beforeFetch: () => {
        return {
          firstCategoryCode: 'OtherLabels',
        };
      },
    },
    i18nField: 'templateName',
  },
];

// 主页表格column配置
export const column = [
  { type: 'checkbox', field: 'checkbox', width: 70 },
  {
    title: '二维码',
    field: 'qrCode',
    width: 180,
  },
  {
    title: '模板名称',
    field: 'templateName',
    width: 160,
  },
  {
    title: '备注1',
    field: 'remark1',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注2',
    field: 'remark2',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注3',
    field: 'remark3',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注4',
    field: 'remark4',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注5',
    field: 'remark5',
    width: 160,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注6',
    field: 'remark6',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注7',
    field: 'remark7',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注8',
    field: 'remark8',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注9',
    field: 'remark9',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注10',
    field: 'remark10',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注11',
    field: 'remark11',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注12',
    field: 'remark12',
    width: 150,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];

export const printFormSchema = [
  {
    field: 'templateId',
    label: '标签模板',
    component: 'ApiSelect',
    componentProps: {
      api: getAllPrintTemplate,
      placeholder: '请选择标签模板',
      showSearch: false,
      alwaysLoad: true,
      apiSearch: {
        show: true,
      },
      labelField: 'name',
      valueField: 'id',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
      beforeFetch: () => {
        return {
          firstCategoryCode: 'OtherLabels',
        };
      },
    },
    colProps: { span: 12 },
    required: true,
    i18nField: 'templateName',
  },
  {
    field: 'qrCode',
    label: '二维码',
    component: 'Input',
    required: true,
    colProps: { span: 12 },
  },
  {
    field: 'remark1',
    label: '备注1',
    component: 'Input',
  },
  {
    field: 'remark2',
    label: '备注2',
    component: 'Input',
  },
  {
    field: 'remark3',
    label: '备注3',
    component: 'Input',
  },
  {
    field: 'remark4',
    label: '备注4',
    component: 'Input',
  },
  {
    field: 'remark5',
    label: '备注5',
    component: 'Input',
  },
  {
    field: 'remark6',
    label: '备注6',
    component: 'Input',
  },
  {
    field: 'remark7',
    label: '备注7',
    component: 'Input',
  },
  {
    field: 'remark8',
    label: '备注8',
    component: 'Input',
  },
  {
    field: 'remark9',
    label: '备注9',
    component: 'Input',
  },
  {
    field: 'remark10',
    label: '备注10',
    component: 'Input',
  },
  {
    field: 'remark11',
    label: '备注11',
    component: 'Input',
  },
  {
    field: 'remark12',
    label: '备注12',
    component: 'Input',
  },
];
