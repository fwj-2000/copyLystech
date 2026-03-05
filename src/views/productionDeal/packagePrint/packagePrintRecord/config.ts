import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'WorkOrder',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'InnerMaterialCode ',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '工单号',
    sortable: true,
    field: 'WorkOrder',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 180,
  },
  {
    title: '内部料号',
    field: 'InnerMaterialCode',
    width: 160,
  },
  {
    title: '单据号',
    field: 'Fnumber',
    width: 160,
    // i18nField: 'CommonCol.oldMoldNo',
  },
  {
    title: '客户',
    field: 'Customer',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '打印类型',
    field: 'PrintTypeName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '数量',
    field: 'Qty',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '包装类型(Sheet/Roll)',
    field: 'PackTypeName',
    sortable: true,
    width: 180,
  },
  {
    title: 'PE流水号',
    field: 'PeLotNo',
    sortable: true,
    width: 120,
  },
  {
    title: 'IN流水号',
    field: 'InLotNo',
    width: 100,
    // i18nField: 'attachmentName',
  },
  {
    title: 'OUT流水号',
    field: 'OutLotNo',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: 'APN',
    field: 'APN',
    width: 120,
  },
  {
    title: '备注',
    field: 'Remark',
    width: 100,
  },
  {
    title: '打印人',
    field: 'CreatorUserName',
    width: 100,
  },
  {
    title: '打印时间',
    field: 'CreatorTime',
    width: 100,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];

export function getColumn(activeKey): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  // if (hasBtnP('btn_detail')) {
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  columnData.push({
    title: t('common.action'),
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  });
  // }
  if (activeKey === 'PE') {
    return columnData;
  } else if (activeKey === 'IN') {
    const INList = columnData.filter(item => item.field !== 'PeLotNo');
    return INList;
  } else if (activeKey === 'OUT') {
    const OUTList = columnData.filter(item => item.field !== 'PeLotNo' && item.field !== 'InLotNo');
    return OUTList;
  }
}

export const formSchemas = [
  {
    field: 'InnerMaterialCode',
    label: '内部料号',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: '内部料号',
    },
  },
  {
    field: 'APN',
    label: 'APN',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: 'APN',
    },
  },
  {
    field: 'PeQuantity',
    label: 'PE数量',
    component: 'Input',
    componentProps: {
      disabled: true,
      placeholder: 'PE数量',
    },
  },
];
