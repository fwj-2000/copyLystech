import { bignumber, divide, multiply, number, BigNumber } from 'mathjs';

interface MaterialDimensions {
  materialLength: number | string | null;
  materialWidth: number | string | null;
}

/**
 * 计算面积
 * @param dimensions 材料的长度和宽度
 * @returns 面积，保留6位小数
 */
export function buildArea({ materialLength, materialWidth }: MaterialDimensions): number {
  const length: BigNumber = bignumber(materialLength || 1);
  const width: BigNumber = bignumber(materialWidth || 1);

  const area: BigNumber = multiply(length, divide(width, 1000)) as BigNumber;
  return Number.parseFloat(number(area).toFixed(6));
}
