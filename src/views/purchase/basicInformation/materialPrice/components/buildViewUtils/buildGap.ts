/*
 * @Author: wenzhenjin
 * @Date: 2024-11-13 09:44:45
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2026-01-22 17:28:18
 * @FilePath: \lydc.server.web\src\views\purchase\basicInformation\materialPrice\components\buildViewUtils\buildGap.ts
 */
import { add, divide, multiply, subtract, bignumber, BigNumber } from 'mathjs';

interface GapParams {
  materialWidth: NumericValue;
  materialLength: NumericValue;
  purchasingUnit: string | null;
  priceUnit: string | null;
  freightBaseCurrency: NumericValue;
  supplierUnitPriceBaseCurrency: NumericValue;
  priceOc2bcUntaxedPriceUnit: NumericValue;
  baseCurrencyChecked: boolean | string | null;
  originalCurrencyChecked: boolean | string | null;
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
  baseCurrencyChecked,
  originalCurrencyChecked,
}: GapParams): Nullable<number> {
  const width: BigNumber = bignumber(materialWidth || 0);
  const length: BigNumber = bignumber(materialLength || 0);
  const freight: BigNumber = bignumber(freightBaseCurrency || 0);
  const supplierPrice: BigNumber = bignumber(supplierUnitPriceBaseCurrency || 0);
  const untaxedPrice: BigNumber = bignumber(priceOc2bcUntaxedPriceUnit || 0);

  if (!(baseCurrencyChecked && originalCurrencyChecked)) return null;

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

  // 公式改为 美元 VS 人民币Gap(%): 【(美元转人民币到厂价(单位单价)-人民币（单位单价）】/人民币（单位单价）
  // 【人民币（单位单价）+人民币运费-(美元转人民币到厂价(单位单价)】/【人民币（单位单价）+人民币运费】
  const sum: BigNumber = add(supplierPrice, freightBaseCurrencyPriceUnit);
  const gap: BigNumber = multiply(divide(subtract(sum, untaxedPrice), sum), 100) as BigNumber;

  // return parseFloat(gap.toFixed(6));
  return Number.parseFloat(gap.toFixed(2));
}
