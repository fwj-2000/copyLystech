import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { MATERIA_FORM_OPTIONS } from '/@/views/business/basicInformation/materialRatio/config';
import { useI18n } from '/@/hooks/web/useI18n';
import { transformI18nVxeTable } from '/@/utils/index';

const { t } = useI18n();

export enum TABS_ENUM {
  用户导入 = '1',
  系统整合 = '2',
}

/**
 * @description 表单类型枚举
 */
export enum FORM_TYPE_ENUM {
  编辑 = 'edit',
  详情 = 'detail',
}

/**
 * 清单页 - 表格列配置
 */
export const _vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    field: 'checkbox',
    type: 'checkbox',
    width: '50',
    align: 'center',
  },
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  // 版本
  {
    title: '版本',
    field: 'batchCode',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: 'batchCode',
    },
  },
  // 产品内部料号(新)
  // {
  //   title: '产品内部料号(新)',
  //   field: 'insidePartNumber',
  //   showOverflow: 'tooltip',
  //   minWidth: '220',
  //   editRender: { name: 'AInput', enabled: true },
  // },
  // 产品内部料号(旧)
  {
    title: '产品内部料号(旧)',
    field: 'oldInsidePartNumber',
    showOverflow: 'tooltip',
    minWidth: '220',
    editRender: { name: 'AInput', enabled: true },
  },
  // 终端项目代码
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    showOverflow: 'tooltip',
    width: '120',
    editRender: { name: 'AInput', enabled: true },
  },
  // 终端客户料号
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    showOverflow: 'tooltip',
    width: '120',
    editRender: { name: 'AInput', enabled: true },
  },
  // 直接客户代码
  {
    title: '直接客户代码',
    field: 'immediateCustomerCode',
    showOverflow: 'tooltip',
    minWidth: '220',
    editRender: { name: 'AInput', enabled: true },
  },
  // 片卷料形态
  {
    title: '片卷料形态',
    field: 'shipPattern',
    showOverflow: 'tooltip',
    minWidth: '120',
    // @ts-ignore
    i18nField: 'shipPatternDesc',
    editRender: {
      enabled: true,
      name: 'ASelect',
      // @ts-ignore
      field: 'shipPattern',
      props: {
        style: 'width: 100%',
        options: MATERIA_FORM_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        onChange: (_, data, { row }) => {
          Object.assign(row, {
            shipPatternDesc: data?.fullName || '',
            shipPattern: data?.value || '',
          });
        },
      },
    },
  },
  // 历史出货数量
  {
    title: '历史出货数量',
    field: 'historyShippedQty',
    showOverflow: 'tooltip',
    width: '120',
    editRender: { name: 'AInput', enabled: true },
  },
  // 导入人
  {
    title: '导入人',
    field: 'importUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 导入时间
  {
    title: '导入时间',
    field: 'importDate',
    showOverflow: 'tooltip',
    width: '160',
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD HH:mm:ss',
    },
  },
  // 交货单号
  {
    title: t('dict.SFCHistory.deliveryNoteNo'),
    field: 'deliveryNoteNo',
    showOverflow: 'tooltip',
    width: '160',
    editRender: {
      name: 'Input',
    },
  },
  // 交货创建日期
  {
    title: t('dict.SFCHistory.deliveryCreationDate'),
    field: 'deliveryCreationDate',
    showOverflow: 'tooltip',
    width: '160',
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        showTime: false,
      },
    },
  },
];

/**
 * 清单页 - 表格列配置
 */
export const vxeTableColumns = transformI18nVxeTable(_vxeTableColumns, 'SalesForecastHistoryColumn');

/**
 * 清单页 - 表格筛选表单配置
 */
export const vxeTableFormSchema = [
  {
    fieldName: 'insidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号(新)',
      allowClear: true,
    },
  },
  {
    fieldName: 'oldInsidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号(旧)',
      allowClear: true,
    },
  },
  {
    fieldName: 'terminalCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户料号',
      allowClear: true,
    },
  },
  {
    fieldName: 'batchCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '版本',
      allowClear: true,
    },
  },
  {
    fieldName: 'importUser',
    label: '',
    component: 'Input',
    i18nField: 'importUserName',
    componentProps: {
      placeholder: '导入人',
      allowClear: true,
    },
  },
];

/**
 * 编辑校验规则
 */
export const editRules = {
  deliveryNoteNo: [{ required: true, message: t('common.required') }],
  deliveryCreationDate: [{ required: true, message: t('common.required') }],
};

/**
 * 根据导入数据动态生成表格列
 * @param data
 */
export function getDynamicsColumns(data: any, isCanEdit = true) {
  const columns: any[] = [];
  Object.keys(data).forEach(key => {
    columns.push({
      title: key,
      field: `importDatas.${key}`,
      showOverflow: 'tooltip',
      width: '120',
      editRender: {
        enabled: isCanEdit,
        name: 'AInput',
        props: {
          stringMode: true,
        },
      },
    });
  });
  return columns;
}
