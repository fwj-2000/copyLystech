// 构建最终料号
export default function buildPartNumber(calcWidth: string, width: number, eightCode: string, materialCode: string): string {
  if (['YPL00000', 'YPL00001', 'YPL00002'].includes(eightCode)) {
    // 材料填写栏位，当材料8码出现'YPL00000'时，查询结果和材料料号统一写为：'600-YPL00000-0001'，后四位不做宽度转换
    return `600-${eightCode}-0001`;
  }

  const retNum = Number(calcWidth) - width;

  let partNumber = '';
  if (retNum > 3) {
    partNumber = `600-${eightCode}-${(width || calcWidth || '0000')?.toString()?.padStart(4, '0')}`;
  } else {
    if (!materialCode) return '';
    const [startCode, eightCode, calcWidth] = materialCode?.split('-');
    partNumber = `${startCode}-${eightCode}-${(width || calcWidth || '0000')?.toString()?.padStart(4, '0')}`;
  }
  // 如果原料号有后四位，则保留最后一部分
  if (materialCode.split('-').length == 4) {
    partNumber += `-${materialCode.split('-')[3]}`;
  }
  return partNumber;
}
