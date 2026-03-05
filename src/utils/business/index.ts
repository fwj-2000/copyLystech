import { getConfigTypes } from '/@/api/business/member';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
const { t } = useI18n();

/**
 * 获取主要制程
 * @param num ：id是否转成数值
 * */
export async function getMainProcess(num?: 0 | 1) {
  const r = await getConfigTypes(['mainProcess']);
  const _obj = r.data[0].typeList;
  const _list: any = [];
  for (let k in _obj) {
    _list.push({
      id: num == 1 ? Number(k) : k,
      fullName: t('dict.MainProcess.' + k), // 国际化处理
    });
  }
  return _list;
}

// 获取生产类型
export const getProductionType = [
  { id: 1, fullName: t('dict.ProductionTypeEnum.Self'), value: 1, label: t('dict.ProductionTypeEnum.Self') },
  { id: 2, fullName: t('dict.ProductionTypeEnum.Outsourcing'), value: 2, label: t('dict.ProductionTypeEnum.Outsourcing') },
];
