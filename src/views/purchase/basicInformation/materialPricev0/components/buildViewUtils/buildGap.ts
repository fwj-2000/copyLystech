import { add, divide, multiply, subtract, bignumber, BigNumber } from 'mathjs';

interface GapParams {
  materialWidth: number | string | null;
  materialLength: number | string | null;
  purchasingUnit: string | null;
  priceUnit: string | null;
  freightBaseCurrency: number | string | null;
  supplierUnitPriceBaseCurrency: number | string | null;
  priceOc2bcUntaxedPriceUnit: number | string | null;
}

/**
 * 构建Gap
 * @param params 材料宽度、长度、采购单位、单价单位、运费（本位币）、供应商单价（本位币）、未税到厂价（单价单位）
 * @returns Gap
 */
export function buildGap({
  materialWidth,
  materialLength,
  purchasingUnit,
  priceUnit,
  freightBaseCurrency,
  supplierUnitPriceBaseCurrency,
  priceOc2bcUntaxedPriceUnit,
}: GapParams): number {
  const width: BigNumber = bignumber(materialWidth ?? 0);
  const length: BigNumber = bignumber(materialLength ?? 0);
  const freight: BigNumber = bignumber(freightBaseCurrency ?? 0);
  const supplierPrice: BigNumber = bignumber(supplierUnitPriceBaseCurrency ?? 0);
  const untaxedPrice: BigNumber = bignumber(priceOc2bcUntaxedPriceUnit ?? 0);

  let freightBaseCurrencyPriceUnit: BigNumber = bignumber(0);
  const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  if (purchasingUnit === priceUnit) {
    freightBaseCurrencyPriceUnit = freight;
  } else if (purchasingUnit === 'ROLL' && priceUnit == 'M2') {
    freightBaseCurrencyPriceUnit = divide(freight, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M2') {
    freightBaseCurrencyPriceUnit = divide(freight, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M') {
    freightBaseCurrencyPriceUnit = divide(freight, length) as BigNumber;
  } else if (purchasingUnit == 'G' && priceUnit === 'KG') {
    freightBaseCurrencyPriceUnit = divide(freight, 1000) as BigNumber;
  } else if (purchasingUnit == 'KG' && priceUnit === 'G') {
    freightBaseCurrencyPriceUnit = multiply(freight, 1000) as BigNumber;
  }

  const sum: BigNumber = add(supplierPrice, freightBaseCurrencyPriceUnit);
  const gap: BigNumber = divide(subtract(sum, untaxedPrice), sum) as BigNumber;

  return parseFloat(gap.toFixed(6));
}
