import Arrangement from './arrangement';
// 类型定义
type TDateObject = {
  month: number;
  day: number;
};

type THolidayConfig = {
  name: string;
  type: keyof Arrangement; // 对应 Arrangement 的方法名
  rest: {
    start: string;
    end: string;
  };
  work: string[];
  ignore: string[];
  note?: string;
};

type TYearHolidays = {
  year: number;
  holidays: THolidayConfig[];
};

const chineseHolidays: TYearHolidays[] = [
  // /**
  //  * 2025
  //  * https://www.gov.cn/zhengce/zhengceku/202411/content_6986383.htm
  //  * 一、元旦：1月1日（周三）放假1天，不调休。
  //  * 二、春节：1月28日（农历除夕、周二）至2月4日（农历正月初七、周二）放假调休，共8天。1月26日（周日）、2月8日（周六）上班。
  //  * 三、清明节：4月4日（周五）至6日（周日）放假，共3天。
  //  * 四、劳动节：5月1日（周四）至5日（周一）放假调休，共5天。4月27日（周日）上班。
  //  * 五、端午节：5月31日（周六）至6月2日（周一）放假，共3天。
  //  * 六、国庆节、中秋节：10月1日（周三）至8日（周三）放假调休，共8天。9月28日（周日）、10月11日（周六）上班。
  //  */
  {
    year: 2025,
    holidays: [
      { name: '元旦', type: 'ny', rest: { start: '1-1', end: '1-1' }, work: [], ignore: [] },
      { name: '春节', type: 's', rest: { start: '1-28', end: '2-4' }, work: ['1-26', '2-8'], ignore: ['2-3', '2-4'] },
      { name: '清明节', type: 't', rest: { start: '4-4', end: '4-6' }, work: [], ignore: [] },
      { name: '劳动节', type: 'l', rest: { start: '5-1', end: '5-5' }, work: ['4-27'], ignore: ['5-5'] },
      { name: '端午节', type: 'd', rest: { start: '5-31', end: '6-2' }, work: [], ignore: [] },
      { name: '国庆', type: 'n', rest: { start: '10-1', end: '10-8' }, work: ['9-28', '10-11'], ignore: ['10-7', '10-8'] },
      { name: '中秋', type: 'm', rest: { start: '10-6', end: '10-6' }, work: [], ignore: [] },
    ],
  },
  // /**
  //  * 2024
  //  * https://www.gov.cn/zhengce/content/202310/content_6911527.htm
  //  * 一、元旦：1月1日放假，与周末连休。
  //  * 二、春节：2月10日至17日放假调休，共8天。2月4日（星期日）、2月18日（星期日）上班。
  //  * 三、清明节：4月4日至6日放假调休，共3天。4月7日（星期日）上班。
  //  * 四、劳动节：5月1日至5日放假调休，共5天。4月28日（星期日）、5月11日（星期六）上班。
  //  * 五、端午节：6月10日放假，与周末连休。
  //  * 六、中秋节：9月15日至17日放假调休，共3天。9月14日（星期六）上班。
  //  * 七、国庆节：10月1日至7日放假调休，共7天。9月29日（星期日）、10月12日（星期六）上班。
  //  */
  {
    year: 2024,
    holidays: [
      { name: '元旦', type: 'ny', rest: { start: '1-1', end: '1-1' }, work: [], ignore: [] },
      { name: '春节', type: 's', rest: { start: '2-10', end: '2-17' }, work: ['2-4', '2-18'], ignore: ['2-15', '2-16'] },
      { name: '清明节', type: 't', rest: { start: '4-4', end: '4-6' }, work: ['4-7'], ignore: ['4-5'] },
      { name: '劳动节', type: 'l', rest: { start: '5-1', end: '5-5' }, work: ['4-28', '5-11'], ignore: ['5-2', '5-3'] },
      { name: '端午节', type: 'd', rest: { start: '6-10', end: '6-10' }, work: [], ignore: [] },
      { name: '国庆', type: 'n', rest: { start: '10-1', end: '10-7' }, work: ['9-29', '10-12'], ignore: ['10-4', '10-7'] },
      { name: '中秋', type: 'm', rest: { start: '9-15', end: '9-17' }, work: ['9-14'], ignore: ['9-16'] },
    ],
  },
];

function getMounth(date: string): string {
  return date.split('-')[0];
}
function getDay(date: string): string {
  return date.split('-')[1];
}

function applyHolidayConfig(arrangement: any, config: TYearHolidays[]): void {
  config.forEach(yearConfig => {
    const arr: any = arrangement.y(yearConfig.year);
    yearConfig.holidays.forEach(holiday => {
      const method = arr[holiday.type]();
      const start_month = getMounth(holiday.rest.start);
      const start_day = getDay(holiday.rest.start);
      const end_month = getMounth(holiday.rest.end);
      const end_day = getDay(holiday.rest.end);
      // 处理休息日范围
      method.r(start_month, start_day);
      if (start_month !== end_month || start_day !== end_day) {
        method.to(end_month, end_day);
      }

      // 处理调休工作日
      holiday.work.forEach(date => {
        method.w(getMounth(date), getDay(date));
      });

      // 处理无需调休的日期
      holiday.ignore.forEach(date => {
        method.i(getMounth(date), getDay(date));
      });
    });
  });
}

export default () => {
  const arrangement = new Arrangement();
  applyHolidayConfig(arrangement, chineseHolidays);

  return {
    holidays: arrangement.holidays,
    workdays: arrangement.workdays,
    inLieuDays: arrangement.inLieuDays,
  };
};
