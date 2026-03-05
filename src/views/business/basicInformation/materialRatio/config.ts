import type { VxeGridPropTypes, VxeTablePropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { useBaseStore } from '/@/store/modules/base';
import { getCustomerList } from '/@/api/basicData/productCodeApply';
import { useMessage } from '/@/hooks/web/useMessage';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';
import { getLabelByOptions } from '/@/views/business/report/utils';
import dayjs from 'dayjs';

import { LydcTag } from '/@/components/Lydc/Tag';

const { t } = useI18n();
const baseStore = useBaseStore();
const { createMessage } = useMessage();

/**
 * @description 导出导入按钮状态枚举
 */
export enum BUTTON_ENUM {
  导入 = 'import',
  导出 = 'export',
}

/**
 * @description 表单类型枚举
 */
export enum FORM_TYPE_ENUM {
  新增 = 'add',
  编辑 = 'edit',
  详情 = 'detail',
}

/**
 * @description 状态枚举
 */
export enum STATUS_ENUM {
  启用 = 1,
  禁用 = 2,
}

/**
 * @description 状态选项
 */
export const STATUS_OPTIONS = [
  { id: STATUS_ENUM.启用, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: STATUS_ENUM.禁用, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
];

/**
 * @description 材料形态枚举
 */
export enum MATERIA_FORM_ENUM {
  片料 = 1,
  卷料 = 2,
}

/**
 * @description 材料形态选项
 */
export const MATERIA_FORM_OPTIONS = [
  { id: MATERIA_FORM_ENUM.片料, fullName: t('dict.DieCutShipPattern.P') },
  { id: MATERIA_FORM_ENUM.卷料, fullName: t('dict.DieCutShipPattern.R') },
];

/**
 * 清单页 - 表格列配置
 */
export const vxeTableColumns: VxeGridPropTypes.Columns = [
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
  // 主要制程
  {
    title: '主要制程',
    field: 'mainProcessDesc',
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
  },
  // Site
  // {
  //   title: 'Site',
  //   field: 'site',
  //   showOverflow: 'tooltip',
  //   width: '120',
  // },
  // 是否启用
  {
    title: '是否启用',
    field: 'status',
    showOverflow: 'tooltip',
    width: '120',
    slots: {
      default: ({ row }) => {
        const { theme, fullName } = STATUS_OPTIONS.find(item => item.id === row.status) || {};
        return h(LydcTag, { theme: theme }, () => row.StatusName || fullName || row.Status);
      },
    },
  },
  // 直接客户代码
  {
    title: '直接客户代码',
    field: 'immediateCustomerCode',
    showOverflow: 'tooltip',
    width: 120,
  },
  // 直接客户
  {
    title: '直接客户',
    field: 'immediateCustomerName',
    showOverflow: 'tooltip',
    width: 120,
  },
  // 终端项目代码
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 终端客户料号
  {
    title: '终端客户料号',
    field: 'terminalCustomerPartNumber',
    showOverflow: 'tooltip',
    width: 120,
    slots: {
      default: 'terminalCustomerPartNumber',
    },
  },
  // // 片卷料形态
  // {
  //   title: '片卷料形态',
  //   field: 'shipPatternDesc',
  //   showOverflow: 'tooltip',
  //   width: 120,
  //   formatter: ({ row, cellValue }) =>
  //     getLabelByOptions(row.shipPattern, cellValue, [
  //       { label: t('dict.DieCutShipPattern.P'), value: 1 },
  //       { label: t('dict.DieCutShipPattern.R'), value: 2 },
  //     ]),
  // },
  // // 片卷料比例
  // {
  //   title: '片卷料比例',
  //   field: 'shipPatternPercent',
  //   showOverflow: 'tooltip',
  //   width: 120,
  //   formatter: ({ cellValue }: { cellValue: number | null }) => (cellValue ? `${parseFloat((+cellValue * 100).toFixed(2))}%` : ''),
  // },
  // // 创建人
  // {
  //   title: '创建人',
  //   field: 'creatorUserName',
  //   showOverflow: 'tooltip',
  //   width: '220',
  // },
  // // 创建时间
  // {
  //   title: '创建时间',
  //   field: 'creatorDateTime',
  //   showOverflow: 'tooltip',
  //   width: '150',
  //   cellRender: {
  //     name: 'Date',
  //     format: 'YYYY-MM-DD HH:mm',
  //   },
  // },
  // // 修改人
  // {
  //   title: '修改人',
  //   field: 'lastModifyUserName',
  //   showOverflow: 'tooltip',
  //   width: '220',
  // },
  // // 修改时间
  // {
  //   title: '修改时间',
  //   field: 'lastModifyDateTime',
  //   formatter: ({ cellValue }) => dayjs(cellValue).tz().format('YYYY-MM-DD HH:mm') || '',
  //   width: '150',
  //   cellRender: {
  //     name: 'Date',
  //     format: 'YYYY-MM-DD HH:mm',
  //   },
  // },
];

/**
 * 详情页面 - 新增时的表格列配置
 */
export const newDetailColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    field: 'status',
    title: t('dict.SalesShipPatternColumn.status'),
    width: '120',
    editRender: {
      enabled: true,
      name: 'ASelect',
      // @ts-ignore
      field: 'status',
      props: {
        // placeholder: '状态',
        style: 'width: 100%',
        options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        allowClear: false,
      },
      events: {
        change({ row }, _, { fullName, value }) {
          Object.assign(row, { statusDesc: fullName, status: value });
        },
      },
    },
  },
  {
    field: 'terminalCustomerProjectCode',
    title: t('dict.SalesShipPatternColumn.terminalCustomerProjectCode'),
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'terminalCustomerPartNumber',
    title: t('dict.SalesShipPatternColumn.terminalCustomerPartNumber'),
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'site',
    title: 'Site',
    showOverflow: 'tooltip',
    width: '160',
    editRender: {
      enabled: true,
      name: 'AInput',
    },
  },
  {
    field: 'immediateCustomerCode',
    title: t('dict.SalesShipPatternColumn.immediateCustomerCode'),
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'immediateCustomerName',
    title: t('dict.SalesShipPatternColumn.immediateCustomerName'),
    showOverflow: 'tooltip',
    width: '220',
    editRender: {
      enabled: true,
      name: 'AApiSelect',
      // @ts-ignore
      field: 'immediateCustomerId',
      props: {
        api: getCustomerList,
        // placeholder: '请选择直接客户信息',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'customerCode',
        filterOption: false,
        notFoundContent: null,
        immediate: false,
      },
      events: {
        change({ data, row }: { data: Array<any>; row: any }, _, record) {
          const newRecord = {
            immediateFullName: '',
            immediateCustomerId: '',
            immediateCustomerCode: '',
            immediateCustomerName: '',
          };
          // if (data.some(item => item._X_ROW_KEY !== row._X_ROW_KEY && item.immediateCustomerName === record.label)) {
          //   createMessage.warning('该直接客户已存在，请重新选择');
          // } else if (record) {
          //   Object.assign(newRecord, {
          //     immediateFullName: record.fullName,
          //     immediateCustomerId: record.id,
          //     immediateCustomerCode: record.value,
          //     immediateCustomerName: record.label,
          //   });
          // }
          record &&
            Object.assign(newRecord, {
              immediateFullName: record.fullName,
              immediateCustomerId: record.id,
              immediateCustomerCode: record.value,
              immediateCustomerName: record.label,
            });
          Object.assign(row, newRecord);
        },
      },
    },
  },
  {
    field: 'shipPattern',
    title: t('dict.SalesShipPatternColumn.shipPattern'),
    showOverflow: 'tooltip',
    // width: '160',
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
  {
    field: 'shipPatternPercent',
    title: t('dict.SalesShipPatternColumn.shipPatternPercent'),
    showOverflow: 'tooltip',
    // width: '160',
    formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : ''),
    slots: {
      header: 'ratioHeader',
      footer: ({ row }) => {
        const value = row['shipPatternPercent'] || 0;
        let color = '#faad14';

        if (value === 100) {
          color = '#52c41a';
        } else if (value > 100) {
          color = '#ff4d4f';
        }

        return h('span', { style: `color: ${color}` }, `${row['shipPatternPercent'] || 0}%`);
      },
    },
    editRender: {
      enabled: true,
      name: 'AInputNumber',
      props: {
        min: 0,
        max: 100,
        precision: 2,
        stringMode: true,
        formatter: (value: string) => `${value}%`,
      },
    },
  },
];

