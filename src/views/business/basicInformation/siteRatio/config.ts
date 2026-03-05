import type { VxeGridPropTypes, VxeTablePropTypes } from '/@/components/VxeTable';
import type { Dayjs } from 'dayjs';

import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { useBaseStore } from '/@/store/modules/base';
// import { getCustomerList } from '/@/api/basicData/productCodeApply';
import { useMessage } from '/@/hooks/web/useMessage';
import { getSalesSiteCreateDetail } from '/@/api/business/siteRatio';
import { getMainProcessLabel } from '/@/views/business/salesForecast/config';
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
  // 终端项目代码
  {
    title: '终端项目代码',
    field: 'terminalCustomerProjectCode',
    showOverflow: 'tooltip',
    minWidth: 120,
    slots: {
      default: 'terminalCustomerProjectCode',
    },
  },
  // Site
  {
    title: 'Site',
    field: 'site',
    showOverflow: 'tooltip',
    width: '120',
  },
  // 直接客户代码
  {
    title: '直接客户代码',
    field: 'immediateCustomerCode',
    showOverflow: 'tooltip',
    minWidth: 120,
  },
  // 直接客户简称
  {
    title: '直接客户简称',
    field: 'immediateCustomerName',
    showOverflow: 'tooltip',
    minWidth: 120,
  },
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
  // 创建人
  {
    title: '创建人',
    field: 'creatorUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 创建时间
  {
    title: '创建时间',
    field: 'creatorDateTime',
    showOverflow: 'tooltip',
    width: '150',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  // 修改人
  {
    title: '修改人',
    field: 'lastModifyUserName',
    showOverflow: 'tooltip',
    width: '220',
  },
  // 修改时间
  {
    title: '修改时间',
    field: 'lastModifyDateTime',
    showOverflow: 'tooltip',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm',
    },
    width: '150',
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
    fieldName: 'terminalCustomerProjectCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '终端项目代码',
      allowClear: true,
    },
  },
  {
    fieldName: 'immediateCustomerCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '直接客户',
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
    title: t('dict.SalesSiteColumn.status'),
    width: '120',
    editRender: {
      enabled: true,
      name: 'ASelect',
      // @ts-ignore
      field: 'status',
      props: {
        placeholder: '状态',
        style: 'width: 100%',
        options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        allowClear: false,
      },
      events: {
        change({ row }, _, { fullName, value, label } = {}) {
          Object.assign(row, { statusDesc: fullName || label || '', status: value || '' });
        },
      },
    },
  },
  {
    field: 'terminalCustomerProjectCode',
    title: t('dict.SalesSiteColumn.terminalCustomerProjectCode'),
    showOverflow: 'tooltip',
    minWidth: '120',
  },
  {
    field: 'site',
    title: 'Site',
    showOverflow: 'tooltip',
    minWidth: '160',
    editRender: {
      enabled: true,
      name: 'AInput',
    },
  },
  {
    field: 'immediateCustomerCode',
    title: t('dict.SalesSiteColumn.immediateCustomerCode'),
    showOverflow: 'tooltip',
    width: '120',
  },
  {
    field: 'immediateCustomerName',
    title: t('dict.SalesSiteColumn.immediateCustomerName'),
    showOverflow: 'tooltip',
    minWidth: '220',
    formatter: 'ApiSelect',
    editRender: {
      enabled: true,
      name: 'ApiSelect',
      // @ts-ignore
      field: 'immediateCustomerId',
      props: {
        api: getSalesSiteCreateDetail,
        // placeholder: '请选择直接客户信息',
        showSearch: true,
        apiSearch: {
          show: false,
          searchName: 'keyword',
        },
        rowParams: {
          terminalCustomerProjectCode: 'terminalCustomerProjectCode',
          mainProcess: 'mainProcess',
        },
        resultField: 'data',
        labelField: 'immediateCustomerName',
        valueField: 'immediateCustomerId',
        filterOption: (value: string, option: { label: string }) => option.label.includes(value),
        notFoundContent: null,
        immediate: true,
        onChange(_, record, { data, row }) {
          const newRecord = {
            immediateFullName: '',
            immediateCustomerId: '',
            immediateCustomerCode: '',
            immediateCustomerName: '',
            immediateCustomerNameName: '',
          };
          if (record && data.some(item => item._X_ROW_KEY !== row._X_ROW_KEY && item.immediateCustomerName === record.label)) {
            Object.assign(row, newRecord);
            return createMessage.warning(t('dict.SalesSiteColumn.sameDirectCustomerTip'));
          } else if (record) {
            Object.assign(newRecord, {
              immediateFullName: record.immediateFullName,
              immediateCustomerId: record.value,
              immediateCustomerCode: record.immediateCustomerCode,
              immediateCustomerName: record.label,
            });
          }
          Object.assign(row, newRecord);
        },
      },
    },
  },
];

