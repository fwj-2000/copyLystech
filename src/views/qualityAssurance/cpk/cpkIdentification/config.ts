/*
 * @Author: wenzhenjin
 * @Date: 2025-07-18 16:44:02
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-07-21 14:02:52
 * @FilePath: \lydc.server.web\src\views\qualityAssurance\cpk\cpkIdentification\config.ts
 */
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// tomake列表columns
export function waitGetColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: 'CPK标识',
      field: 'tag',
      width: 120,
      slots: { default: 'tag' },
    },
    {
      title: '产品内部料号',
      field: 'insidePnNew',
      width: 220,
    },
    {
      title: '旧版成品编码',
      field: 'insidePnOld',
      width: 220,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 180,
      formatter: ({ row }) => {
        return `${row.factoryName}(${row.factory})`;
      },
    },
    {
      title: 'SAP工厂',
      field: 'sapFactory',
      width: 180,
    },
    {
      title: '工单号',
      field: 'wo',
      width: 220,
    },
    {
      title: '成品描述',
      field: 'productDesc',
    },
  ];
}

export function waitGetSchema() {
  return [
    {
      fieldName: 'insidePnNew',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'insidePnOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
      },
    },
    {
      fieldName: 'wo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
      },
    },
    {
      fieldName: 'factoryName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
      },
    },
    {
      fieldName: 'sapFactory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'sap工厂',
      },
    },
    {
      fieldName: 'productDesc',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '成品描述',
      },
    },
  ];
}
