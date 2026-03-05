import { useI18n } from '/@/hooks/web/useI18n';

export const datePickerProps = {
  value: [Number, String],
  format: { type: String, default: 'YYYY-MM-DD' },
  startTime: { type: Number, default: null },
  endTime: { type: Number, default: null },
  tooltip: {
    type: String,
    default: () => {
      const { t } = useI18n();
      return t('common.dateTimeZoneTooltip');
    },
  },
};
export const dateRangeProps = {
  value: { type: Array as PropType<number[] | string[]> },
  format: { type: String, default: 'YYYY-MM-DD' },
  startTime: { type: Number, default: null },
  endTime: { type: Number, default: null },
  placeholder: {
    type: Array,
    default: () => {
      const { t } = useI18n();
      return [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')];
    },
  },
  tooltip: {
    type: String,
    default: () => {
      const { t } = useI18n();
      return t('common.dateTimeZoneTooltip');
    },
  },
};
export const timePickerProps = {
  value: String,
  format: { type: String, default: 'HH:mm:ss' },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
};
export const timeRangeProps = {
  value: { type: Array as PropType<string[]> },
  format: { type: String, default: 'HH:mm:ss' },
  startTime: { type: String, default: null },
  endTime: { type: String, default: null },
  placeholder: {
    type: Array,
    default: () => {
      const { t } = useI18n();
      return [t('component.lydc.timeRange.startPlaceholder'), t('component.lydc.timeRange.endPlaceholder')];
    },
  },
};
