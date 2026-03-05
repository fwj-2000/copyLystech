import { h } from 'vue';
import { exportnomaintenance, exportwarehouselocationtemplate } from '/@/api/dataAnalysis/financial';
import { downloadFile } from '/@/views/dataAnalysis/components/BatchMenu/utils';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import type { VxeGridPropTypes } from 'vxe-table';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import { commonDateOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

// 批量导入导出菜单
export const noMaintenanceDownloadFile = (params = {}) => {
  return downloadFile({
    params,
    requestApi: exportnomaintenance,
  });
};
export const templateDownloadFile = (params = {}) => {
  return downloadFile({
    params,
    requestApi: exportwarehouselocationtemplate,
  });
};
export const batchMenuItems: MenuItemType[] = [
  // 导入数据
  {
    label: '导入数据',
    key: 'importData',
    children: [
      {
        label: '未维护数据导出',
        key: 'noMaintenanceDownload',
        clickMethod: () => {
          return noMaintenanceDownloadFile();
        },
      },
      {
        label: '模版下载',
        key: 'templateDownload',
        clickMethod: () => {
          return templateDownloadFile();
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/report/inventory/importwarehouselocation',
          buttonText: '导入',
        }),
        key: 'import',
      },
    ],
  },
  // end
];

// 表单配置
export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'werks',
    label: '工厂代码',
    attrs: {
      placeholder: '请输入工厂代码',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'lgort',
    label: '库位代码',
    attrs: {
      placeholder: '请输入库位代码',
    },
  },
];

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      field: 'Werks',
      title: '工厂代码',
    },
    {
      ...commonMediumTextOption,
      field: 'FactoryName',
      title: '工厂描述',
      width: 200,
    },
    {
      ...commonMediumTextOption,
      field: 'Lgort',
      title: '库存地点',
    },
    {
      ...commonMediumTextOption,
      field: 'Lgobe',
      title: '库存地点描述',
      width: 200,
    },
    {
      ...commonMediumTextOption,
      field: 'Gsber',
      title: '业务范围(SAP)',
    },
    {
      ...commonMediumTextOption,
      field: 'Gsber2',
      title: '业务范围(手导)',
    },
    {
      ...commonMediumTextOption,
      field: 'FactoryName2',
      title: '厂区名称(手导)',
    },
    {
      ...commonMediumTextOption,
      field: 'Isbonded',
      title: '是否保税',
    },
    {
      ...commonMediumTextOption,
      field: 'Types',
      title: '物料类型',
    },
    {
      ...commonMediumTextOption,
      field: 'Isgoodproduct',
      title: '库存分类',
    },
    {
      ...commonMediumTextOption,
      field: 'isRevenueStr',
      title: 'ZSD032是否确认收入',
    },
    {
      ...commonMediumTextOption,
      field: 'isShippeStr',
      title: '是否确认库存收入',
    },
    {
      ...commonMediumTextOption,
      field: 'Creator',
      title: '维护人',
    },
    {
      ...commonDateOption,
      field: 'CreateTime',
      title: '维护时间',
    },
  ];
  return columns;
};
