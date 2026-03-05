import { useI18n } from '/@/hooks/web/useI18n';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
const { t } = useI18n();
export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), value: 1, label: t('common.enableText'), theme: 'green' },
  { id: 2, fullName: t('common.disableText'), value: 2, label: t('common.disableText'), theme: 'red' },
];
export const onLineOptions = [
  { id: 1, fullName: t('dict.isAssembleName.1'), value: 1, label: t('dict.isAssembleName.1'), theme: 'green' },
  { id: 0, fullName: t('dict.isAssembleName.2'), value: 0, label: t('dict.isAssembleName.2'), theme: 'red' },
];
export const columns = [
  {
    type: 'checkbox',
    field: 'checkbox',
    align: 'center',
    width: '50',
  },
  {
    type: 'seq',
    field: 'seq',
    align: 'center',
    width: '50',
  },
  {
    title: '线体编码',
    field: 'LineCode',
    width: '160',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '类型',
    field: 'LineTypeName',
    i18nField: 'LineTypeName',
    width: '100',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'ApiSelect',
    //   searchField: 'LineType',
    //   props: {
    //     api: () => baseStore.getDictionaryData('lineInfoType'),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     showSearch: true,
    //     apiSearch: {
    //       show: true,
    //       searchName: '',
    //     },
    //     filterOption: false,
    //     notFoundContent: null,
    //   },
    // },
  },
  {
    title: '所属厂区',
    field: 'FactoryAreaName',
    width: '140',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '生产车间',
    field: 'WorkshopCode',
    i18nField: 'WorkshopName',
    width: '140',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '物理位置',
    field: 'LocationArea',
    width: '140',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '线体名称',
    field: 'LineName',
    width: '160',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  // {
  //     title: '所属组织',
  //     field: 'OrgName'
  //  },
  {
    title: '机台',
    field: 'MachineListDisplay',
    width: '200',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '是否需要联机',
    field: 'NeedOnline',
    width: '140',
    cellRender: {
      name: 'Tag',
      options: onLineOptions,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: onLineOptions,
    },
    i18nField: 'NeedOnlineName',
  },
  {
    title: '是否联机',
    field: 'IsOnline',
    cellRender: {
      name: 'Tag',
      options: onLineOptions,
    },
    width: '140',
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: onLineOptions,
    },
    i18nField: 'IsOnlineName',
  },
  {
    title: '是否启用',
    field: 'Status',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    width: '140',
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: statusOptions,
    },
  },
  {
    title: '备注',
    field: 'Remark',
    width: '160',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建人',
    field: 'CreatorUserName',
    width: '180',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '创建时间',
    field: 'CreatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: '160',
  },
  {
    title: '修改人',
    field: 'LastModifyUserName',
    width: '180',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '修改时间',
    field: 'LastModifyTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: '160',
  },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const searchFormSchema = [
  {
    fieldName: 'factoryArea',
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
    fieldName: 'LineCode',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '线体编码', //'请输入线体编码',
    },
  },
  {
    fieldName: 'LineName',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '线体名称', //'请输入线体名称',
    },
  },
  {
    fieldName: 'lineType',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [],
      placeholder: '类型',
    },
    i18nField: 'LineTypeName',
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: ['开始时间', '结束时间'],
      width: '400px',
    },
  },
];
