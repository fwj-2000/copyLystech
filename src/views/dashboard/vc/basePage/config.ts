import { IS_ENABLE_LIST, IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { transThouIntEx } from '/@/views/dataAnalysis/utils';

export const formSchema = [
  // {
  //   label: '',
  //   fieldName: 'factoryCode',
  //   i18nField: 'factory',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     placeholder: '工厂',
  //     api: getFactorysList,
  //     showSearch: true,
  //     apiSearch: {
  //       show: true,
  //       searchName: 'factoryCode',
  //     },
  //     resultField: 'data',
  //     labelField: 'Name',
  //     valueField: 'Code',
  //     immediate: true,
  //     nameFormat: ['Name', '/', 'Code'],
  //   },
  // },

  {
    label: '',
    fieldName: 'project',
    // i18nField: 'creatorUserName',
    component: 'Input',
    componentProps: {
      // placeholder: '项目',
    },
  },
  {
    label: '',
    fieldName: 'processe',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.SnTraceColumn.processName'), //'工序',
    },
  },
  {
    label: '',
    fieldName: 'itemNumber',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.FillingBillCustomerTemplate.MPNO'), //'料号',
    },
  },
  // {
  //   label: '',
  //   fieldName: 'targetYieldRateStart',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '标准良率开始',
  //   },
  // },
  // {
  //   label: '',
  //   fieldName: 'targetYieldRateEnd',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '标准良率结束',
  //   },
  // },
  {
    label: '',
    fieldName: 'isCriticalProcess',
    component: 'Select',
    componentProps: {
      placeholder: t('basePage.isCriticalProcess'), //'是否关键工序',
      options: [
        { label: t('dict.isAssembleName.1'), value: '1' },
        { label: t('dict.isAssembleName.2'), value: '2' },
      ],
      allowClear: true,
    },
  },
];

export const columnsVxe = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  {
    field: 'Project',
    title: '项目',
    width: 60,
  },

  {
    field: 'Processe',
    title: '工序',
    width: 80,
  },
  {
    field: 'Sequence',
    width: 50,
    title: '次序',
  },
  {
    width: 150,
    field: 'ItemNumber',
    title: '料号',
  },
  {
    width: 80,
    field: 'StandardCapacity',
    title: '标准产能',
    formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
  },
  {
    field: 'IsCriticalProcess',
    title: '是否关键工序',
    cellRender: {
      name: 'Tag',
      options: IS_YSE_LIST,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'VxeSelect',
      options: IS_YSE_LIST,
    },
    width: 120,
  },
  {
    field: 'TargetYieldRate',
    title: '目标良率',
    width: 80,
    formatter: ({ cellValue }) => transThouIntEx(cellValue, '%', 0, true),
  },

  {
    field: 'CreatorUserId',
    title: '创建人',
    width: 100,
  },
  {
    field: 'CreatorTime',
    title: '创建时间',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },

    width: 120,
  },

  {
    field: 'LastModifyUserId',
    title: '修改人',

    width: 100,
  },
  {
    field: 'LastModifyTime',
    title: '修改时间',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },

    width: 120,
  },
  {
    title: '操作',
    field: 'action',
    width: 80,
    fixed: 'right',
    slots: { default: 'action' },
  },
];

export const uploadButtonList = [
  {
    api: '/api/report/heatdissi/importBase',
    buttonText: t('common.importText'),
  },
];
