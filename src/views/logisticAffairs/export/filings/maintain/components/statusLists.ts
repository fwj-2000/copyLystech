import { useBaseStore } from '/@/store/modules/base';
const baseStore = useBaseStore();
import { getHarhorList } from '/@/api/basicData/harhor';
import { getFactoryList } from '/@/api/basicData/factory';
import { getCustomerList } from '/@/api/basicData/customer';

// 口岸列表
export async function getHarhors() {
  const harhorList = (await getHarhorList()).data;
  return harhorList
    ? harhorList.map(i => {
        return {
          id: i.Name,
          fullName: i.Name,
        };
      })
    : [];
}
// 客户列表
export async function getCustomers() {
  const list = (await getCustomerList({ keyword: '' })).data;
  return list
    ? list.map(i => {
        return {
          id: i.name,
          fullName: i.name,
          Harhor: i.harhor,
          ShipmentMode: i.shipmentMode,
        };
      })
    : [];
}
// 工厂列表
export async function getFarhors() {
  const list = (await getFactoryList()).data;
  const _factoryList: any[] = [];
  (list || []).forEach(i => {
    (list || []).forEach(i => {
      _factoryList.push({
        id: i.Id,
        fullName: i.Name + '/' + i.Code,
        ManagerName: i.ManagerName,
      });
    });
  });
  return _factoryList;
}
// 获取出货方式
export async function getApplyTypes() {
  const list = (await baseStore.getDictionaryData('ShipmentType')).data;
  return (list || []).map(i => {
    return {
      id: i.fullName,
      fullName: i.fullName,
    };
  });
}

export const getStatusList = async () => {
  return {
    harhorList: await getHarhors(),
    customerList: await getCustomers(),
    farhorsList: await getFarhors(),
    shipmentList: await getApplyTypes(),
  };
};
