import handleOriginPartNumberChange from '/@/views/engineering/PCCBeta/components/PccMaterial/handleOriginPartNumberChange';
import { debounce } from 'lodash-es';
import { useRaceCondition } from '/@/hooks/event/useRaceControl';
import { usePartNumberService } from './usePartNumber';

const { prepareRequest, isRequestValid } = useRaceCondition();
const { executeBusinessLogic } = usePartNumberService(
  {
    fieldMap: {
      originPartNumber: 'originPartNumber',
      partNumber: 'partNumber',
      width: 'width',
      eightCode: 'eightCode',
    },
    afterSelectPartNum: handleOriginPartNumberChange,
  },
  { prepareRequest, isRequestValid },
);

// 主函数
export default async function selectInsidePartNumber({ row }, disAssignFields?: any) {
  const { requestId, signal, cleanup } = prepareRequest(row);
  try {
    // 执行业务逻辑
    await executeBusinessLogic({ row, requestId, signal, disAssignFields });
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
