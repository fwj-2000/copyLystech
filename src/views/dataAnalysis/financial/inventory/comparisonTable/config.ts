import { h } from 'vue';
import { exportVmiCompareCodeTemplate } from '/@/api/dataAnalysis/financial';
import { downloadFile } from '/@/views/dataAnalysis/components/BatchMenu/utils';

import SingleUploadComponent from '/@/views/dataAnalysis/components/SingleUpload.vue';
import type { VxeGridPropTypes } from 'vxe-table';
import { EFormItemType, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { MenuItemType } from '/@/views/dataAnalysis/components/BatchMenu/types';
import { commonDateOption, commonMediumTextOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';

export const templateDownloadFile = (params = {}) => {
  return downloadFile({
    params,
    requestApi: exportVmiCompareCodeTemplate,
  });
};
export const batchMenuItems: MenuItemType[] = [
  // 导入数据
  {
    label: '导入数据',
    key: 'importData',
    children: [
      // {
      //   label: '未维护数据导出',
      //   key: 'noMaintenanceDownload',
      //   clickMethod: () => {
      //     return noMaintenanceDownloadFile();
      //   },
      // },
      {
        label: '模版下载',
        key: 'templateDownload',
        clickMethod: () => {
          return templateDownloadFile();
        },
      },
      {
        label: h(SingleUploadComponent, {
          api: '/api/Report/Inventory/importVmiCompareCode',
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
    key: 'Company',
    label: '法人',
    attrs: {
      placeholder: '请输入法人',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'PiCi',
    label: '批次',
    attrs: {
      placeholder: '请输入批次',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'LiaoHao',
    label: '料号',
    attrs: {
      placeholder: '料号',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'KuCunDiDian',
    label: '库存地点',
    attrs: {
      placeholder: '请输入库存地点',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'YeWuFanWei',
    label: '业务范围',
    attrs: {
      placeholder: '请输入业务范围',
    },
  },
  {
    type: EFormItemType.INPUT,
    default: '',
    key: 'DiQu',
    label: '地区',
    attrs: {
      placeholder: '地区',
    },
  },
];

// 表格字段配置
export const getAllColumns = (): VxeGridPropTypes.Columns => {
  const columns = [
    {
      ...commonMediumTextOption,
      field: 'DiQu',
      title: '地区',
    },
    {
      ...commonMediumTextOption,
      field: 'Company',
      title: '法人',
    },
    {
      ...commonMediumTextOption,
      field: 'PiCi',
      title: '批次',
    },
    // {
    //   ...commonMediumTextOption,
    //   field: 'Lgobe',
    //   title: '库存地点描述',
    //   width: 'unset',
    // },
    {
      ...commonMediumTextOption,
      field: 'LiaoHao',
      title: '料号',
    },
    // {
    //   ...commonMediumTextOption,
    //   field: 'Types',
    //   title: '物料类型',
    //   width: 'unset',
    // },
    {
      ...commonMediumTextOption,
      field: 'KuCunDiDian',
      title: '库存地点',
    },
    {
      ...commonMediumTextOption,
      field: 'YeWuFanWei',
      title: '业务范围',
    },
  ];
  return columns;
};
