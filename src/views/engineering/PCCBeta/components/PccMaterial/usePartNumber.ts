import { nextTick } from 'vue';
import { isNullOrUnDef, isEmpty } from '/@/utils/is';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';

export function usePartNumberService(
  config: {
    fieldMap: {
      originPartNumber: string; // 带出来的初始料件号
      partNumber: string; // 最终料件号
      width: string; // 填写的宽度
      eightCode: string; // 填写的八码
    };
    afterSelectPartNum: Function; // 料号变化回调
  },
  raceCondition,
) {
  // 字段映射
  const _originPartNumberField = config.fieldMap.originPartNumber || 'originPartNumber';
  const _partNumberField = config.fieldMap.partNumber || 'partNumber';
  const _widthField = config.fieldMap.width || 'width';
  const _eightCodeField = config.fieldMap.eightCode || 'eightCode';
  // 重置料号信息
  const resetPartNumber = ({ row }) => {
    row[_originPartNumberField] = '';
    row[_originPartNumberField + 'Name'] = '';
    row[_partNumberField] = '';
  };

  // 验证输入参数
  const validateParam = row => {
    const width = row[_widthField];
    const eightCode = row[_eightCodeField];
    return !(isNullOrUnDef(width) || isEmpty(width) || eightCode.length !== 8);
  };

  // 处理API响应数据
  const processApiResponse = async (row, requestId, data, disAssignFields) => {
    // 检查请求是否仍然有效
    if (!raceCondition.isRequestValid(row, requestId)) {
      return;
    }
    // 如果不存在八码对应的料号，则不执行
    if (!data || data.length === 0) {
      return;
    }
    // 如果只有一条，则直接选中
    let currentSelectedItem = data[0] || {};
    if (data.length > 1) {
      const list = Array.isArray(data) ? data : [];
      let hasAlternative = false;
      const target = list.find(item => {
        if (item.altMaterial) hasAlternative = true;
        return row[_widthField] == item.materialWidth;
      });
      // 判断是否有替代料，如果有则不走自动选中
      if (hasAlternative) return;
      // 填写宽度与材料不一致，仍自动选中第一个
      console.log(target, 'targettargettargettargettargettarget');
      currentSelectedItem = isNullOrUnDef(target) ? currentSelectedItem : target;
    }
    // 处理选中的材料
    config.afterSelectPartNum(currentSelectedItem.materialCode, currentSelectedItem, { row }, disAssignFields);
    await nextTick();
    row[_originPartNumberField] = currentSelectedItem.materialCode;
    row[_originPartNumberField + 'Name'] = currentSelectedItem.materialCode;
  };

  // 执行业务逻辑
  const executeBusinessLogic = async ({ row, requestId, signal, disAssignFields }) => {
    // 默认八码变动时重置料号信息
    resetPartNumber({ row });
    await nextTick();
    if (!validateParam(row)) {
      return;
    }

    try {
      const width = row[_widthField];
      const eightCode = row[_eightCodeField];
      if (!row.factory) return;
      const params = {
        shortMaterialCode: eightCode,
        materialWidth: width,
        toleranceNegative: 0,
        factory: row.factory,
      };
      if (disAssignFields && !isEmpty(disAssignFields)) {
        params.altMaterial = 1;
      }
      const { data } = await getMaterialSearchByShortCode(params, { signal }).then(res => {
        // 处理特殊YPL00000情况
        if (['YPL00000', 'YPL00001', 'YPL00002'].includes(eightCode) && res.data) {
          const filterCode = `600-${eightCode}-0001`;
          return (Array.isArray(data) ? data : []).filter(item => item.materialCode === filterCode);
        }
        return res;
      });
      await processApiResponse(row, requestId, data, disAssignFields);
    } catch (error: any) {
      // 忽略请求取消的错误
      if (error?.name !== 'AbortError') {
        console.error('请求失败', error);
        throw error; // 重新抛出非取消错误
      }
    }
  };

  return {
    executeBusinessLogic,
  };
}