/**
 * 清单页 - 表格筛选表单配置
 */
export const vxeTableFormSchema = [
  {
    fieldName: 'mainProcess',
    label: '',
    component: 'ApiSelect',
    i18nField: 'mainProcessDesc',
    componentProps: {
      api: () => baseStore.getDictionaryData('MainProcess'),
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      placeholder: '主要制程',
      style: 'width: 100%',
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
    fieldName: 'shipPattern',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '片卷料形态',
      style: 'width: 100%',
      options: MATERIA_FORM_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
      allowClear: true,
    },
  },
  {
    fieldName: 'status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '是否启用',
      style: 'width: 100%',
      options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
      allowClear: true,
    },
  },
];

/**
 * 详情页面 - 编辑时显示的表格列配置
 */
export const editDetailColumns: VxeGridPropTypes.Columns = [
  {
    field: 'status',
    title: t('dict.SalesShipPatternColumn.status'),
    width: '120',
    editRender: {
      enabled: true,
      name: 'ASelect',
      // @ts-ignore
      field: 'status',
      props: {
        // placeholder: '状态',
        style: 'width: 100%',
        options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        allowClear: false,
      },
      events: {
        change({ row }, _, { fullName, value }) {
          Object.assign(row, { statusDesc: fullName, status: value });
        },
      },
    },
  },
  {
    field: 'mainProcessDesc',
    title: t('dict.SalesShipPatternColumn.mainProcessDesc'),
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
    editRender: {
      name: 'AApiSelect',
      // @ts-ignore
      field: 'mainProcess',
      enabled: false,
      props: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        // placeholder: '主要制程',
        style: 'width: 100%',
      },
      events: {
        change({ row }, _, { fullName, value, label }) {
          Object.assign(row, { mainProcessDesc: fullName || label || '', mainProcess: value || '' });
        },
      },
    },
  },
];

/**
 * 详情页面 - 表格校验规则
 */
export const detailTableEditRules: VxeTablePropTypes.EditRules<any> = {
  statusDesc: [{ required: true, message: t('common.required') }],
  // mainProcessDesc: [{ required: true, message: t('common.required') }],
  terminalCustomerPartNumber: [{ required: true, message: t('common.required') }],
  site: [{ required: true, message: t('common.required') }],
  immediateCustomerName: [{ required: true, message: t('common.required') }],
  shipPatternDesc: [{ required: true, message: t('common.required') }],
};

/** 比例格式化 */
export function formatShipPatternPercent(value: string | number) {
  return value === 0 || value ? `${Number.parseFloat((+value * 100).toFixed(2))}%` : '';
}
