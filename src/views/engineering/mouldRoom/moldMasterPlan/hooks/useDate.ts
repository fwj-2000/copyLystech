import dayjs from 'dayjs';
import { h } from 'vue';
import { getDayDetail } from '/@/utils/holidays';
import { useI18n } from '/@/hooks/web/useI18n';

export enum weekTextMap {
  星期一 = 'monday',
  星期二 = 'tuesday',
  星期三 = 'wednesday',
  星期四 = 'thursday',
  星期五 = 'friday',
  星期六 = 'saturday',
  星期日 = 'sunday',
}
export interface IdateResult {
  field: string;
  date: string;
  week: string;
  holidays: string;
  slots?: unknown;
  width?: string | number;
}

export const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const { t } = useI18n();

function getHolidayName(name) {
  try {
    const _holidays = name.split(',')[1];
    return _holidays;
  } catch (error) {
    return '';
  }
}

function getHolidayNameFn(current) {
  const dateStr = dayjs(current).format('YYYY-MM-DD');
  const { name, work } = getDayDetail(dateStr);
  const _holidays = getHolidayName(name);
  if (_holidays) {
    return work ? t('dict.CommonCol.supplementaryClasses') : _holidays;
  }
  return '';
}

function getDateRangeWithWeekdays(dateRange, showHolidays, format) {
  const [startStr, endStr] = dateRange;
  const startDate = dayjs(startStr);
  const endDate = dayjs(endStr);
  const datesArray: IdateResult[] = [];

  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const holidays = getHolidayNameFn(currentDate) || '';
    const days = currentDate.format(format);
    const weekText = `星期${weekdays[currentDate.day()]}`;

    const i18Week = t(`dict.CommonCol.${weekTextMap[weekText]}`);
    const htmlModel = h('div', [
      h('div', { class: 'header-week' }, i18Week),
      showHolidays
        ? h('div', { class: 'header-date' }, [h('div', days), h('div', { class: 'text-[#1890FF]' }, holidays ? `(${holidays})` : '')])
        : h('div', { class: 'header-date' }, [h('div', days)]),
    ]);
    datesArray.push({
      field: currentDate.format('YYYY-MM-DD'),
      date: currentDate.format('YYYY-MM-DD'),
      week: i18Week, // 使用自定义中文星期显示
      holidays,
      width: '90px',
      slots: {
        header() {
          return htmlModel;
        },
        default: 'dateField',
      },
    });
    currentDate = currentDate.add(1, 'day');
  }
  //   return JSON.parse(datesArray, null, 2);
  return datesArray;
}

export function useDate(dateRange: string[], showHolidays: boolean = true, format = 'DD') {
  const dateArray = getDateRangeWithWeekdays(dateRange, showHolidays, format);
  return { dateArray };
}
