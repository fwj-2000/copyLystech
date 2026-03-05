import type { BaseVxeTableTypes } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import type { TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import type { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';

import { commonColumnOptions } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import { EFormItemType } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { downloadFile } from '/@/views/dataAnalysis/components/BatchMenu/utils';
import { h } from 'vue';
import { exportWorkShopTemplate, exportWorkShopNoMaintenance } from '/@/api/dataAnalysis/financial';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';

// 批量导入导出菜单
export const noMaintenanceDownloadFile = (params = {}) => {
  return downloadFile({
    params,
    requestApi: exportWorkShopNoMaintenance,
  });
};
export const templateDownloadFile = (params = {}) => {
  return downloadFile({
    params,
    requestApi: exportWorkShopTemplate,
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
          api: '/api/report/inventory/importWorkShop',
          buttonText: '导入',
        }),
        key: 'import',
      },
    ],
  },
  // end
];

export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  const columns: BaseVxeTableTypes.Columns = [
    {
      ...commonColumnOptions,
      field: 'Werks',
      title: '工厂',
      align: 'center',
      className: 'bg-white',
    },
    {
      ...commonColumnOptions,
      field: 'Makedept',
      title: '主治部门',
      align: 'center',
      className: 'bg-white',
    },
    {
      ...commonColumnOptions,
      field: 'WorkShop',
      title: '车间',
      align: 'center',
      className: 'bg-white',
    },
    {
      ...commonColumnOptions,
      field: 'Mrp',
      title: '控制者',
      align: 'center',
      className: 'bg-white',
    },
    {
      ...commonColumnOptions,
      field: 'Head',
      title: '负责人',
      align: 'center',
      className: 'bg-white',
    },
  ];

  return columns;
};

export const formOptions: TFormItemOption[] = [
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'Werks',
    label: '工厂',
    attrs: {
      placeholder: '请输入工厂',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'Makedept',
    label: '主治部门',
    attrs: {
      placeholder: '请输入主治部门',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'WorkShop',
    label: '车间',
    attrs: {
      placeholder: '请输入车间',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'Mrp',
    label: '控制者',
    attrs: {
      placeholder: '请输入控制者',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'Head',
    label: '负责人',
    attrs: {
      placeholder: '请输入负责人',
    },
  },
];
