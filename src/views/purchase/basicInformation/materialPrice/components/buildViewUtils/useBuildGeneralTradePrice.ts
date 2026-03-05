/*
 * @Author: wenzhenjin
 * @Date: 2024-11-13 09:44:45
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2026-01-23 08:54:57
 * @FilePath: \lydc.server.web\src\views\purchase\basicInformation\materialPrice\components\buildViewUtils\useBuildGeneralTradePrice.ts
 */
import { add, divide, multiply, bignumber, BigNumber, chain } from 'mathjs';
import { isNullOrUnDef } from '/@/utils/is';

interface GeneralTradePriceParams {
  materialWidth: NumericValue;
  materialLength: NumericValue;
  purchasingUnit: string | null;
  priceUnit: string | null;
  suggestedPurchaseCurrency: string | null;
  priceOc2bcUntaxedPurchasingUnit: NumericValue;
  reservedBuffer: NumericValue;
  supplierPriceBaseCurrency: NumericValue;
  freightBaseCurrency: NumericValue;
  tariff: NumericValue;
  exchangeRate: NumericValue;
  supplierUnitPriceOriginalCurrency: NumericValue;
  freightOriginalCurrency: NumericValue;
}

/**
 * 构建一般贸易价 一般贸易价 = 单位单价*(1+Buffer比例）+ 运费
 * @param params 参数对象，包括材料宽度、长度、采购单位、单价单位、建议采购币别、原币转本位币未税到厂价、预留Buffer%、本位币采购价格和运费
 * @returns [一般贸易价（采购单位），一般贸易价（单价单位）]
 */
export function useBuildGeneralTradePrice({
  // materialWidth,
  // materialLength,
  // purchasingUnit,
  // priceUnit,
  suggestedPurchaseCurrency,
  // priceOc2bcUntaxedPurchasingUnit,
  reservedBuffer,
  supplierPriceBaseCurrency,
  freightBaseCurrency,
  tariff,
  exchangeRate,
  supplierUnitPriceOriginalCurrency,
  freightOriginalCurrency,
}: GeneralTradePriceParams): [number | null, number | null] {
  // const width: BigNumber = bignumber(materialWidth || 0);
  // const length: BigNumber = bignumber(materialLength || 0);
  // const untaxedPurchasingUnit: BigNumber = bignumber(priceOc2bcUntaxedPurchasingUnit || 0);
  const buffer: BigNumber = bignumber(reservedBuffer || 0);
  const supplierPrice: BigNumber = bignumber(supplierPriceBaseCurrency || 0); // 单位单价
  let freight: BigNumber = bignumber(freightBaseCurrency || 0);
  const currency: string = suggestedPurchaseCurrency || 'CNY'; // 运费

  let generalTradePriceNonM2: BigNumber;
  // let generalTradePricePriceUnit: BigNumber = bignumber(0);
  // const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;
  // 1 + buffer%
  const bufferMultiplier: BigNumber = add(1, divide(buffer, 100)) as BigNumber;
  // 1 + tariff
  const tariffMultiplier: BigNumber = add(1, divide(bignumber(tariff || 0), 100)) as BigNumber;

  if (currency === 'USD') {
    if (isNullOrUnDef(freightOriginalCurrency)) return [null, null];
    console.log('🚀 ~ originalCurrencyChecked:', freightOriginalCurrency);

    freight = bignumber(freightOriginalCurrency);
    // 一般贸易价=单位单价*（1+buffer%）*（1+关税%）+运费 *汇率，取系统汇率，取采购手填的关税
    // 保税价=单位单价*（1+buffer%）*汇率+运费，取系统汇率

    console.log('🚀 ~ bufferMultiplier:', bufferMultiplier.toFixed(5));
    console.log('🚀 ~ exchangeRate:', exchangeRate.toFixed(5));
    console.log('🚀 ~ freight:', freight.toFixed(5));
    console.log('🚀 ~ tariffMultiplier:', tariffMultiplier.toFixed(5));
    console.log('🚀 ~ supplierUnitPriceOriginalCurrency:', supplierUnitPriceOriginalCurrency);
    generalTradePriceNonM2 = chain(bignumber(supplierUnitPriceOriginalCurrency))
      .multiply(tariffMultiplier)
      .add(freight)
      .multiply(bignumber(exchangeRate))
      .multiply(bufferMultiplier)
      .done() as BigNumber;
  } else {
    generalTradePriceNonM2 = add(multiply(supplierPrice, bufferMultiplier), freight) as BigNumber;
  }

  // if (purchasingUnit === priceUnit) {
  //   generalTradePricePriceUnit = generalTradePriceNonM2;
  // } else if (purchasingUnit === 'M2') {
  //   generalTradePricePriceUnit = divide(generalTradePriceNonM2, materialArea) as BigNumber;
  // } else if (purchasingUnit === 'M') {
  //   generalTradePricePriceUnit = divide(generalTradePriceNonM2, length) as BigNumber;
  // } else if (purchasingUnit === 'G' && priceUnit === 'KG') {
  //   generalTradePricePriceUnit = multiply(generalTradePriceNonM2, 1000) as BigNumber;
  // } else if (purchasingUnit === 'KG' && priceUnit === 'G') {
  //   generalTradePricePriceUnit = divide(generalTradePriceNonM2, 1000) as BigNumber;
  // }

  // return [parseFloat(generalTradePriceNonM2.toFixed(6)), parseFloat(generalTradePricePriceUnit.toFixed(6))];
  return [Number.parseFloat(generalTradePriceNonM2.toFixed(6)), Number.parseFloat(generalTradePriceNonM2.toFixed(6))];
}
