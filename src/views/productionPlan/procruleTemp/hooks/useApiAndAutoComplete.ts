import { getWorkOrderDesc } from '/@/api/productionDeal/workOrder';
import { defHttp } from '/@/utils/http/axios';
import { ref } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { procRuleTempEnum, TempItem } from '/@/views/productionPlan/procruleTemp/types';
import { getDictionaryDataSelector } from '/@/api/systemData/dictionary';

const { createMessage } = useMessage();

export function useApiAndAutoComplete() {
  const isLoading = ref(false);

  function getApiFn(url: string, data: any) {
    return defHttp.get({ url, data });
  }
  // 获取下拉列表
  async function getOptionsByApiFn(item: TempItem, searchKey = '', process = '') {
    // if (item.templateList?.length && !searchKey) {
    //   return;
    // }
    try {
      const params = process ? { searchKey: searchKey || item.fieldValue, process } : { searchKey: searchKey || item.fieldValue };
      const { data } = await getApiFn(item.dataSources, params);
      if (data.length) {
        const _list = data.map(({ code, name }) => {
          return {
            id: code,
            fullName: `${name}(${code})`,
          };
        });
        item.templateList = _list;
      }
      return [];
    } catch (error) {
      console.error('获取下拉失败', error);
      return [];
    }
  }

  // 获取字典by type
  function getDictionaryDataSelectorFn(item: TempItem) {
    if (item.templateList?.length) {
      return;
    }
    getDictionaryDataSelector(item.dataSources).then(res => {
      item.templateList = res.data.list;
    });
  }

  /**
   *
   * @param item 源数据
   * @param fieldValue 搜索值
   * @param processName 工序
   * @param operationType 操作类型
   */
  function getAutoCompleteData({ item, fieldValue, processName, operationType }) {
    const { fieldEnName, attachJson } = item;
    if (fieldEnName === 'workOrderNo') {
      // 工单号 自动带入
      const objMap = {
        autoCompleteObj: { productCode: 'productCode', workOrderQuantity: 'quantity', mouldNo: 'mouldNo', factory: 'factoryArea' },
      };
      return workOrderNoChangeFn({ attachJson: objMap, fieldValue });
    } else if (attachJson) {
      const _attachJson = JSON.parse(attachJson);
      return autoCompleteDataFn({ attachJson: _attachJson, fieldValue, processName, operationType, item });
    }
  }

  // 自动请求接口并带入数据
  async function autoCompleteDataFn({ attachJson, fieldValue, processName, operationType, item }) {
    if (fieldValue && operationType) {
      const _autoCompleteObj = attachJson.filter(o => o.operationType === operationType);
      const obj = _autoCompleteObj[0];
      if (!obj) return;
      isLoading.value = true;
      try {
        const { code, data, msg } = await getApiFn(obj.url, { processName, documentNumber: fieldValue });
        if (code === 200) {
          // 返回数据 和 要带入数据对象
          return Promise.resolve({ data, autoCompleteObj: obj.autoCompleteObj });
        } else {
          item.fieldValue = null;
          createMessage.error(msg);
        }
      } catch (error) {
        item.fieldValue = null;
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  // 工单号fn
  async function workOrderNoChangeFn({ attachJson, fieldValue }) {
    if (fieldValue) {
      isLoading.value = true;
      try {
        const { code, data, msg } = await getWorkOrderDesc({ workOrderNo: fieldValue });
        if (code == 200) {
          return Promise.resolve({ data, autoCompleteObj: attachJson.autoCompleteObj });
        } else {
          createMessage.error(msg);
        }
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  return {
    getDictionaryDataSelectorFn,
    getOptionsByApiFn,
    getAutoCompleteData,
    isLoading,
  };
}
