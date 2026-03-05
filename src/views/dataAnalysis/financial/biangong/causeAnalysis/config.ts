import dayjs from 'dayjs';
import { getOrganization } from '/@/api/dashbord/operate';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { commonLargeTextOption, commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { ETimeDimension } from '/@/views/dataAnalysis/types';

export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
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
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.MONTH,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.MONTH, value);
      return { startDim, endDim };
    },
  },
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonLargeTextOption,
      field: 'Factory',
      title: '厂区',
    },
    {
      ...commonTextOption,
      field: 'Week',
      title: '周数',
    },
    {
      ...commonTextOption,
      field: 'Provider',
      title: '提供人',
    },
    {
      ...commonLargeTextOption,
      field: 'Aufnr',
      title: '订单号',
    },
    {
      ...commonLargeTextOption,
      width: 140,
      field: 'Matnr',
      title: '成品编号',
    },
    {
      field: 'Measures',
      title: '改善对策',
      headerAlign: 'center',
    },
    {
      field: 'Analysis',
      title: '原因分析',
      headerAlign: 'center',
    },
  ];
  return columns;
};
