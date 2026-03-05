import { useBaseStore } from '/@/store/modules/base';

export async function useDevices() {
  const getEquipmentStatusMap = async (type: string = 'equipmentStatus') => {
    const baseStore = useBaseStore();
    const obj: any = {};

    const equipmentStatus: any = await baseStore.getDictionaryData(type);
    obj[type + 'Data'] = equipmentStatus.map(item => item.fullName);
    obj[type + 'DataMap'] = equipmentStatus.reduce((acc, item) => {
      acc[item.enCode] = item.fullName;
      return acc;
    }, {});

    return obj;
  };

  return {
    getEquipmentStatusMap,
  };
}
