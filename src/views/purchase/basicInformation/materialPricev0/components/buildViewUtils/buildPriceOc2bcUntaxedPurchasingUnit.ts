import { add, divide, multiply, bignumber, BigNumber } from 'mathjs';

interface PriceParams {
  supplierPriceOriginalCurrency: number | string | null;
  freightOriginalCurrency: number | string | null;
  tariff: number | string | null;
  exchangeRate: number | string | null;
}

/**
 * 构建未税到厂价(采购单位)
 * @param params 参数对象，包括采购单位原币单价、采购单位原币运费、关税和汇率
 * @returns 未税到厂价(采购单位)
 */
export function buildPriceOc2bcUntaxedPurchasingUnit({ supplierPriceOriginalCurrency, freightOriginalCurrency, tariff, exchangeRate }: PriceParams): number {
  const supplierPrice: BigNumber = bignumber(supplierPriceOriginalCurrency ?? 0);
  const freight: BigNumber = bignumber(freightOriginalCurrency ?? 0);
  const tariffRate: BigNumber = bignumber(tariff ?? 50);
  const rate: BigNumber = bignumber(exchangeRate ?? 0);

  // （供应商报价USD中库存单位单价 * 汇率） * （1 + 关税）+（供应商报价USD中运费 * 汇率）
  const priceBeforeTax: BigNumber = add(multiply(multiply(supplierPrice, rate), add(1, divide(tariffRate, 100))), multiply(freight, rate)) as BigNumber;

  return parseFloat(priceBeforeTax.toFixed(6));
}
