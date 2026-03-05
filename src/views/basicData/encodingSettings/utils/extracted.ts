import dayjs from 'dayjs';

export const extracted = str => {
  // 使用正则表达式匹配括号内的内容
  let match = str.match(/（(.*?)）/);
  return match ? match[1] : '';
};

export const dateFormat = (DateFormatOption, { DateFormat }) => {
  // if(DateFormat == 11 || DateFormat == 12 || DateFormat == 13 || DateFormat == 14) {
  // }
  if (DateFormat == 11) return dayjs().tz().format('YYYY');
  if (DateFormat == 12) return dayjs().tz().format('MM');
  if (DateFormat == 13) return dayjs().tz().format('DD');
  if (DateFormat == 14) return dayjs().tz().format('ww');
  return dayjs()
    .tz()
    .format(extracted(DateFormatOption.find(item => Number(item.enCode) === DateFormat).fullName));
};
