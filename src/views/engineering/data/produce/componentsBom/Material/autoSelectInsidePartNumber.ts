import { debounce } from 'lodash-es';
import { useRaceCondition } from '/@/hooks/event/useRaceControl';
import buildPartNumber from '/@/views/engineering/PCCBeta/components/PccMaterial/buildPartNumber';
import { usePartNumberService } from '/@/views/engineering/PCCBeta/components/PccMaterial/usePartNumber';
import { isExist } from '/@/utils/is';

// 选中料号后的处理逻辑
export function handleOriginPartNumberChange(materialCode, data, params) {
  if (!materialCode || !data) return;
  const { row } = params;
  const { width, shortMaterialCode: rowEightCode } = row;
  if (!(isExist(width) && isExist(rowEightCode))) {
    resetPartNumber(row);
    return;
  }
  // 选中查询结果
  const [_, eightCode, calcWidth] = materialCode?.split('-');
  const { materialDesc, materialName, materialLength, materialWidth, materialColor } = data;
  const partNumber = buildPartNumber(calcWidth, row.width, eightCode, materialCode);
  if (isExist(width) && isExist(materialWidth)) {
    if (width === 0) {
      row.materialUtilization = '100%';
    } else {
      row.materialUtilization = ((Math.floor(materialWidth / width) / (materialWidth / width)) * 100).toFixed(2) + '%';
    }
  }
  Object.assign(row, {
    materialDesc: materialDesc || materialName || null,
    materialLength: materialLength,
    materialWidth: materialWidth,
    materialColor: materialColor,
    shortMaterialCode: eightCode,
    materialCode: materialCode,
    originPartNumber: partNumber,
  });
}

const { prepareRequest, isRequestValid } = useRaceCondition();
const { executeBusinessLogic } = usePartNumberService(
  {
    fieldMap: {
      originPartNumber: 'materialCode',
      partNumber: 'originPartNumber',
      width: 'width',
      eightCode: 'shortMaterialCode',
    },
    afterSelectPartNum: handleOriginPartNumberChange,
  },
  { prepareRequest, isRequestValid },
);

// 主函数
export default async function selectInsidePartNumber({ row }) {
  const { requestId, signal, cleanup } = prepareRequest(row);
  try {
    // 执行业务逻辑
    await executeBusinessLogic({ row, requestId, signal });
  } catch (error) {
    console.error('处理料号选择时出错', error);
  } finally {
    cleanup(); // 清理资源
  }
}

// 使用WeakMap为每一行存储独立的防抖函数
const debounceMap = new WeakMap();
export function getDebouncedFunction(row, delay) {
  if (!debounceMap.has(row)) {
    // 创建新的防抖函数并存储
    const debounced = debounce(params => {
      // 执行实际业务逻辑
      selectInsidePartNumber(params);
    }, delay);
    debounceMap.set(row, debounced);
  }
  return debounceMap.get(row);
}
// 重置料号信息
export function resetPartNumber({ row }) {
  row.originPartNumber = '';
  row.originPartNumberName = '';
  row.partNumber = '';

  // 清除该行的防抖函数
  if (debounceMap.has(row)) {
    debounceMap.delete(row);
  }
}
