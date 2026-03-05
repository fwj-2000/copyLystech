import {
  commonMiniTextOption,
  commonMediumTextOption,
  commonDateOption,
  commonMiniValueOption,
  commonBiggerTextOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import dayjs from 'dayjs';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { transThouIntEx } from '/@/views/dataAnalysis/utils';
import { EColumnType } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { ETimeDimension } from '/@/views/dataAnalysis/types';

import { h } from 'vue';
export const batchMenuItems: MenuItemType[] = [
  {
    label: h(SingleUploadComponent, {
      api: '/api/report/heatdissi/importDailyDetail',
      buttonText: '导入',
    }),
    key: 'importDailyDetail',
  },
];
const columns: BaseVxeTableTypes.Columns = [
  { type: 'checkbox', width: 60 },
  {
    ...commonDateOption,
    field: 'timeDate',
    title: '日期',
  },
  {
    ...commonMiniTextOption,
    field: 'heatClass',
    title: '班别',
  },
  {
    ...commonMiniTextOption,
    field: 'project',
    title: '项目',
  },
  {
    ...commonMiniTextOption,
    field: 'stage',
    title: '阶段',
  },
  {
    ...commonMediumTextOption,
    field: 'processe',
    title: '工艺',
  },
  {
    ...commonBiggerTextOption,
    field: 'itemNumber',
    title: '料号',
    width: 140,
  },
  {
    ...commonMiniValueOption,
    field: 'investQuantity',
    title: '投入数量',
    width: 80,
  },
  {
    ...commonMiniValueOption,
    field: 'goodProductNumber',
    title: '良品数',
    width: 80,
  },

  {
    ...commonMiniValueOption,
    field: 'badNumber',
    title: '不良数',
    width: 80,
  },
  {
    ...commonMiniValueOption,
    field: 'yields',
    title: '良率',
    width: 80,
    formatter: ({ cellValue: value }) => transThouIntEx(value, '%', 0),
  },
  {
    ...commonMiniValueOption,
    field: 'dynamicFields',
    columnType: EColumnType.KEYS_VALUES,
    width: 85,
  },
];
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return columns;
};

export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(7, 'day'), dayjs().subtract(0, 'day')],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {
      allowClear: false,
      picker: ETimeDimension.DAY,
    },
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
  // {
  //   type: EFormItemType.DATE_PICKER,
  //   default: dayjs().subtract(0, 'day'),
  //   key: 'timeDate',
  //   label: '日期',
  //   attrs: {
  //     allowClear: false,
  //   },
  //   getParam: value => {
  //     return { timeDate: value.format('YYYY-MM-DD') };
  //   },
  // },
  {
    type: EFormItemType.SELECT,
    label: '项目',
    default: [],
    key: 'project',
    attrs: {
      mode: 'multiple',
    },
    options: [],
    getParam: value => {
      return { project: value.join(';') };
    },
  },

  {
    type: EFormItemType.SELECT,
    label: '班别',
    options: [
      { text: '夜班', value: '夜班' },
      { text: '白班', value: '白班' },
    ],
    key: 'heatClass',
    attrs: { style: { width: '120px' } },
  },
  // { type: EFormItemType.INPUT, label: '不良项', default: '', key: 'badItem', attrs: { style: { width: '120px', } } },
];
