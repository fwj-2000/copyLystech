/*
 * @Author: wenzhenjin
 * @Date: 2025-05-21 09:24:24
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-22 15:51:25
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Process\buildProcessLaborCost.ts
 */
/**
 * 计算人工成本
 * 工资率/产能*人数
 */
import { bignumber, chain, format } from 'mathjs';
import { isComputableArray } from '/@/utils/is';

export function calculateLaborCost({ wage, capacity, numberOfUsers }) {
  const computable = isComputableArray([wage, capacity, numberOfUsers]);
  if (!computable) return 0;
  const mathWage = bignumber(wage);
  const mathCapacity = bignumber(capacity);
  const mathNumberOfUsers = bignumber(numberOfUsers);

  const cost = chain(mathWage).divide(mathCapacity).multiply(mathNumberOfUsers).done();

  return format(cost, { notation: 'fixed', precision: 6 });
  return null;
}
