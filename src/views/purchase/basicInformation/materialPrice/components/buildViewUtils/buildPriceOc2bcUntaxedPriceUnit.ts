import { divide, multiply, bignumber, BigNumber } from 'mathjs';

interface PriceParams {
  materialWidth: NumericValue;
  materialLength: NumericValue;
  purchasingUnit: string | null;
  priceUnit: string | null;
  priceOc2bcUntaxedPurchasingUnit: NumericValue;
}

/**
 * 构建未税到厂价(单价单位)
 * @param params 材料宽度、长度、采购单位、单价单位、未税到厂价(采购单位)
 * @returns 未税到厂价(单价单位)
 */
export function buildPriceOc2bcUntaxedPriceUnit({
  materialWidth,
  materialLength,
  purchasingUnit,
  priceUnit,
  priceOc2bcUntaxedPurchasingUnit,
}: PriceParams): number {
  const width: BigNumber = bignumber(materialWidth || 0);
  const length: BigNumber = bignumber(materialLength || 0);
  const untaxedPurchasingUnit: BigNumber = bignumber(priceOc2bcUntaxedPurchasingUnit || 0);

  let priceOc2bcUntaxedPriceUnit: BigNumber = bignumber(0);
  const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  if (purchasingUnit === priceUnit) {
    priceOc2bcUntaxedPriceUnit = untaxedPurchasingUnit;
  } else if (purchasingUnit === 'ROLL' && priceUnit === 'M2') {
    priceOc2bcUntaxedPriceUnit = divide(untaxedPurchasingUnit, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M2') {
    priceOc2bcUntaxedPriceUnit = divide(untaxedPurchasingUnit, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M') {
    priceOc2bcUntaxedPriceUnit = divide(untaxedPurchasingUnit, length) as BigNumber;
  } else if (purchasingUnit === 'G' && priceUnit === 'KG') {
    priceOc2bcUntaxedPriceUnit = divide(untaxedPurchasingUnit, 1000) as BigNumber;
  } else if (purchasingUnit === 'KG' && priceUnit === 'G') {
    priceOc2bcUntaxedPriceUnit = multiply(untaxedPurchasingUnit, 1000) as BigNumber;
  }

  return Number.parseFloat(priceOc2bcUntaxedPriceUnit.toFixed(6));
}