/**
 * 详情页面 - 全部表格列配置
 */
export const allDetailColumns: VxeGridPropTypes.Columns = [
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
    title: t('dict.SalesSiteColumn.status'),
    width: '120',
    editRender: {
      enabled: true,
      name: 'ASelect',
      // @ts-ignore
      field: 'status',
      props: {
        placeholder: '状态',
        style: 'width: 100%',
        options: STATUS_OPTIONS.map(item => ({ ...item, value: item.id, label: item.fullName })),
        allowClear: false,
      },
      events: {
        change({ row }, _, { fullName, value, label } = {}) {
          Object.assign(row, { statusDesc: fullName || label || '', status: value || '' });
        },
      },
    },
  },
  {
    field: 'mainProcessDesc',
    title: t('dict.SalesSiteColumn.mainProcessDesc'),
    showOverflow: 'tooltip',
    width: '120',
    formatter: ({ row, cellValue }) => getMainProcessLabel(row.mainProcess, cellValue),
    editRender: {
      name: 'AApiSelect',
      enabled: false,
      // @ts-ignore
      field: 'mainProcess',
      props: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        // placeholder: '主要制程',
        style: 'width: 100%',
      },
      events: {
        change({ row }, _, { fullName, value, label } = {}) {
          Object.assign(row, { mainProcessDesc: fullName || label || '', mainProcess: value || '' });
        },
      },
    },
  },
  ...newDetailColumns.slice(2),
];

/**
 * 详情页面 - 表格校验规则
 */
export const detailTableEditRules: VxeTablePropTypes.EditRules<any> = {
  statusDesc: [{ required: true, message: t('common.required') }],
  // mainProcessDesc: [{ required: true, message: t('common.required') }],
  terminalCustomerProjectCode: [{ required: true, message: t('common.required') }],
  site: [{ required: true, message: t('common.required') }],
  immediateCustomerName: [{ required: true, message: t('common.required') }],
};

/**
 * 获取起始月份和结束月份中间的所有月份，已 `YYYY-MM` 形式返回一个数组
 * @param startMonth - 起始月份
 * @param endMonth - 结束月份
 * @returns 月份数组，格式为 YYYY-MM
 */
export function getMonthRange(startMonth: Dayjs, endMonth: Dayjs): string[] {
  const monthList: string[] = [];

  let currentDate = startMonth;
  while (currentDate.isBefore(endMonth) || currentDate.isSame(endMonth)) {
    monthList.push(currentDate.format('YYYY-MM'));
    currentDate = currentDate.add(1, 'month');
  }

  return monthList;
}

/**
 * @description 按照传入的月份范围，生成表格的动态列
 * @param monthRange 月份范围，第一个元素为起始月份，第二个元素为结束月份
 * @param isCanEdit 是否允许编辑
 */
export function getDynamicsTableColumn(monthRange: [Dayjs, Dayjs] | undefined, isCanEdit = false): VxeGridPropTypes.Columns {
  if (!monthRange) return [];

  return getMonthRange(monthRange[0], monthRange[1]).map(month => {
    const [year, monthNumber] = month.split('-');
    const key = `${year}-${monthNumber.padStart(2, '0')}`;
    const field = `importDatas.${key}`;
    return {
      field,
      title: key,
      showOverflow: 'tooltip',
      minWidth: '120',
      formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : ''),
      slots: {
        header: 'ratioHeader',
        footer: ({ row }) => {
          const value = row[field] || 0;
          let color = '#faad14';

          if (value === 100) {
            color = '#52c41a';
          } else if (value > 100) {
            color = '#ff4d4f';
          }

          return h('span', { style: `color: ${color}` }, `${row[field] || 0}%`);
        },
      },
      editRender: {
        enabled: isCanEdit,
        name: 'AInputNumber',
        props: {
          min: 0,
          max: 100,
          precision: 2,
          stringMode: true,
          formatter: (value: string) => `${value}%`,
        },
      },
    };
  });
}
