import { nextTick } from 'vue';
import { bignumber } from 'mathjs';
/**
 * 计算半成品料的用量
 * 用量 (1 / (1 - 不良率之和) * 1000) * 用量倍数
 * 零损耗用量 1*1000*用量倍数
 * @param ProcessFlowRef
 * @param getStepDistanceList
 * @param row
 */
export async function calcMaterialUseQty({ ProcessFlowRef, getMaterialList, getStepDistanceList, handleCallBack }) {
  await nextTick();
  const { getDataSource: processGetDataSource } = ProcessFlowRef;
  const processList = processGetDataSource();
  const materialList = getMaterialList();
  const stepDistanceList = getStepDistanceList();
  const defectRate = processList.reduce((pre, next) => {
    pre += Number(next.defectRate || 0);
    return pre;
  }, 0);
  const data = materialList.map(record => {
    const { unit, useQtyMultiple, stepDistanceNumber } = record;
    let useQty;
    let zeroLossUseQty;
    if (unit == 'PCS') {
      useQty = bignumber(1)
        .div(bignumber(1).minus(bignumber(defectRate).div(100)))
        .mul(1000)
        .mul(useQtyMultiple || 1);
      zeroLossUseQty = bignumber(1)
        .mul(1000)
        .mul(useQtyMultiple || 1);
    } else {
      const mainStepDistance = stepDistanceList[stepDistanceNumber - 1].stepDistance;
      const mainModulus = stepDistanceList[stepDistanceNumber - 1].modulus;
      useQty = bignumber(mainStepDistance || 0)
        .div(bignumber(mainModulus || 1)) // 避免除以0
        .div(bignumber(1).minus(bignumber(defectRate || 0).div(100)))
        .mul(bignumber(useQtyMultiple || 1));
      zeroLossUseQty = bignumber(mainStepDistance || 0)
        .div(mainModulus || 1)
        .mul(bignumber(useQtyMultiple || 1));
    }
    if (!Number.isNaN(useQty)) {
      record.useQty = useQty.toFixed(5);
    }
    if (!Number.isNaN(zeroLossUseQty)) {
      record.zeroLossUseQty = zeroLossUseQty.toFixed(5);
    }
    return record;
  });
  handleCallBack(data, stepDistanceList, []);
}

export async function calcSingleRowUseQty({ ProcessFlowRef, getStepDistanceList, row }) {
  console.log('🚀 ~ calcSingleRowUseQty ~ row:', row);
  await nextTick();
  const { getDataSource: processGetDataSource } = ProcessFlowRef;
  const processList = processGetDataSource();
  const stepDistanceList = getStepDistanceList();
  const defectRate = processList.reduce((pre, next) => {
    pre += Number(next.defectRate || next.defectiveRate || 0);
    return pre;
  }, 0);
  console.log('🚀 ~ calcSingleRowUseQty ~ defectRate: ', defectRate);

  const { unit, useQtyMultiple, materialDosage, stepDistanceNumber } = row;
  let useQty;
  let zeroLossUseQty;
  if (unit == 'PCS') {
    useQty = bignumber(1)
      .div(bignumber(1).minus(bignumber(defectRate).div(100)))
      .mul(1000)
      .mul(useQtyMultiple || 1);
    zeroLossUseQty = bignumber(1)
      .mul(1000)
      .mul(useQtyMultiple || 1);
  } else {
    const mainStepDistance = stepDistanceList[stepDistanceNumber - 1].stepDistance;
    const mainModulus = stepDistanceList[stepDistanceNumber - 1].modulus;
    useQty = bignumber(mainStepDistance || 0)
      .div(bignumber(mainModulus || 1)) // 避免除以0
      .div(bignumber(1).minus(bignumber(defectRate || 0).div(100)))
      .mul(bignumber(useQtyMultiple || materialDosage || 0));
    zeroLossUseQty = bignumber(mainStepDistance || 0)
      .div(mainModulus || 1)
      .mul(bignumber(useQtyMultiple || materialDosage || 0));
  }
  console.log(useQty.toFixed(5), 'useQty.toFixed(5)useQty.toFixed(5)useQty.toFixed(5)');
  if (!Number.isNaN(useQty)) {
    row.useQty = useQty.toFixed(5);
    row.qty = useQty.toFixed(5);
    row.zeroLossUseQty = zeroLossUseQty.toFixed(5);
  }
}

/**
 * 计算半成品料的用量
 * 用量 (1 / (1 - 不良率之和) * 1000) * 用量倍数
 * @param ProcessFlowRef
 * @param getStepDistanceList
 * @param row
 */
export function calcSemiFinishedUseQty({ ProcessFlowRef, row }) {
  const { materialDosage } = row;
  const { getDataSource: processGetDataSource } = ProcessFlowRef;
  const processList = processGetDataSource();
  const defectRate = processList.reduce((pre, next) => {
    pre += Number(next.defectRate || 0);
    return pre;
  }, 0);
  const useQty = bignumber(1)
    .div(bignumber(1).minus(bignumber(defectRate).div(100)))
    .mul(bignumber(1000))
    .mul(bignumber(materialDosage || bignumber(1)));

  const zeroLossUseQty = bignumber(1)
    .mul(bignumber(1000))
    .mul(bignumber(materialDosage || bignumber(1)));

  row.qty = useQty.toFixed(5);
  row.zeroLossUseQty = zeroLossUseQty.toFixed(5);
}
