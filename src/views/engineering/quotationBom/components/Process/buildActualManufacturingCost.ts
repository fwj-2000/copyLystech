/*
 * @Author: wenzhenjin
 * @Date: 2025-05-21 09:24:24
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-23 10:04:42
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Process\buildActualManufacturingCost.ts
 */
/**
 * 计算实际制造费用
 * 当前行实际制造费用=(当前实际制造费用到第一条实际制造费用累加+理论制造成本)*(1-制程良率)/制程良率 + 理论制造成本
 */

import { bignumber, chain, format, add, subtract, divide } from 'mathjs';

export function calculateActualManufacturingCost(row, grid) {
  // 源表格数据
  const datalist = grid.getFullData();
  let previousActualCost = bignumber(0);

  return datalist.map((item, index) => {
    // 使用mathjs的chain和bignumber进行高精度计算
    const currentTheoreticalCost = bignumber(item.theoreticalManufacturingCost || 0);
    const yieldRate = divide(bignumber(item.yield), bignumber(100)); // 将良率转换为小数形式(如98 → 0.98)
    // 累加前一条记录的实际制造费用
    datalist.forEach((value, i) => {
      if (i < index) {
        previousActualCost = add(previousActualCost, bignumber(value.actualManufacturingCost || 0));
      }
    });
    // if (index > 0) {
    //   const previousActualCost = bignumber(datalist[index - 1].actualManufacturingCost || 0);
    //   previousActualCost.add(currentTheoreticalCost);
    // }

    // 计算当前行的实际制造费用
    const currentActualCost = chain(previousActualCost)
      .add(currentTheoreticalCost)
      .multiply(chain(1).subtract(yieldRate).done())
      .divide(yieldRate)
      .add(currentTheoreticalCost)
      .done();
    item.actualManufacturingCost = format(currentActualCost, { notation: 'fixed', precision: 6 });
    if (item.actualManufacturingCost === 'Infinity' || item.actualManufacturingCost === 'NaN') item.actualManufacturingCost = null;
    // 返回新对象，保留所有原有属性，添加/更新实际制造费用
    // return {
    // 	...item,
    // 	actualManufacturingCost: format(currentActualCost, { notation: 'fixed', precision: 6 })
    // };
  });
}
