/*
 * @Author: wenzhenjin
 * @Date: 2025-05-21 09:24:24
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-23 09:45:40
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Process\buildTheoreticalManufacturingCost.ts
 */
import { bignumber, chain, format } from 'mathjs';
import { isComputableArray } from '/@/utils/is';
/**
 * 计算理论制造成本
 * ((设备工费率/产能)+人工成本)/稼动率
 */
export function calculateTheoreticalManufacturingCost({ equipmentLaborRate, capacity, laborCost, utilizationRate }) {
  const computable = isComputableArray([equipmentLaborRate, capacity, laborCost, utilizationRate]);
  if (!computable) return 0;
  const mathEquipmentLaborRate = bignumber(equipmentLaborRate);
  const mathCapacity = bignumber(capacity);
  const mathLaborCost = bignumber(laborCost);
  const mathUtilizationRate = bignumber(utilizationRate);
  const cost = chain(mathEquipmentLaborRate).divide(mathCapacity).add(mathLaborCost).divide(mathUtilizationRate).done();
  return format(cost, { notation: 'fixed', precision: 6 });
}
