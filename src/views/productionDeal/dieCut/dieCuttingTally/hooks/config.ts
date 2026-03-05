import { getConfigtablebyprocessname } from '/@/api/basicData/processrulestemplate';
import {
  addDiecutquantity,
  getDiecutquantity,
  deleteDiecutquantity,
  getManualstartById,
  updateManualstartById,
  getProcesscirculation,
  deleteProcesscirculation,
  addProcesscirculation,
  updateProcesscirculation,
} from '/@/api/productionDeal/dieCuttingTally';
import { getFactoryList } from '/@/api/basicData/factory';
import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();
export const TRANSFERSTATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '/', rowKey: 'labelStatusName' },
  { id: 1, theme: 'gray', color: '#999999', fullName: '待转出', rowKey: 'labelStatusName' },
  { id: 2, theme: 'green', color: '#52C41A', fullName: '生产开工', rowKey: 'labelStatusName' },
  { id: 3, theme: 'blue', color: '#1890ff', fullName: '已接收', rowKey: 'labelStatusName' },
];

// 工序类型
export const operationType = {
  Exchange: '流转',
  ApplyWork: '报工',
};

// 工序操作类型
export const workTypes = {
  diecut: '模切',
  manual: '手工',
};

export const allWorkTypes = {
  模切: 'diecut',
  手工: 'manual',
};

export type WorkTypeKeys = keyof typeof workTypes;
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

// 模切报数页面参数
export const diecut: Partial<ConfigType> = {
  getTableColumns: getConfigtablebyprocessname,
  getTableData: getDiecutquantity,
  getDetails: getManualstartById,
  addTableItem: addDiecutquantity,
  deleteTableItem: deleteDiecutquantity,
  formSchema: [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单号',
      },
      // colProps: { span: 4 },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '请输入产品编号' },
      // colProps: { span: 4 },
    },
    {
      field: 'snCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: 'SN' },
      // colProps: { span: 4 },
    },
    {
      field: 'processName',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行工序',
        options: [],
        fieldNames: { label: 'name', value: 'name' },
      },
      // colProps: { span: 4 },
    },
    {
      field: 'documentNumber',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '请输入单据号' },
      // colProps: { span: 4 },
    },
    {
      field: 'operatorId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '请选择操作员',
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
      // colProps: { span: 4 },
    },
    {
      field: 'handleUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: userStore.getUserInfo?.userId,
        placeholder: '请选择处理人',
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
      // colProps: { span: 4 },
    },
    // {
    //   field: 'factory',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请选择厂别',
    //     api: getFactoryList,
    //     labelField: 'Name',
    //     valueField: 'Code',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //     showSearch: true,
    //     useChangeCopy: true,
    //     resultField: 'data',
    //   },
    //   colProps: { span: 4 },
    // },
    {
      field: 'produceDate',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm',
        placeholder: ['开始时间', '结束时间'],
        // width: '400px',
      },
    },
  ],
};

// 手工报数页面参数
export const manual = {
  getTableColumns: getConfigtablebyprocessname,
  getTableData: getDiecutquantity,
  getDetails: getManualstartById,
  addTableItem: addDiecutquantity,
  deleteTableItem: deleteDiecutquantity,
  updateTableItem: updateManualstartById,
  formSchema: [
    {
      field: 'planNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入计划单号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '请输入产品编号' },
      colProps: { span: 4 },
    },
    {
      field: 'produceDate',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ],
};

// -------------类型分割线---------------------

// 流转工序
export const Exchange = {
  getTableColumns: getConfigtablebyprocessname,
  getTableData: getProcesscirculation,
  getDetails: getManualstartById,
  addTableItem: addProcesscirculation,
  deleteTableItem: deleteProcesscirculation,
  updateTableItem: updateProcesscirculation,
  formSchema: [
    {
      field: 'workOrderNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'productCode',
      label: '',
      component: 'Input',
      componentProps: { placeholder: '请输入产品编号' },
      colProps: { span: 4 },
    },
    {
      field: 'dieCutter',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '请选择模切员工',
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
      colProps: { span: 4 },
    },
    {
      field: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择厂别',
        api: getFactoryList,
        labelField: 'Name',
        valueField: 'Code',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        showSearch: true,
        useChangeCopy: true,
        resultField: 'data',
      },

      colProps: { span: 4 },
    },
    {
      field: 'produceDate',
      label: '',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: ['打印开始时间', '打印结束时间'],
        width: '400px',
      },
    },
  ],
};

export const config = {
  workTypes,
  diecut,
  manual,
  Exchange,
};
