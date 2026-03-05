/**
 * @description 获取zdmbtrRange值, 映射金额区间
 */
export const getZdmbtrRangeValue = (zdmbtrRange: string) => {
  return {
    '10W': '0-10W',
    '30W': '20-30W',
    '40W': '30-40W',
    '50W': '40-50W',
    '60W': '50-60W',
    '70W': '60-70W',
    '80W': '70-80W',
    '90W': '80-90W',
    '100W': '90-100W',
    '100W以上': '100W以上',
  }[zdmbtrRange];
};
