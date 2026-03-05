import { getOrganization } from '/@/api/dashbord/operate';
import { getFieldValue } from '/@/views/dashboard/commonComponents/SearchForm/utils';
import { getIsGoodProduct, getZdaysValue } from './utils';

import { ETimeDimension } from './types';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import dayjs from 'dayjs';
import { BaseVxeTableTypes, EColumnType, EFilterSlot, ESlotDefault } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';

// 跳转按钮
export const jumpButtonOptions = [
  {
    text: 'WIP统计',
    getPathUrl: () => {
      return '/dashboard/financial/inventory/wip';
    },
  },
  {
    text: '库存明细',
    getPathUrl: () => {
      return '/dashboard/financial/inventory/detail';
    },
  },
  {
    text: '在制明细',
    getPathUrl: () => {
      return '/dashboard/financial/inventory/inProgressDetails';
    },
  },
];

// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    key: 'orgCode',
    options: [],
    isOverrideDefault: true,
    getOptions: async (params = {}) => {
      const { data } = await getOrganization({
        ...params,
        keyword: '1',
      });
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        return {
          id: getFieldValue(item, 'id'),
          parentId: getFieldValue(item, 'parent_Id'),
          value: getFieldValue(item, 'org_Code'),
          text: getFieldValue(item, 'org_Name'),
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'FactoryName',
      title: '厂区',
      width: 100,
      align: 'center',
      className: 'bg-white',
      mergeConfig: {
        needMergeRow: true,
      },
      filters: [{ data: [] }],
      slots: {
        filter: EFilterSlot.MULTI_SEARCH_SELECT,
      },
    },
    {
      field: 'Title1',
      title: '类型',
      width: 120,
      align: 'center',
      mergeConfig: {
        needMergeRow: true,
      },
    },
    {
      field: 'Title2',
      title: '账龄',
      width: 120,
      align: 'center',
    },
    {
      field: 'List',
      width: 120,
      align: 'right',
      sortable: true,
      columnType: EColumnType.KEYS_VALUES,
      slots: {
        default: ESlotDefault.LINK_DEFAULT,
      },
      params: {
        getPathUrl: ({ row }) => {
          const { Title1 } = row;
          switch (Title1) {
            case '原材料':
            case '半成品':
            case '成品':
            case '在仓库存':
            case 'VMI在库':
            case '在仓库存(含不良)':
              return '/dashboard/financial/inventory/detail';
            case '在制':
              return '/dashboard/financial/inventory/inProgressDetails';
            case '结单管理':
              return '/dashboard/financial/inventory/statementRate';
            case 'WIP工单数量':
            case 'WIP工单金额':
              return '/dashboard/financial/inventory/wip';
            default:
              return '';
          }
        },
        getPathParams: ({ row, column, searchFormValue }) => {
          const { title } = column;
          const { Title1, Title2, OrgCode } = row;
          const { orgCode } = searchFormValue;
          const query = {
            orgCode: OrgCode ?? orgCode,
            date: dayjs(title),
            isGoodProduct: getIsGoodProduct(Title2) ?? '',
          };
          switch (Title1) {
            case '原材料':
            case '半成品':
            case '成品':
              return {
                types: Title1,
                ...query,
              };
            case '在制':
              return query;
            case 'VMI在库':
              return {
                dataSource: 'VMI',
                ...query,
              };
            case '在仓库存':
            case '在仓库存(含不良)':
              return {
                zdays: getZdaysValue(Title2) ?? '',
                dataSource: '在仓',
                ...query,
              };
            case '结单管理':
              return {
                ...query,
              };
            case 'WIP工单数量':
            case 'WIP工单金额':
              return {
                ...query,
                dateRange: [dayjs(query.date).subtract(1, 'week'), dayjs(query.date)],
              };
            default:
              return query;
          }
        },
      },
    },
    {
      field: 'Env',
      title: '环比',
      width: 120,
      align: 'center',
    },
  ];
  return columns;
};
