import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 主页form配置
export const schema = [
  {
    fieldName: 'product',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品',
      allowClear: true,
    },
  },
  {
    fieldName: 'serialNumbers',
    label: '',
    component: 'Textarea',
    componentProps: {
      placeholder: 'SN',
      allowClear: true,
      rows: 1,
    },
  },
  {
    // 结果
    fieldName: 'result',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [
        { code: 'OK', name: 'OK' }, // 待发送
        { code: 'NG', name: 'NG' }, // 发送中
      ],
      placeholder: t('common.result'),
      allowClear: true,
    },
  },
  {
    fieldName: 'sNLevel',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '等级',
      allowClear: true,
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    defaultValue: [dayjs().subtract(1, 'days'), dayjs()],
    componentProps: {
      format: 'YYYY-MM-DD HH:mm',
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
  },
];

// 主页表格column配置
export const column = [];
