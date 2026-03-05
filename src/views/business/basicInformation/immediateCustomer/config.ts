import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema } from '/@/components/Form';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getProductLineList } from '/@/api/finance/materialPrice';
// import dayjs from 'dayjs';
import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
import { getFactorysList } from '/@/api/business/quantitation';

const { t } = useI18n();
const baseStore = useBaseStore();

const mainProcessList: Array<any> = [];
/** 初始化字典 */
export async function initDictionaryData(): Promise<void> {
  if (mainProcessList.length > 0) return;

  const res: Array<any> = await baseStore.getDictionaryData('MainProcess');
  mainProcessList.push(...res);
}

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.PartNumberApplyStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
];

/**
 * 清单列配置
 */
export const columns: VxeGridPropTypes.Columns = [
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
    title: t('dict.PartNumberApplyColumn.MainProcess'),
    field: 'MainProcess',
    width: 90,
    formatter: ({ cellValue }) => {
      const fullName = mainProcessList.find(item => item.enCode === cellValue).fullName;
      return fullName;
    },
  },
  // 状态
  {
    title: t('dict.PartNumberApplyColumn.Status'),
    field: 'Status',
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
    width: 120,
  },
  // 工厂
  {
    title: t('dict.PartNumberApplyColumn.Factory'),
    field: 'Factory',
    width: 80,
  },
  // 产品内部料号
  {
    title: t('dict.PartNumberApplyColumn.InsidePartNumber'),
    field: 'InsidePartNumber',
    width: 220,
  },
  // 终端客户料号
  {
    title: t('dict.PartNumberApplyColumn.TerminalCustomerPartNumber'),
    field: 'TerminalCustomerPartNumber',
    width: 160,
  },
  // // 终端客户代码
  // {
  //   title: t('dict.PartNumberApplyColumn.TerminalCustomerCode'),
  //   field: 'TerminalCustomerCode',
  //   width: 160,
  // },
  // // 产品线
  // {
  //   title: t('dict.PartNumberApplyColumn.ProductLineCode'),
  //   field: 'ProductLineName',
  //   width: 160,
  // },
  // // 终端料号版本
  // {
  //   title: t('dict.PartNumberApplyColumn.TerminalCustomerPartVersion'),
  //   field: 'TerminalCustomerPartVersion',
  //   width: 160,
  // },
  // // Config编号
  // {
  //   title: t('dict.PartNumberApplyColumn.Config'),
  //   field: 'Config',
  //   width: 160,
  // },
  // 产品描述
  {
    title: t('dict.PartNumberApplyColumn.ProductDesc'),
    field: 'ProductDesc',
    width: 160,
  },
  // 终端config描述
  {
    title: t('dict.PartNumberApplyColumn.ConfigDescription'),
    field: 'ConfigDescription',
    width: 160,
  },
  // 标签打印版本
  {
    title: t('dict.PartNumberApplyColumn.LabelPV'),
    field: 'LabelPV',
    width: 150,
  },
  // SAP公司代码
  {
    title: t('dict.PartNumberApplyColumn.SapCompanyCode'),
    field: 'SapCompanyCode',
    width: 150,
    formatter: ({ cellValue, row }) => {
      return [cellValue, row.SapCompanyName].filter(Boolean).join('/');
    },
  },
  // 直接项目代码
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerProjectCode'),
    field: 'ImmediateCustomerProjectCode',
    width: 160,
  },
  // 直接客户信息
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerName'),
    field: 'ImmediateCustomerCode',
    // formatter: ({ row }) => {
    //   return `${row.ImmediateCustomerCode || ''} / ${row.ImmediateCustomerName || ''}`;
    // },
    width: 120,
  },
  // 直接客户SAP代码
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerSapCode'),
    field: 'ImmediateCustomerSapCode',
    width: 120,
  },
  // 直接客户料号
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber'),
    field: 'ImmediateCustomerPartNumber',
    width: 160,
  },
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber2'),
    field: 'ImmediateCustomerPartNumber2',
    width: 160,
  },
  // 直接客户料号版本
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartVersion'),
    field: 'ImmediateCustomerPartVersion',
    width: 160,
  },
  // 直接客户Config描述
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerConfigDescription'),
    field: 'ImmediateCustomerConfigDescription',
    width: 160,
  },
  // AE料号
  {
    title: t('dict.PartNumberApplyColumn.AEPartNumber'),
    field: 'AEPartNumber',
    width: 160,
  },
  // 产品代码
  {
    title: t('dict.PartNumberApplyColumn.ProductCode'),
    field: 'ProductCode',
    width: 150,
  },
  {
    title: 'Batch',
    field: 'Batch',
    width: 150,
  },
  {
    title: 'V63Description',
    field: 'VSTD',
    width: 150,
  },
  {
    title: 'V64Description',
    field: 'VSFD',
    width: 150,
  },
  {
    title: 'config34',
    field: 'CTF',
    width: 150,
  },
  {
    title: 'V62config',
    field: 'VSixtyTwoConfig',
    width: 150,
  },
  {
    title: 'V63config',
    field: 'VSTC',
    width: 150,
  },
  {
    title: 'V64config',
    field: 'V64config',
    width: 150,
  },
  {
    title: 'V67config',
    field: 'VSSC',
    width: 150,
  },
  {
    title: 'V68config',
    field: 'VSEC',
    width: 150,
  },
  {
    title: 'V69config',
    field: 'V69config',
    width: 150,
  },
  // 申请人
  {
    title: t('dict.CommonCol.applyUser'),
    field: 'CreatorUserName',
    width: 220,
  },
  // 申请时间
  {
    title: t('dict.CommonCol.applyTime'),
    field: 'CreatorTime',
    width: 160,
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  //修改人
  {
    title: t('dict.CommonCol.lastModifyUserName'),
    field: 'ImmediateCustomerLastModifyUserName',
    width: 220,
  },
  // 修改时间
  {
    title: t('dict.CommonCol.lastModifyTime'),
    field: 'ImmediateCustomerLastModifyTime',
    width: 160,
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 操作列
  {
    title: t('common.action'),
    field: 'action',
    width: 60,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

/**
 * 清单 - 表单查询
 */
export const schema = [
  // 产品内部料号
  {
    fieldName: 'InsidePartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.InsidePartNumber'),
      allowClear: true,
    },
  },
  {
    fieldName: 'TerminalCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.TerminalCustomerPartNumber'),
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'Factory',
    i18nField: 'Factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactorysList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
    },
  },

  // 直接客户信息
  {
    fieldName: 'ImmediateCustomerCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.ImmediateCustomerName'),
      allowClear: true,
    },
  },
  // 直接客户料号
  {
    fieldName: 'ImmediateCustomerPartNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber'),
      allowClear: true,
    },
  },
  // 状态
  {
    fieldName: 'Status',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.Status'),
      allowClear: true,
      options: statusOptions.map(item => {
        return {
          ...item,
          label: item.fullName,
          value: item.id,
        };
      }),
    },
    span: 6,
  },
  // 终端客户信息
  {
    fieldName: 'TerminalCustomerCode',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.TerminalCustomerCode'),
      allowClear: true,
    },
  },
  {
    fieldName: 'ProductLineCode',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.ProductLineCode'),
      allowClear: true,
      api: getProductLineList,
      labelField: 'Name',
      valueField: 'Code',
      resultField: 'data',
      filterOption: false,
      nameFormat: ['Code', '-', 'Name'],
      notFoundContent: null,
      immediate: true,
    },
  },
];

