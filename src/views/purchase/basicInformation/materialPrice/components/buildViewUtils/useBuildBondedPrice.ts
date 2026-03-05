/*
 * @Author: wenzhenjin
 * @Date: 2024-11-13 09:44:45
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2026-01-22 17:36:20
 * @FilePath: \lydc.server.web\src\views\purchase\basicInformation\materialPrice\components\buildViewUtils\useBuildBondedPrice.ts
 */
import { add, divide, multiply, bignumber, BigNumber } from 'mathjs';

interface BondedPriceParams {
  materialWidth: NumericValue;
  materialLength: NumericValue;
  purchasingUnit: string | null;
  priceUnit: string | null;
  supplierPriceOriginalCurrency: NumericValue;
  reservedBuffer: NumericValue;
  freightOriginalCurrency: NumericValue;
  exchangeRate: NumericValue;
  tariff: NumericValue;
  baseCurrencyChecked: boolean | string | null;
  originalCurrencyChecked: boolean | string | null;
}

/**
 * 构建保税价
 * @param params 参数对象，包括材料宽度、长度、采购单位、单价单位、原币采购价格、预留Buffer%、运费、汇率和关税
 * @returns [保税价(采购单位), 保税价(单价单位)]
 */
export function useBuildBondedPrice({
  // materialWidth,
  // materialLength,
  // purchasingUnit,
  // priceUnit,
  supplierPriceOriginalCurrency,
  reservedBuffer,
  freightOriginalCurrency,
  exchangeRate,
  tariff,
}: // baseCurrencyChecked,
// originalCurrencyChecked,
BondedPriceParams): [number, number] {
  // const width: BigNumber = bignumber(materialWidth || 0);
  // const length: BigNumber = bignumber(materialLength || 0);
  const supplierPrice: BigNumber = bignumber(supplierPriceOriginalCurrency || 0);
  const buffer: BigNumber = bignumber(reservedBuffer || 0);
  const freight: BigNumber = bignumber(freightOriginalCurrency || 0);
  const rate: BigNumber = bignumber(exchangeRate || 0);
  const tariffRate: BigNumber = bignumber(tariff || 50);

  // if(!(baseCurrencyChecked && originalCurrencyChecked)) return [null, null]
  // if (!originalCurrencyChecked) return [null, null];

  let bondedPriceNonM2: BigNumber;
  // let bondedPricePriceUnit: BigNumber = bignumber(0);
  // const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  const bufferMultiplier: BigNumber = add(1, divide(buffer, 100)) as BigNumber;

  if (tariffRate.gte(10)) {
    bondedPriceNonM2 = multiply(add(multiply(multiply(supplierPrice, 1.03), bufferMultiplier), freight), rate) as BigNumber;
  } else {
    bondedPriceNonM2 = multiply(add(multiply(multiply(supplierPrice, 1.02), bufferMultiplier), freight), rate) as BigNumber;
  }

  // if (purchasingUnit === priceUnit) {
  //   bondedPricePriceUnit = bondedPriceNonM2;
  // } else if (purchasingUnit === 'M2') {
  //   bondedPricePriceUnit = divide(bondedPriceNonM2, materialArea) as BigNumber;
  // } else if (purchasingUnit === 'M') {
  //   bondedPricePriceUnit = divide(bondedPriceNonM2, length) as BigNumber;
  // } else if (purchasingUnit === 'G' && priceUnit === 'KG') {
  //   bondedPricePriceUnit = multiply(bondedPriceNonM2, 1000) as BigNumber;
  // } else if (purchasingUnit === 'KG' && priceUnit === 'G') {
  //   bondedPricePriceUnit = divide(bondedPriceNonM2, 1000) as BigNumber;
  // }

  // return [parseFloat(bondedPriceNonM2.toFixed(6)), parseFloat(bondedPricePriceUnit.toFixed(6))];
  return [Number.parseFloat(bondedPriceNonM2.toFixed(6)), Number.parseFloat(bondedPriceNonM2.toFixed(6))];
}
