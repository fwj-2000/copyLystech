import { bignumber } from 'mathjs';

/**
 * 计算半成品料的用量
 * 用量 (1 / (1 - 不良率之和) * 1000) * 用量倍数
 * @param ProcessFlowRef
 * @param getStepDistanceList
 * @param row
 */
export function calcHalfPartUseQty({ ProcessFlowRef, row }) {
  const { materialDosage } = row;
  const { getDataSource: processGetDataSource } = ProcessFlowRef;
  const processList = processGetDataSource();
  const defectRate = processList.reduce((pre, next) => {
    pre += Number(next.defectiveRate || 0);
    return pre;
  }, 0);
  const useQty = bignumber(1)
    .div(bignumber(1).minus(bignumber(defectRate).div(100)))
    .mul(bignumber(1000))
    .mul(bignumber(materialDosage || bignumber(1)));

  row.qty = useQty.toFixed(5);
}
