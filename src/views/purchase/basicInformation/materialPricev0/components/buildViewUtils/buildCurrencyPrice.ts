import { divide, multiply, bignumber, BigNumber } from 'mathjs';

interface CurrencyPriceParams {
  materialWidth: number | string | null;
  materialLength: number | string | null;
  purchasingUnit: string | null;
  priceUnit: string | null;
  supplierUnitPriceBaseCurrency: number | string | null;
  supplierUnitPriceOriginalCurrency: number | string | null;
}

/**
 * 构建采购价格 (原币 本位币)
 * @param params 材料宽度、长度、采购单位、单价单位、单位价格（原币）、单位价格（本位币）
 * @returns [原币, 本位币]
 */
export function buildCurrencyPrice({
  materialWidth,
  materialLength,
  purchasingUnit,
  priceUnit,
  supplierUnitPriceBaseCurrency,
  supplierUnitPriceOriginalCurrency,
}: CurrencyPriceParams): [number, number] {
  const width: BigNumber = bignumber(materialWidth ?? 0);
  const length: BigNumber = bignumber(materialLength ?? 0);
  const unitPriceBaseCurrency: BigNumber = bignumber(supplierUnitPriceBaseCurrency ?? 0);
  const unitPriceOriginalCurrency: BigNumber = bignumber(supplierUnitPriceOriginalCurrency ?? 0);

  let supplierPriceBaseCurrency: BigNumber = bignumber(0);
  let supplierPriceOriginalCurrency: BigNumber = bignumber(0);

  const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  if (purchasingUnit === priceUnit) {
    supplierPriceBaseCurrency = unitPriceBaseCurrency;
    supplierPriceOriginalCurrency = unitPriceOriginalCurrency;
  } else if (purchasingUnit === 'ROLL' && priceUnit === 'M2') {
    supplierPriceBaseCurrency = multiply(unitPriceBaseCurrency, materialArea) as BigNumber;
    supplierPriceOriginalCurrency = multiply(unitPriceOriginalCurrency, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M2') {
    supplierPriceBaseCurrency = multiply(unitPriceBaseCurrency, materialArea) as BigNumber;
    supplierPriceOriginalCurrency = multiply(unitPriceOriginalCurrency, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M') {
    supplierPriceBaseCurrency = multiply(unitPriceBaseCurrency, length) as BigNumber;
    supplierPriceOriginalCurrency = multiply(unitPriceOriginalCurrency, length) as BigNumber;
  } else if (purchasingUnit == 'G' && priceUnit === 'KG') {
    supplierPriceBaseCurrency = divide(unitPriceBaseCurrency, 1000) as BigNumber;
    supplierPriceOriginalCurrency = divide(unitPriceOriginalCurrency, 1000) as BigNumber;
  } else if (purchasingUnit == 'KG' && priceUnit === 'G') {
    supplierPriceBaseCurrency = multiply(unitPriceBaseCurrency, 1000) as BigNumber;
    supplierPriceOriginalCurrency = multiply(unitPriceOriginalCurrency, 1000) as BigNumber;
  }

  return [parseFloat(supplierPriceBaseCurrency.toString()), parseFloat(supplierPriceOriginalCurrency.toString())];
}
