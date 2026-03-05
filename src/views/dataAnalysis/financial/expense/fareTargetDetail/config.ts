import dayjs from 'dayjs';
import {
  commonTextOption,
  commonValueOption,
  commonDateTimeOption,
  getFormatter,
  commonMediumTextOption,
} from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { commonFyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';

import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { exportTarGetTemplate } from '/@/api/dataAnalysis/fare';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';

import { h } from 'vue';
const { downloadFile: deparImportTemplateDownload } = useDownload({
  requestApi: exportTarGetTemplate,
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
      api: '/api/report/faremanage/importFareTarGet',
      buttonText: '导入',
    }),
    key: 'importFareTarGet',
  },
];
export const formOptions: TFormItemOption[] = [
  commonFyOrgCodeFormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.MONTH,
    key: 'dimension',
    options: [
      { text: '周', value: ETimeDimension.WEEK },
      { text: '月', value: ETimeDimension.MONTH },
    ],
  },
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().subtract(2, ETimeDimension.MONTH), dayjs().subtract(1, ETimeDimension.MONTH)],
    key: 'dateRange',
    pickerKey: 'dimension',
    attrs: {},
    getParam: (value, searchFormValue) => {
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startTime: startDim, endTime: endDim };
    },
  },
  {
    type: EFormItemType.INPUT,
    key: 'finalSubject',
    attrs: {
      placeholder: '末级科目',
    },
  },
  {
    type: EFormItemType.INPUT,
    key: 'managementReport',
    attrs: {
      placeholder: '损益管报维度',
    },
  },
  // {
  //   type: EFormItemType.RANGE_PICKER,
  //   default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
  //   key: 'dateRange',
  //   attrs: {
  //     picker: ETimeDimension.MONTH,
  //   },
  //   getParam: value => {
  //     const { startDim, endDim } = getDateRangeDim(ETimeDimension.MONTH, value);
  //     return { startTime: startDim, endTime: endDim };
  //   },
  // },
];
// 表格字段配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    {
      ...commonTextOption,
      field: 'Factory',
      title: '厂区',
    },
    {
      ...commonTextOption,
      field: 'FinalSubject',
      title: '末级科目',
    },
    {
      ...commonMediumTextOption,
      width: 130,
      field: 'ManagementReport',
      title: '对应管报损益维度',
    },
    {
      ...commonTextOption,
      field: 'CreatorUserld',
      width: 70,
      title: '导入人',
      headerAlign: 'center',
    },
    {
      ...commonTextOption,
      field: 'DateStr',
      width: 70,
      title: '月份',
      headerAlign: 'center',
    },
    {
      ...commonValueOption,
      field: 'Amount',
      title: '目标%',
      headerAlign: 'center',
      formatter: getFormatter({ decimal: 4, isRate: true, isH: true }),
    },
    {
      ...commonDateTimeOption,
      width: 110,
      field: 'CreatorTime',
      title: '导入时间',
      headerAlign: 'center',
    },
    {
      headerAlign: 'center',
      field: 'Reason',
      title: '原因分析',
      showOverflow: false,
      rowResize: true,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: true,
        },
      },
    },
    {
      headerAlign: 'center',
      field: 'Measure',
      title: '管控对策',
      showOverflow: false,
      rowResize: true,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: true,
        },
      },
    },
  ];
};
