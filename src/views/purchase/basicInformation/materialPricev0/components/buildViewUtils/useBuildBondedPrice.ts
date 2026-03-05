import { add, divide, multiply, bignumber, BigNumber } from 'mathjs';

interface BondedPriceParams {
  materialWidth: number | string | null;
  materialLength: number | string | null;
  purchasingUnit: string | null;
  priceUnit: string | null;
  supplierPriceOriginalCurrency: number | string | null;
  reservedBuffer: number | string | null;
  freightOriginalCurrency: number | string | null;
  exchangeRate: number | string | null;
  tariff: number | string | null;
}

/**
 * 构建保税价
 * @param params 参数对象，包括材料宽度、长度、采购单位、单价单位、原币采购价格、预留Buffer%、运费、汇率和关税
 * @returns [保税价(采购单位), 保税价(单价单位)]
 */
export function useBuildBondedPrice({
  materialWidth,
  materialLength,
  purchasingUnit,
  priceUnit,
  supplierPriceOriginalCurrency,
  reservedBuffer,
  freightOriginalCurrency,
  exchangeRate,
  tariff,
}: BondedPriceParams): [number, number] {
  const width: BigNumber = bignumber(materialWidth ?? 0);
  const length: BigNumber = bignumber(materialLength ?? 0);
  const supplierPrice: BigNumber = bignumber(supplierPriceOriginalCurrency ?? 0);
  const buffer: BigNumber = bignumber(reservedBuffer ?? 0);
  const freight: BigNumber = bignumber(freightOriginalCurrency ?? 0);
  const rate: BigNumber = bignumber(exchangeRate ?? 0);
  const tariffRate: BigNumber = bignumber(tariff ?? 50);

  let bondedPriceNonM2: BigNumber = bignumber(0);
  let bondedPricePriceUnit: BigNumber = bignumber(0);
  const materialArea: BigNumber = divide(multiply(width, length), 1000) as BigNumber;

  const bufferMultiplier: BigNumber = add(1, divide(buffer, 100)) as BigNumber;

  if (tariffRate.gte(10)) {
    bondedPriceNonM2 = multiply(add(multiply(multiply(supplierPrice, 1.03), bufferMultiplier), freight), rate) as BigNumber;
  } else {
    bondedPriceNonM2 = multiply(add(multiply(multiply(supplierPrice, 1.02), bufferMultiplier), freight), rate) as BigNumber;
  }

  if (purchasingUnit === priceUnit) {
    bondedPricePriceUnit = bondedPriceNonM2;
  } else if (purchasingUnit === 'M2') {
    bondedPricePriceUnit = divide(bondedPriceNonM2, materialArea) as BigNumber;
  } else if (purchasingUnit === 'M') {
    bondedPricePriceUnit = divide(bondedPriceNonM2, length) as BigNumber;
  } else if (purchasingUnit === 'G' && priceUnit === 'KG') {
    bondedPricePriceUnit = multiply(bondedPriceNonM2, 1000) as BigNumber;
  } else if (purchasingUnit === 'KG' && priceUnit === 'G') {
    bondedPricePriceUnit = divide(bondedPriceNonM2, 1000) as BigNumber;
  }

  return [parseFloat(bondedPriceNonM2.toFixed(6)), parseFloat(bondedPricePriceUnit.toFixed(6))];
}
