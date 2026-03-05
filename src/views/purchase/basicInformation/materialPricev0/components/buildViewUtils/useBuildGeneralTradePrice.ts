import { add, divide, multiply, bignumber, BigNumber } from 'mathjs';

interface GeneralTradePriceParams {
  materialWidth: number | string | null;
  materialLength: number | string | null;
  purchasingUnit: string | null;
  priceUnit: string | null;
  suggestedPurchaseCurrency: string | null;
  priceOc2bcUntaxedPurchasingUnit: number | string | null;
  reservedBuffer: number | string | null;
  supplierPriceBaseCurrency: number | string | null;
  freightBaseCurrency: number | string | null;
}

/**
 * 构建一般贸易价
 * @param params 参数对象，包括材料宽度、长度、采购单位、单价单位、建议采购币别、原币转本位币未税到厂价、预留Buffer%、本位币采购价格和运费
 * @returns [一般贸易价（采购单位），一般贸易价（单价单位）]
 */
export function useBuildGeneralTradePrice({
  materialWidth,
  materialLength,
  purchasingUnit,
  priceUnit,
  suggestedPurchaseCurrency,
  priceOc2bcUntaxedPurchasingUnit,
  reservedBuffer,
  supplierPriceBaseCurrency,
  freightBaseCurrency,
}: GeneralTradePriceParams): [number, number] {
  const width: BigNumber = bignumber(materialWidth ?? 0);
  const length: BigNumber = bignumber(materialLength ?? 0);
  const untaxedPurchasingUnit: BigNumber = bignumber(priceOc2bcUntaxedPurchasingUnit ?? 0);
  const buffer: BigNumber = bignumber(reservedBuffer ?? 0);
  const supplierPrice: BigNumber = bignumber(supplierPriceBaseCurrency ?? 0);
  const freight: BigNumber = bignumber(freightBaseCurrency ?? 0);
  const currency: string = suggestedPurchaseCurrency ?? 'CNY';

  let generalTradePriceNonM2: BigNumber = bignumber(0);
  let generalTradePricePriceUnit: BigNumber = bignumber(0);
  const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  const bufferMultiplier: BigNumber = add(1, divide(buffer, 100)) as BigNumber;

  if (currency === 'USD') {
    generalTradePriceNonM2 = multiply(untaxedPurchasingUnit, bufferMultiplier) as BigNumber;
  } else {
    generalTradePriceNonM2 = add(multiply(supplierPrice, bufferMultiplier), freight) as BigNumber;
  }

  if (purchasingUnit === priceUnit) {
    generalTradePricePriceUnit = generalTradePriceNonM2;
  } else if (purchasingUnit === 'M2') {
    generalTradePricePriceUnit = divide(generalTradePriceNonM2, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M') {
    generalTradePricePriceUnit = divide(generalTradePriceNonM2, length) as BigNumber;
  } else if (purchasingUnit === 'G' && priceUnit === 'KG') {
    generalTradePricePriceUnit = multiply(generalTradePriceNonM2, 1000) as BigNumber;
  } else if (purchasingUnit === 'KG' && priceUnit === 'G') {
    generalTradePricePriceUnit = divide(generalTradePriceNonM2, 1000) as BigNumber;
  }

  return [parseFloat(generalTradePriceNonM2.toFixed(6)), parseFloat(generalTradePricePriceUnit.toFixed(6))];
}
