import { nextTick } from 'vue';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { isNullOrUnDef } from '/@/utils/is';
import { getOriginPartNumberDesc } from './config';

/**
 *
 * @param row 当前行数据
 * @param props 组件参数 计算公式依赖工序的参数
 * @param $grid 表格实例
 * @param sumCost 计算成本
 * @param handleSearchValChange 回调函数 用于处理搜索值改变
 * @param insidePartNumberField 料号字段 不同模块可能会有不同的料号字段 例如：insidePartNumber、insidePart、originInsidePart
 */
export default async function selectInsidePartNumber({ row, props, $grid, sumCost, handleSearchValChange }, insidePartNumberField = 'originInsideCode') {
  const { eightCode } = row;
  // // 如果是粘贴，那么不需要清空料号，需要执行请求，再执行料号查询时间
  await nextTick();
  const { singleWidth } = row;
  // 如果用户没有填写使用宽度，不请求数据
  if (isNullOrUnDef(singleWidth)) {
    return;
  }
  const values = await props?.formValues;
  const { data } = await getMaterialSearchByShortCode({
    shortMaterialCode: eightCode,
    materialWidth: singleWidth,
    toleranceNegative: 0,
    terminalCustomerCode: props?.currentData?.terminalCustomerCode || '',
    productLineCode: props?.currentData?.productLineCode || '',
    factory: values?.factoryName.split('/')[0],
  });
  if (data?.length === 1) {
    // 如果只有一条自动选中
    handleSearchValChange(props, data[0].materialCode, data[0], { row, $grid }, sumCost);
    // await nextTick();
    row[insidePartNumberField] = data[0].materialCode;
    row[`${insidePartNumberField}Name`] = data[0].materialCode + getOriginPartNumberDesc(data[0]);
  } else {
    // 如果不止一条，
    // 1、那么判断是否存在 用户输入的宽度和列表的宽度是否存在 不存在则选中最宽的料
    // 2、如果存在，那么需要自动选中
    await nextTick();
    if (eightCode.length != 8) return;
    // const generateStr = `${eightCode}-${singleWidth?.toString()?.padStart(4, 0)}`;
    const list = Array.isArray(data) ? data : [];

    /**
     * 1. 如果存在有替代料的(`altMaterial === 1`)，则直接返回，不自动选中。
     * 2. 先找到有价格的规格(`hasPrice`为`true`)，在有价格里面再去判定有规格取对应规格，没对应规格取最大规格。
     * 3. 如果没找到价格，直接取最大规格。（没有价格不在找对应的规格）
     */
    // 1. 如果存在有替代料的(`altMaterial === 1`)，则直接返回，不自动选中。
    const hasAlternative = list.some(item => +item.altMaterial === 1);
    if (hasAlternative) {
      row[insidePartNumberField] = '';
      row[`${insidePartNumberField}Name`] = '';
      return;
    }
    // 2. 先找到有价格的规格(`hasPrice`为`true`)，在有价格里面再去判定有规格取对应规格，没对应规格取最大规格。
    const hasPriceList = list.filter(item => item.hasPrice);
    if (hasPriceList.length === 0) {
      // 3. 如果没找到价格，直接取最大规格
      const maxWidthData = findMaxWidthData(list);
      row[insidePartNumberField] = maxWidthData.materialCode;
      row[`${insidePartNumberField}Name`] = maxWidthData.materialCode + getOriginPartNumberDesc(maxWidthData as any);
      handleSearchValChange(props, maxWidthData.materialCode, maxWidthData, { row, $grid }, sumCost);
      return;
    }
    // 4. 如果有价格，再去判定有规格取对应规格，没对应规格取最大规格
    const target = hasPriceList.find(item => +item.materialWidth === +singleWidth);
    if (isNullOrUnDef(target)) {
      // 5. 如果没找到对应规格，取最大规格
      const maxWidthData = findMaxWidthData(hasPriceList);
      row[insidePartNumberField] = maxWidthData.materialCode;
      row[`${insidePartNumberField}Name`] = maxWidthData.materialCode + getOriginPartNumberDesc(maxWidthData);
      handleSearchValChange(props, maxWidthData.materialCode, maxWidthData, { row, $grid }, sumCost);
    } else {
      row[insidePartNumberField] = target.materialCode;
      row[`${insidePartNumberField}Name`] = target.materialCode + getOriginPartNumberDesc(target);
      handleSearchValChange(props, target.materialCode, target, { row, $grid }, sumCost);
    }
  }
}

/**
 * 找出宽度最大的数据
 * @param list 数据列表
 * @returns 宽度最大的数据
 */
function findMaxWidthData(list: Array<{ materialWidth: number; materialCode: string }>) {
  return list.reduce(
    (prev, cur) => {
      if (+cur.materialWidth > +prev.materialWidth) {
        return cur;
      }
      return prev;
    },
    { materialWidth: -1, materialCode: '' } as any,
  );
}
