import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 获取当前的年-周
export function getWeekDays(yearWeek) {
  if (!yearWeek) {
    return [];
  }
  const weeksDayjs = dayjs(yearWeek);
  const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
  const [year, week] = yearWeekFormat.split('WK').map(Number);
  const monday = dayjs().year(year).isoWeek(week).day(1); // 直接定位到周一

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const titles = [
    t('dict.MasterDemandPlanColumn.monday'),
    t('dict.MasterDemandPlanColumn.tuesday'),
    t('dict.MasterDemandPlanColumn.wednesday'),
    t('dict.MasterDemandPlanColumn.thursday'),
    t('dict.MasterDemandPlanColumn.friday'),
    t('dict.MasterDemandPlanColumn.saturday'),
    t('dict.MasterDemandPlanColumn.sunday'),
  ];
  const result: any[] = [];

  for (let i = 0; i < 7; i++) {
    const date = monday.add(i, 'day');
    result.push({
      // title: `周${titles[i]}(${date.format('M月D日')})`,
      title: `${titles[i]}(${date.format('MM/DD')})`,
      field: days[i],
      width: 120,
      i18nField: 'DISABLED', //  不做翻译处理
    });
  }
  result.push({
    title: t('dict.MasterDemandPlanColumn.remark'),
    field: 'remark',
    width: 100,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  });

  return result;
}
