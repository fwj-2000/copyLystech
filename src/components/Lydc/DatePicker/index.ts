import { withInstall } from '/@/utils';
import DatePicker from './src/DatePicker.vue';
import DateRange from './src/DateRange.vue';
import TimePicker from './src/TimePicker.vue';
import TimeRange from './src/TimeRange.vue';

export const LydcDatePicker = withInstall(DatePicker);
export const LydcDateRange = withInstall(DateRange);
export const LydcTimePicker = withInstall(TimePicker);
export const LydcTimeRange = withInstall(TimeRange);
