import { commonDateOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { downloadFile } from '/@/views/dataAnalysis/components/BatchMenu/utils';

import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { ETimeDimension } from '../types';
import { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { isEmpty } from 'lodash-es';
import { GetBusinessRangeBind, GetFeeTypeBind, GetHomeTypeShortTextBind, getTemplateDownload } from '/@/api/dashbord/feeTypeRestore';
import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';

const { t } = useI18n();

// 批量导入导出菜单
export const templateDownloadFile = ({ params, defaultFileName = 'download' }) => {
  return downloadFile({
    params,
    defaultFileName,
    requestApi: getTemplateDownload,
  });
};
export const batchMenuItems: MenuItemType[] = [
  // 导入数据
  {
    label: '导入数据',
    key: 'feeType',
    children: [
      {
        label: '模版下载',
        key: 'feeTypeDownload',
        clickMethod: () => {
          return templateDownloadFile({
            params: {
              fileName: '费用类型导入模板',
            },
          });
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/feetype/directImport',
          buttonText: '导入',
        }),
        key: 'feeTypeImport',
      },
    ],
  },
  // end
];

// 获取表头配置
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonMediumTextOption,
      title: '年份',
      field: 'Year',
    },
    {
      ...commonMediumTextOption,
      title: '季度',
      field: 'Quarter',
    },
    {
      ...commonMediumTextOption,
      title: '月份',
      field: 'Month',
    },
    {
      ...commonMediumTextOption,
      title: '业务范围',
      field: 'BusinessRange',
    },
    {
      ...commonMediumTextOption,
      title: 'SBU',
      field: 'Sbu',
    },
    {
      ...commonMediumTextOption,
      title: '活动类型',
      field: 'ActivityType',
    },
    {
      ...commonMediumTextOption,
      title: '作业类型短文本',
      field: 'HomeTypeShortText',
    },
    {
      ...commonMediumTextOption,
      title: '费用分类',
      field: 'FeeType',
    },
    {
      ...commonMediumTextOption,
      title: '费率单价',
      field: 'RatePrice',
    },
    {
      ...commonDateOption,
      title: '导入日期',
      field: 'ImportDate',
    },
    {
      ...commonMediumTextOption,
      title: '导入人员',
      field: 'ImportName',
    },
    {
      ...commonMediumTextOption,
      title: '是否应用还原',
      field: 'IsApplicationRestore',
      formatter: ({ cellValue }) => {
        return cellValue ? t('common.yes') : t('common.no');
      },
    },
    {
      ...commonDateOption,
      title: '应用还原时间',
      field: 'ApplicationRestoreTime',
      width: 120,
    },
  ];
  return columns;
};

// 筛选表单
export const filterOptions: TFormItemOption[] = [
  {
    type: EFormItemType.SELECT,
    label: '业务范围',
    key: 'businessRange',
    options: [],
    attrs: {
      dropdownMatchSelectWidth: false,
    },
    getOptions: async () => {
      const { data = [] } = await GetBusinessRangeBind({});
      return data.map(item => ({
        text: item.BusinessRange,
        value: item.BusinessRange,
      }));
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '作业类型短文本',
    key: 'homeTypeShortText',
    options: [],
    attrs: {
      dropdownMatchSelectWidth: false,
    },
    getOptions: async () => {
      const { data = [] } = await GetHomeTypeShortTextBind({});
      return data.map(item => ({
        text: item.HomeTypeShortText,
        value: item.HomeTypeShortText,
      }));
    },
  },
  {
    type: EFormItemType.SELECT,
    label: '费用分类',
    key: 'feeType',
    options: [],
    attrs: {
      dropdownMatchSelectWidth: false,
    },
    getOptions: async () => {
      const { data = [] } = await GetFeeTypeBind({});
      return data.map(item => ({
        text: item.FeeType,
        value: item.FeeType,
      }));
    },
  },
  // end
];

// 搜索表单配置
export const formOptions: TFormItemOption[] = [
  {
    label: '维度',
    type: EFormItemType.SELECT,
    key: 'restoreDimension',
    options: [
      { text: '年份', value: '1' },
      { text: '季度', value: '2' },
      { text: '月份', value: '3' },
    ],
  },
  {
    label: '导入日期',
    type: EFormItemType.RANGE_PICKER,
    default: [],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.DAY,
    },
    getParam: value => {
      if (isEmpty(value)) {
        return {};
      }
      const [startDate, endDate] = value;
      return { importStartDate: startDate.valueOf(), importEndDate: endDate.valueOf() };
    },
  },
  {
    label: 'SBU',
    type: EFormItemType.INPUT,
    default: '',
    attrs: {
      style: { width: '100px' },
    },
    key: 'sbu',
  },
  {
    label: '导入人员',
    type: EFormItemType.INPUT,
    default: '',
    attrs: {
      style: { width: '100px' },
    },
    key: 'importName',
  },
];
