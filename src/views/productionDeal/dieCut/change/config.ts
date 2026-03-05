import { getConfigtablebyprocessname } from '/@/api/basicData/processrulestemplate';

import { getProcesspreprint, addProcesspreprint, getProcesspreprintDetail, getStartworkpage } from '/@/api/productionDeal/dieCutPerPrint';

export interface ConfigType {
  getTableColumns?: (data: any) => Promise<any>;
  getTableData?: (data: any) => Promise<any>;
  getDetails?: (id: string) => Promise<any>;
  addTableItem?: (data: any) => Promise<any>;
  deleteTableItem?: (id: string) => Promise<any>;
  updateTableItem?: (id: string, data: any) => Promise<any>;
  formSchema?: Array<{
    field: string;
    label: string;
    component: string;
    componentProps?: any;
    colProps?: any;
  }>;
}

const formSchema: ConfigType['formSchema'] = [
  {
    field: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工单编码',
    },
    colProps: { span: 4 },
  },
  {
    field: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入内部料号' },
    colProps: { span: 4 },
  },
  {
    field: 'produceDate',
    label: '',
    component: 'DateRange',
    componentProps: {
      placeholder: ['打印开始时间', '打印结束时间'],
      width: '400px',
    },
  },
];
// 预打印
export const PrePrint = {
  getTableColumns: getConfigtablebyprocessname,
  getTableData: getProcesspreprint,
  getDetails: getProcesspreprintDetail,
  addTableItem: addProcesspreprint,
  formSchema,
};

// 开工
export const StartWork = {
  getTableColumns: getConfigtablebyprocessname,
  getTableData: getStartworkpage,
  getDetails: getProcesspreprintDetail,
  addTableItem: addProcesspreprint,
  formSchema,
};

// 转换
export const Change = {
  getTableColumns: getConfigtablebyprocessname,
  // getTableData: getStartworkpage,
  getTableData: getProcesspreprint,
  getDetails: getProcesspreprintDetail,
  addTableItem: addProcesspreprint,
  formSchema,
};

// 分切打印
export const SplitPrint = {
  getTableColumns: getConfigtablebyprocessname,
};

export const config = {
  StartWork,
  PrePrint,
  Change,
  SplitPrint,
};
