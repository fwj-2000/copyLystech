import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import dayjs from 'dayjs';
import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
import { useBaseStore } from '/@/store/modules/base';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

const { t } = useI18n();
const baseStore = useBaseStore();

export const schema = [
  {
    fieldName: 'factoryArea',
    label: '',
    i18nField: 'factoryAreaName',
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
    fieldName: 'innerMaterialCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.TechInfoColumn.innerMaterialCode'),
    },
  },
  {
    fieldName: 'machineNo',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'machineNo',
        label: 'machineNo',
      },
      options: [],
      placeholder: t('dict.TechInfoColumn.machineNo'),
    },
  },
  // {
  //   fieldName: 'machineNo',
  //   label: '',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getMachinelCodeList,
  //     placeholder: t('dict.TechInfoColumn.machineNo'),
  //     resultField: 'data',
  //     labelField: 'machineNo',
  //     valueField: 'machineNo',
  //     filterOption: false,
  //     immediate: true,
  //     notFoundContent: null,
  //   },
  // },
  // {
  //   fieldName: 'techChange',
  //   label: '',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: () => {
  //         return baseStore.getDictionaryData('TechUpdateItem');
  //       },
  //     placeholder: t('dict.TechInfoColumn.techChange'),
  //     labelField: 'fullName',
  //     valueField: 'enCode',
  //     filterOption: false,
  //     notFoundContent: null,
  //     immediate: true,
  //   },
  // },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      allowClear: true,
    },
  },
];

export const columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    title: '技改编码',
    field: 'techChangeNo',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  {
    title: '机台号',
    field: 'machineNo',
    showOverflow: 'tooltip',
    minWidth: '160',
    i18nField: 'machineNo',
  },
  {
    title: '内部料号',
    field: 'innerMaterialCode',
    showOverflow: 'tooltip',
    minWidth: '160',
  },
  // {
  //   title: '技改项',
  //   field: 'techChange',
  //   showOverflow: 'tooltip',
  //   minWidth: '160',
  // },
  // {
  //   title: '状态',
  //   field: 'status',
  //   showOverflow: 'tooltip',
  //   minWidth: '160',
  //   sortable: true,
  //   filters: [{ data: '' }],
  //   filterRender: {
  //     name: 'Input',
  //   },
  //   slots: {
  //     default: 'status',
  //   },
  // },
  {
    title: '创建人',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    showOverflow: 'tooltip',
    minWidth: '160',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '修改人',
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    minWidth: '220',
  },
  {
    title: '修改时间',
    field: 'lastModifyTime',
    showOverflow: 'tooltip',
    minWidth: '160',
    // formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm:ss') : ''),
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 80,
    fixed: 'right',
  },
];