/**
 * 导入 - 列配置
 */
export const importColumns = [
  // 产品内部料号
  {
    title: t('dict.PartNumberApplyColumn.InsidePartNumber'),
    dataIndex: 'InsidePartNumber',
    width: 220,
  },
  // 产品描述
  {
    title: t('dict.PartNumberApplyColumn.ProductDesc'),
    field: 'ProductDesc',
    width: 160,
  },
  // 终端config描述
  {
    title: t('dict.PartNumberApplyColumn.ConfigDescription'),
    field: 'ConfigDescription',
    width: 160,
  },
  // AE料号
  {
    title: t('dict.PartNumberApplyColumn.AEPartNumber'),
    field: 'AEPartNumber',
    width: 160,
  },

  // 直接项目代码
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerProjectCode'),
    dataIndex: 'ImmediateCustomerProjectCode',
    width: 160,
  },
  // 直接客户SAP代码
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerSapCode'),
    dataIndex: 'ImmediateCustomerSapCode',
    width: 120,
  },
  // 直接客户料号
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber'),
    dataIndex: 'ImmediateCustomerPartNumber',
    width: 160,
  },
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber2'),
    dataIndex: 'ImmediateCustomerPartNumber2',
    width: 160,
  },
  // 直接客户料号版本
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartVersion'),
    dataIndex: 'ImmediateCustomerPartVersion',
    width: 160,
  },
  // 直接客户Config描述
  {
    title: t('dict.PartNumberApplyColumn.ImmediateCustomerConfigDescription'),
    dataIndex: 'ImmediateCustomerConfigDescription',
    width: 160,
  },
  {
    title: 'V63config',
    field: 'VSTC',
    width: 150,
  },
  {
    title: 'V67config',
    field: 'VSSC',
    width: 150,
  },
  {
    title: 'V68config',
    field: 'VSEC',
    width: 150,
  },
  {
    title: 'V62config',
    field: 'VSixtyTwoConfig',
    width: 150,
  },
  {
    title: 'V64config',
    field: 'V64config',
    width: 150,
  },
  {
    title: 'V69config',
    field: 'V69config',
    width: 150,
  },
  // 产品代码
  {
    title: t('dict.PartNumberApplyColumn.ProductCode'),
    field: 'ProductCode',
    width: 150,
  },
  {
    title: 'Batch',
    field: 'Batch',
    width: 150,
  },
  {
    title: 'V63Description',
    field: 'VSTD',
    width: 150,
  },
  {
    title: 'V64Description',
    field: 'VSFD',
    width: 150,
  },
  {
    title: 'config34',
    field: 'CTF',
    width: 150,
  },
  // 标签打印版本
  {
    title: t('dict.PartNumberApplyColumn.LabelPV'),
    field: 'LabelPV',
    width: 150,
  },
  // SAP公司代码
  {
    title: t('dict.PartNumberApplyColumn.SapCompanyCode'),
    dataIndex: 'SapCompanyCode',
    width: 120,
  },
];

