import { h } from 'vue';
import dayjs from 'dayjs';
import { cloneDeep, merge } from 'lodash-es';
import { useDownload } from '/@/views/dashboard/hooks/useDownload';
import { commonFyOrgCodeFormOptions } from '/@/views/dataAnalysis/config';
import { commonDateOption, commonLargeTextOption, commonMediumTextOption, commonTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { exportManualTemplate } from '/@/api/dataAnalysis/fare';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import { VxeGridPropTypes } from 'vxe-table';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';

// 批量导入
const { downloadFile: templateDownloadFile } = useDownload({
  requestApi: exportManualTemplate,
});
export const batchMenuItems: MenuItemType[] = [
  // 手工数据导入
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
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  commonFyOrgCodeFormOptions,
  {
    type: EFormItemType.RANGE_PICKER,
    default: [dayjs().tz().subtract(1, 'month'), dayjs().tz()],
    key: 'dateRange',
    attrs: {
      picker: ETimeDimension.MONTH,
    },
    getParam: value => {
      const { startDim, endDim } = getDateRangeDim(ETimeDimension.MONTH, value);
      return { startTime: startDim, endTime: endDim };
    },
  },
];

// 通用字段配置
export const allColumns = {
  Year: {
    ...commonTextOption,
    title: '财年',
  },
  Month: {
    ...commonTextOption,
    title: '月',
  },
  Factory: {
    ...commonTextOption,
    title: '厂区',
  },
  Bu: {
    ...commonTextOption,
    title: 'Bu',
  },
  Sbu: {
    ...commonTextOption,
    title: 'Sbu',
  },
  ImportDate: {
    ...commonMediumTextOption,
    title: '导入时间',
  },
  Ywfw: {
    ...commonMediumTextOption,
    title: '业务范围',
  },
  YwfwMs: {
    ...commonLargeTextOption,
    title: '业务范围描述',
  },
  YwfwYs: {
    ...commonLargeTextOption,
    title: '分摊前业务范围',
  },
  YwfwMsYs: {
    ...commonLargeTextOption,
    title: '分摊前业务范围描述',
  },
  Department: {
    ...commonMediumTextOption,
    title: '部门',
  },
  Dygbsywd: {
    ...commonLargeTextOption,
    title: '对应管报损益维度',
  },
  Fysx: {
    ...commonMediumTextOption,
    title: '费用属性',
  },
  Fyxz: {
    ...commonMediumTextOption,
    title: '费用性质',
  },
  Sjfl: {
    ...commonMediumTextOption,
    title: '数据分类',
  },
  Ft: {
    ...commonMediumTextOption,
    title: '数据来源',
  },
  Gnfw: {
    ...commonMediumTextOption,
    title: '功能范围',
  },
  Gnfwms: {
    ...commonLargeTextOption,
    title: '功能范围描述',
  },
  Km: {
    ...commonMediumTextOption,
    title: '科目',
  },
  Kmms: {
    ...commonMediumTextOption,
    title: '科目描述',
  },
  Mjkm: {
    ...commonMediumTextOption,
    title: '末级科目',
  },
  Yskm: {
    ...commonMediumTextOption,
    title: '预算科目',
  },
  Fylb: {
    ...commonMediumTextOption,
    title: '费用类别',
  },
  Cbzx: {
    ...commonMediumTextOption,
    title: '成本中心',
  },
  Cbzxms: {
    ...commonMediumTextOption,
    title: '成本中心描述',
  },
  Cbysz: {
    ...commonMediumTextOption,
    title: '成本元素组',
  },
  Cbyszms: {
    ...commonLargeTextOption,
    title: '成本元素组描述',
  },
  Jthbje: {
    ...commonLargeTextOption,
    title: '集团货币金额',
  },
  KpiCz: {
    ...commonMediumTextOption,
    title: 'KPI产值',
  },
  CzZb: {
    ...commonMediumTextOption,
    title: '产值占比',
  },
  Tzlx: {
    ...commonMediumTextOption,
    title: '调整类型',
  },
  ImportUser: {
    ...commonMediumTextOption,
    title: '导入人员',
  },
  DatasourceTime: {
    ...commonDateOption,
    title: '抽数时间',
  },
};
// 获取表头配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    { field: 'Year' },
    { field: 'Month' },
    { field: 'Factory' },
    { field: 'Bu' },
    { field: 'Sbu' },
    { field: 'Ywfw' },
    { field: 'YwfwMs' },
    { field: 'YwfwYs' },
    { field: 'YwfwMsYs' },
    { field: 'Department' },
    { field: 'Dygbsywd' },
    { field: 'Fysx' },
    { field: 'Fyxz' },
    { field: 'Sjfl' },
    { field: 'Ft' },
    { field: 'Gnfw' },
    { field: 'Gnfwms' },
    { field: 'Km' },
    { field: 'Kmms' },
    { field: 'Mjkm' },
    { field: 'Yskm' },
    { field: 'Fylb' },
    { field: 'Cbzx' },
    { field: 'Cbzxms' },
    { field: 'Cbysz' },
    { field: 'Cbyszms' },
    { field: 'Jthbje' },
    { field: 'KpiCz' },
    { field: 'CzZb' },
    { field: 'Tzlx' },
    { field: 'ImportDate' },
    { field: 'ImportUser' },
    { field: 'DatasourceTime' },
  ];
  return columns.map(item => {
    const { field } = item;
    return merge(cloneDeep(allColumns[field]), item);
  });
};
