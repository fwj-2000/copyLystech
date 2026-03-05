import { commonSyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import {
  commonColumnOptions,
  commonMediumColumnOptions,
  commonLargeColumnOptions,
  commonValueOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';

import { ETimeDimension, EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes, EColumnType, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { transThouIntEx, getDateRangeDim } from '/@/views/dataAnalysis/utils';
import dayjs from 'dayjs';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { h } from 'vue';
import { useDownload } from '/@/views/dataAnalysis/hooks/useDownload';
import { exportImportbaseTemplate } from '/@/api/dashbord/operate';

const { downloadFile: deparImportTemplateDownload } = useDownload({
  requestApi: exportImportbaseTemplate,
});
export const batchMenuItems: MenuItemType[] = [
  {
    label: '模版下载',
    key: 'departmentTemplate',
    clickMethod: () => {
      return deparImportTemplateDownload({});
    },
  },
  {
    label: h(SingleUploadComponent, {
      api: '/api/report/customerschedul/importbase',
      buttonText: '数据导入',
    }),
    key: 'departmentImport',
  },
];

export const formOptions: TFormItemOption[] = [
  commonSyOrgCodeFormOptions,

  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(8, 'week'), dayjs().subtract(1, 'week')],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.WEEK,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.WEEK, value);
      return { startDim, endDim };
      // return { startDim: '2025WK31', endDim: '2025WK40' };
    },
  },

  {
    type: EFormItemType.SELECT,
    label: '产品线',
    key: 'productLine',
    options: [],
    attrs: {
      mode: 'multiple',
    },
    getParam: value => {
      return { productLine: value.length > 0 ? value.join(';') : '' };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '项目',
    key: 'project',
    options: [],
    attrs: {
      mode: 'multiple',
    },
    getParam: value => {
      return { project: value.length > 0 ? value.join(';') : '' };
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '品名',
    key: 'itemNumber',
    options: [],
    attrs: {
      mode: 'multiple',
    },
    getParam: value => {
      return { itemNumber: value.length > 0 ? value.join(';') : '' };
    },
  },
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonColumnOptions,
      field: 'productLine',
      title: '产品线',
    },
    {
      ...commonMediumColumnOptions,
      field: 'project',
      title: '项目',
    },
    {
      ...commonLargeColumnOptions,
      field: 'itemNumber',
      title: '线体（条）',
    },

    {
      ...commonValueOption,
      width: 90,
      field: 'list',
      columnType: EColumnType.KEYS_VALUES,
      formatter: ({ cellValue }) => transThouIntEx(cellValue, '', 0, true),
      exportMethod: ({ row, column }) => transThouIntEx(row[column.field], '', 0, false),
    },
  ];
  return columns;
};
