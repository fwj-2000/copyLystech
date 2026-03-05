import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonDateOption, commonLargeValueOption, commonMediumTextOption, getFormatter } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateDim } from '/@/views/dataAnalysis/utils';
import { ETimeDimension } from '/@/views/dataAnalysis/types';

export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'OrgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getOrganization(params);
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        // const idValue = item.id || item.ID;
        return {
          id: item.id,
          parentId: item.parent_Id,
          value: item.org_Code,
          text: item.org_Name,
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.DATE_PICKER,
    default: dayjs().subtract(2, 'day'),
    key: 'TimeDate',
    getParam: value => {
      return { TimeDate: getDateDim(value, ETimeDimension.DAY) };
    },
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      field: 'Factory',
      title: '工厂',
    },
    {
      ...commonDateOption,
      field: 'TimeDate',
      title: '日期',
    },
    {
      ...commonMediumTextOption,
      field: 'Fnumber',
      title: '机台号',
    },
    {
      ...commonMediumTextOption,
      field: 'MachineType',
      title: '机台类型',
    },
    {
      ...commonMediumTextOption,
      field: 'FlocAtion',
      title: '机台楼层',
    },
    {
      ...commonMediumTextOption,
      field: 'Fteam',
      title: '班次',
    },
    {
      ...commonLargeValueOption,
      field: 'TotalTime',
      title: '运行时长(Min)',
    },
    {
      ...commonLargeValueOption,
      field: 'Qty',
      title: '模切产出(PCS)',
      formatter: getFormatter(),
    },
    {
      ...commonMediumTextOption,
      field: 'SfKaiJi',
      title: '是否开机',
    },
  ];
  return columns;
};

// 筛选表单
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    label: '机台号',
    key: 'Fnumber',
  },
  {
    type: EFormItemType.INPUT,
    label: '机台类型',
    key: 'MachineType',
  },
  {
    type: EFormItemType.INPUT,
    label: '机台楼层',
    key: 'FlocAtion',
  },
  {
    type: EFormItemType.INPUT,
    label: '班次',
    key: 'Fteam',
  },
  {
    type: EFormItemType.INPUT,
    label: '是否开机',
    key: 'SfKaiJi',
  },
];
