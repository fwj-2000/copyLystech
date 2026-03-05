import { nextTick } from 'vue';
import { bignumber } from 'mathjs';
import { isNullOrUnDef } from '/@/utils/is';

/**
 * 计算产能
 * ((60*速度*稼动率)/步距)*模数
 * @param getStepDistanceList
 * @param getTechnologyTableFieldsValue
 * @param row
 */
// export async function calcCapacity(rest) {
export async function calcCapacity({ getStepDistanceList, row, utilizationRate, isMain, grid, getTechnologyFieldsValue }) {
  await nextTick();
  const stepDistanceList = getStepDistanceList();
  console.log('🚀 ~ calcCapacity ~ stepDistanceList: ', stepDistanceList);
  console.log('🚀 ~ calcCapacity ~ utilizationRate: ', utilizationRate);

  const mainStepDistance = stepDistanceList[0].stepDistance;
  const mainModulus = stepDistanceList[0].modulus;

  const { process } = getTechnologyFieldsValue();
  // 如果是主工序，则需要整个表的产能重新计算，不是主工序，只计算当前行的
  if (isMain) {
    const list = grid.getFullData();
    list.forEach(row => {
      let speed = row.speed;
      if (isNullOrUnDef(speed)) return;
      console.log('🚀 ~ calcCapacity ~ speed:', speed);
      if (process === 1) {
        speed = bignumber(speed)
          .mul(bignumber(mainStepDistance || 1))
          .div(bignumber(1000));
      }
      const capacity = bignumber(60)
        .mul(bignumber(speed || 0))
        .mul(bignumber(utilizationRate || 0))
        .div(bignumber(mainStepDistance || 1)) // 避免除以0
        .mul(bignumber(mainModulus || 0))
        .div(bignumber(100))
        .toFixed(5);
      console.log('🚀 ~ calcCapacity ~ capacity: ', capacity);
      row.capacity = capacity;
    });
  } else {
    let speed = row.speed;
    if (isNullOrUnDef(speed)) return;
    if (process === 1) {
      speed = bignumber(speed)
        .mul(bignumber(mainStepDistance || 1))
        .div(bignumber(1000));
    }
    const capacity = bignumber(60)
      .mul(bignumber(speed || 0))
      .mul(bignumber(utilizationRate || 0))
      .div(bignumber(mainStepDistance || 1)) // 避免除以0
      .mul(bignumber(mainModulus || 0))
      .div(bignumber(100))
      .toFixed(5);
    console.log('🚀 ~ calcCapacity ~ capacity: ', capacity);
    row.capacity = capacity;
  }

  // return capacity;
}
