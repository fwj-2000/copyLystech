import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { detailfactoryselectparam, chuqinselectparam } from '/@/api/dataAnalysis/warehouseKanban';
export const commonOrgCodeSelectFormOptions: TFormItemOption = {
  type: EFormItemType.SELECT,
  default: '',
  key: 'orgCode',
  attrs: {
    // allowClear: false,
    // mode: 'multiple',
    style: { width: '100px' },
  },
  options: [],
  getOptions: async () => {
    const { data } = await detailfactoryselectparam({});
    let list = Object.entries(data).map(([key, value]) => ({
      text: value as string,
      value: key,
    }));
    list.unshift({ text: '全部厂区', value: '' });
    return list;
  },
  getParam: value => {
    console.log('🚀 ~getParam value:', value);
    return { orgCode: value };
  },
};
export const commonOrgCodeTreeSelectFormOptions: TFormItemOption = {
  type: EFormItemType.TREE_SELECT,
  default: '',
  isOverrideDefault: true,
  key: 'deptNameLevel5',
  options: [],
  getOptions: async (params = {}) => {
    const { data } = await chuqinselectparam(params);
    const list = data.list ?? data;
    const handleList = list.map(item => {
      return {
        id: item.id,
        parentId: item.parentId,
        value: item.orgCode,
        text: item.orgName,
        level: item.orgLevel,
      };
    });
    return handleList;
  },
};