/**
 * 导出 - 列配置
 */
export const exportColumns = columns.slice(1, -1);

/**
 * 修改记录弹窗 - 列配置
 */
export const recordColumns: VxeGridPropTypes.Columns = [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: 50,
    align: 'center',
  },
  // 修改人
  {
    title: t('dict.PartNumberApplyColumn.record.modifyUserName'),
    field: 'modifyUserName',
    width: 150,
  },
  // 修改时间
  {
    title: t('dict.PartNumberApplyColumn.record.modifyDateTime'),
    field: 'modifyDateTime',
    width: 170,
    cellRender: {
      name: 'Date',
      // @ts-ignore
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  // 修改字段
  {
    title: t('dict.PartNumberApplyColumn.record.modifyField'),
    field: 'field',
    width: 170,
  },
  // 修改前值
  {
    title: t('dict.PartNumberApplyColumn.record.oldValue'),
    field: 'oldValue',
    width: 160,
  },
  // 修改后值
  {
    title: t('dict.PartNumberApplyColumn.record.newValue'),
    field: 'newValue',
    width: 160,
  },
];

/**
 * 编辑表单
 */
export const formSchema: FormSchema[] = [
  // 主要制程
  {
    field: 'MainProcess',
    label: t('dict.PartNumberApplyColumn.MainProcess'),
    component: 'Select',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.MainProcess'),
      allowClear: true,
      disabled: true,
      options: mainProcessList.map(item => {
        return {
          ...item,
          label: item.fullName,
          value: item.enCode,
          id: item.enCode,
        };
      }),
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 产品内部料号
  {
    label: t('dict.PartNumberApplyColumn.InsidePartNumber'),
    field: 'InsidePartNumber',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  // 终端客户代码
  {
    label: t('dict.PartNumberApplyColumn.TerminalCustomerCode'),
    field: 'TerminalCustomerCode',
    component: 'ApiSelect',
    componentProps: {
      allowClear: true,
      api: getBaseDataTerminalCustomerList,
      labelField: 'terminalCustomerCode',
      valueField: 'terminalCustomerCode',
      resultField: 'data',
      filterOption: false,
      notFoundContent: null,
      disabled: true,
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 工厂
  {
    label: '工厂',
    field: 'factoryCode',
    i18nField: 'Factory',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
      api: getFactorysList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'factoryCode',
      },
      resultField: 'data',
      labelField: 'Name',
      valueField: 'Code',
      immediate: true,
      nameFormat: ['Name', '/', 'Code'],
    },
  },
  // 产品线
  {
    label: t('dict.PartNumberApplyColumn.ProductLineCode'),
    field: 'ProductLineCode',
    component: 'ApiSelect',
    componentProps: {
      placeholder: t('dict.PartNumberApplyColumn.ProductLineCode'),
      allowClear: true,
      api: getProductLineList,
      labelField: 'Name',
      valueField: 'Code',
      resultField: 'data',
      filterOption: false,
      nameFormat: ['Code', '-', 'Name'],
      notFoundContent: null,
      immediate: true,
      disabled: true,
    },
    // rules: [{ required: true, trigger: 'blur' }],
  },
  // 终端料号版本
  {
    label: t('dict.PartNumberApplyColumn.TerminalCustomerPartVersion'),
    field: 'TerminalCustomerPartVersion',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  // Config编号
  {
    label: t('dict.PartNumberApplyColumn.Config'),
    field: 'Config',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  // 直接项目代码
  {
    label: t('dict.PartNumberApplyColumn.ImmediateCustomerProjectCode'),
    field: 'ImmediateCustomerProjectCode',
    component: 'Input',
    componentProps: {},
  },
  // 直接客户料号
  {
    label: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber'),
    field: 'ImmediateCustomerPartNumber',
    component: 'Input',
    componentProps: {},
  },
  // 直接客户料号2
  {
    label: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber2'),
    field: 'ImmediateCustomerPartNumber2',
    component: 'Input',
    componentProps: {},
  },
  // 直接客户料号版本
  {
    label: t('dict.PartNumberApplyColumn.ImmediateCustomerPartVersion'),
    field: 'ImmediateCustomerPartVersion',
    component: 'Input',
  },
  // 直接客户Config描述
  {
    label: t('dict.PartNumberApplyColumn.ImmediateCustomerConfigDescription'),
    field: 'ImmediateCustomerConfigDescription',
    component: 'Input',
  },
  // 产品描述
  {
    label: t('dict.PartNumberApplyColumn.ProductDesc'),
    field: 'ProductDesc',
    component: 'Input',
  },
];
