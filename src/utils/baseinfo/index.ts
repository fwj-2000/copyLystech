import dayjs from 'dayjs';

export function toVal(item, source) {
  if (!source) return '/';
  const _val = source[item.dataIndex];
  if (item.sign) {
    return _val + item.sign + source[item.extra];
  }
  if (_val && item.format) {
    const { format } = item;
    if (format.startsWith('date')) {
      return dayjs(_val).format(format.split('|')[1]);
    }
  }
  return _val || '/';
}
