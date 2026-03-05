import { useI18n } from '/@/hooks/web/useI18n';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'factory',
      label: '',
      i18nField: 'CommonCol.factoryArea',
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
    {
      fieldName: 'productCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品编号',
      },
    },
    {
      fieldName: 'snCode',
      label: '',
      component: 'Textarea',
      componentProps: {
        placeholder: 'SN',
        rows: 1,
      },
    },
    {
      fieldName: 'processName',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行工序',
        options: [],
        fieldNames: { label: 'name', value: 'name' },
      },
    },
    {
      fieldName: 'operatorId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '请选择操作员',
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
    },
    {
      fieldName: 'creatorTime',
      label: '',
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm',
      },
    },
  ];
}

export const columns = [
  {
    title: '执行工序',
    field: 'processName',
  },
  {
    title: 'SN',
    field: 'snCode',
  },
  {
    title: '产品编码',
    field: 'productCode',
  },
  {
    title: '单据号',
    field: 'documentNumber',
  },
  {
    title: '模具号',
    field: 'mouldNo',
  },
  {
    title: '注塑粒子',
    field: 'config',
  },
  {
    title: '线体',
    field: 'lineCodeName',
  },
  {
    title: '操作员',
    field: 'operatorName',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    sortable: true,
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];
