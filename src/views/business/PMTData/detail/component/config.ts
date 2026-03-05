import { getFactoryList } from '/@/api/basicData/factory';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const schemas = [
  {
    label: '',
    fieldName: 'prjCode',
    component: 'Input',
    componentProps: {
      placeholder: '项目代号(内部)',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'tmlCusPrjCode',
    component: 'Input',
    componentProps: {
      placeholder: '项目代号(终端)',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
      api: getFactoryList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
    },
  },
  {
    label: '',
    fieldName: 'time',
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      submitOnPressEnter: true,
      placeholder: [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')],
    },
  },
  // 阶段
  {
    fieldName: 'stage',
    label: '',
    component: 'Input',
    componentProps: { placeholder: t('dict.PMTData.stage'), allowClear: true },
  },
];
