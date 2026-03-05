import { commonTextOption, commonValueOption, commonMediumFormatValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { getSyOrganization, getProfitandlosDownloadTemplate } from '/@/api/dataAnalysis/financial';
import { BaseVxeTableTypes, EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { EFormItemType, ETimeDimension, TFormItemOption, EOrgLevel } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import type { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import XEUtils from 'xe-utils';
import dayjs, { Dayjs } from 'dayjs';
import { h } from 'vue';
// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.TREE_SELECT,
    default: '',
    isOverrideDefault: true,
    key: 'orgCode',
    options: [],
    attrs: {
      disabledDate: (current: Dayjs) => {
        return current && current < dayjs('2024-01-01').tz();
      },
    },
    setDefault: (options: Array<{ value: string; disabled: boolean }>) => {
      return options.find(item => !item.disabled)?.value || '';
    },
    getOptions: async (params = {}) => {
      const { data } = await getSyOrganization(params);
      const list = data.list ?? data;
      const handleList = list.map(item => {
        return {
          id: item.ID,
          parentId: item.Parent_Id,
          value: item.Org_Code,
          text: item.Org_Name,
          level: item.Org_Level,
          disabled: `${item.Org_Level}` === EOrgLevel.BU,
        };
      });
      return handleList;
    },
  },

  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, 'month'), dayjs().subtract(1, 'month')],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.MONTH,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.MONTH, value);
      return { startDim, endDim };
    },
  },
  {
    type: EFormItemType.SELECT,
    default: 'cz',
    key: 'type',
    attrs: {
      allowClear: false,
    },
    options: [
      { text: '产值', value: 'cz' },
      { text: '销值', value: 'xz' },
    ],
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      field: 'sort',
      title: '序号',
      width: 80,
      headerAlign: 'center',
      className: ({ row }) => {
        const { sort } = row;
        if (!`${sort}`.includes('.')) {
          return '';
        }
        return `${sort}`.split('.')[1].length > 1 ? 'text-indent-2' : 'text-indent-1';
      },
    },
    { ...commonTextOption, title: '组织编码', field: 'metricKey' },
    {
      ...commonMediumFormatValueOption,
      ...commonValueOption,
      columnType: EColumnType.KEYS_VALUES,
      field: 'values',
      formatter: ({ cellValue, row }) => {
        const { metricKey } = row;
        if (!cellValue) return '';
        if (metricKey.includes('率')) {
          return `${XEUtils.commafy(Number(cellValue) * 100, { digits: 1 })}%`;
        }
        return XEUtils.commafy(cellValue, { digits: 0 });
      },
    },
  ];
  return columns;
};
/** 批量导入菜单 */
const { downloadFile: DownloadProfitandlosTemplate } = useDownload({
  requestApi: getProfitandlosDownloadTemplate,
});
export const batchMenuItems: MenuItemType[] = [
  {
    label: '模版下载',
    key: 'profitTemplate',
    clickMethod: () => {
      return DownloadProfitandlosTemplate({ fileName: '月损益预测手工导入模板' });
    },
  },
  {
    key: 'importmonthpredict',
    label: h(SingleUploadComponent, {
      api: '/api/report/profitandlos/importmonthpredict',
      buttonText: '导入',
    }),
  },
];
