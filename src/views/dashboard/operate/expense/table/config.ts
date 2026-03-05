import { h } from 'vue';
import { getFyOrganization } from '/@/api/dashbord/operate';
import dayjs from 'dayjs';
import XEUtils from 'xe-utils';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { exportDeparImportTemplate, exportManualTemplate, getfeeAttrDimension } from '/@/api/dashbord/fare';

import { BaseVxeTableTypes, EColumnType, EFilterSlot } from '/@/views/dashboard/commonComponents/BaseVxeTable/types';
import { EFormItemType, TFormItemOption } from '/@/views/dashboard/commonComponents/SearchForm/types';
import { ETimeDimension, MenuItemType } from './types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';

const commonColumnCellOption: BaseVxeTableTypes.Column = {
  minWidth: 85,
  sortable: true,
  sortType: 'number',
  className: () => {
    return 'text-right';
  },
  formatter: ({ cellValue, column }) => {
    if (cellValue === 0) {
      return '';
    }
    const { field } = column;
    if (field.includes('占比')) {
      return `${XEUtils.toFixed(cellValue * 100, 1)}% `;
    }
    return XEUtils.commafy(cellValue);
  },
};

const columns: BaseVxeTableTypes.Columns = [
  {
    minWidth: 100,
    field: 'DimesionType',
    headerAlign: 'center',
    columnType: EColumnType.KEYS_VALUES,
    filters: [{ data: [] }],
    fixed: 'left',
    mergeConfig: {
      maxMergeColCount: 2,
      needMergeRow: true,
      needGroups: true,
    },
    slots: {
      filter: EFilterSlot.MULTI_SEARCH_SELECT,
    },
  },
  {
    field: 'ThisYearList',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-purple',
    },
  },
  {
    field: 'Env',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
  },
  {
    field: 'LastYearList',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-grey',
    },
  },
  {
    field: 'YearTotal',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
  },
  {
    field: 'Same',
    columnType: EColumnType.WEEK_KEYS_VALUES,
    childOption: commonColumnCellOption,
    commonOption: {
      headerClassName: 'bg-grey',
    },
  },
];
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return columns;
};

// 通用搜索组件配置
const timeDimensionOptions = [
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const commonOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getFyOrganization(params);
      const list = data.list ?? data;
      // 将结果处理成下拉菜单的属性
      const handleList = list.map(item => {
        return {
          id: item.ID,
          parentId: item.Parent_Id,
          value: item.Org_Code,
          text: item.Org_Name,
          level: item.Org_Level,
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
  {
    type: EFormItemType.SELECT,
    default: 'week',
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    type: EFormItemType.RANGE_PICKER,
    isOverrideDefault: true,
    setDefault: (_, routeQuery) => {
      const [startDate, endDate] = routeQuery?.dateRange || [dayjs().tz(), dayjs().tz()];
      return [startDate.subtract(1, 'week'), endDate];
    },
    default: [],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
  },
  {
    label: '维度',
    type: EFormItemType.SELECT,
    default: ['factory'],
    key: 'dimensionType',
    attrs: {
      mode: 'multiple',
    },
    options: [],
    getOptions: async (params = {}) => {
      const { data } = await getfeeAttrDimension(params);
      // 将结果处理成下拉菜单的属性
      const handleList = Object.keys(data).map(key => {
        return {
          text: data[key],
          value: key,
        };
      });
      // 转换成树形结构数据
      return handleList;
    },
  },
];

// 批量导入导出菜单
const { downloadFile: templateDownloadFile } = useDownload({
  requestApi: exportManualTemplate,
});
const { downloadFile: deparImportTemplateDownload } = useDownload({
  requestApi: exportDeparImportTemplate,
});
export const batchMenuItems: MenuItemType[] = [
  {
    label: '表格数据导出',
    key: 'tableExport',
  },
  { type: 'divider' },
  // 手工数据导入
  {
    label: '手工数据',
    key: 'hand',
    children: [
      {
        label: '模版下载',
        key: 'handTemplate',
        clickMethod: () => {
          return templateDownloadFile({});
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/faremanage/manualImport',
          buttonText: '导入',
        }),
        key: 'handImport',
      },
    ],
  },
  // 部门对照表导入
  {
    label: '部门对照表',
    key: 'department',
    children: [
      {
        label: '模版下载',
        key: 'departmentTemplate',
        clickMethod: () => {
          return deparImportTemplateDownload({});
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/faremanage/departmentImport',
          buttonText: '导入',
        }),
        key: 'departmentImport',
      },
    ],
  },
];
