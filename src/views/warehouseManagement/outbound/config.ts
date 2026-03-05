import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/basicData/factory';
import { FormSchema } from '/@/components/Form';
import { Props } from 'ant-design-vue/lib/form/useForm';

const baseStore = useBaseStore();

export const STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'statusName' },
  { id: 1, theme: 'blue', color: '#1890FF', fullName: '处理中', rowKey: 'statusName' },
  { id: 2, theme: 'green', color: '#52C41A', fullName: '已处理', rowKey: 'statusName' },
  { id: 3, theme: 'purple', color: '#DA5BFB', fullName: '撤回', rowKey: 'statusName' },
  { id: 4, theme: 'yellow', color: '#FAAD14', fullName: '驳回', rowKey: 'statusName' },
  { id: 5, theme: 'red', color: '#FF4D4F', fullName: '终止', rowKey: 'statusName' },
];

export const AUDIT_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'auditStatusName' },
  { id: 1, theme: 'blue', color: '#52C41A', fullName: '已处理', rowKey: 'auditStatusName' },
];

export const OUTBOUND_STATUS_OPTIONS = [
  { id: 0, theme: 'gray', color: '#999999', fullName: '待处理', rowKey: 'warehouseAuditStatusName' },
  { id: 1, theme: 'blue', color: '#52C41A', fullName: '已处理', rowKey: 'warehouseAuditStatusName' },
];

export const formConfig = [
  {
    fieldName: 'moldNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入模具编码', maxlength: 50 },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    componentProps: { placeholder: '请输入工单号', maxlength: 50 },
  },
  {
    fieldName: 'factory',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '工厂',
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
  },
];

export const COLUMNS = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  { title: '来源类型', field: 'sourceTypeName' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '模具编号', field: 'moldNo' },
  { title: '客户', field: 'customer' },
  { title: '地址', field: 'deliveryAddress' },
  { title: '描述', field: 'depiction' },
  { title: '当前处理人', field: 'currentProcessorName' },
  { title: '计划入库数量', field: 'planStoreQuantity' },
  { title: '实际入库数量', field: 'actualStoreQuantity' },
  { title: '实际出库数量', field: 'actualOutboundQuantity' },
  { title: '计量单位', field: 'unitName' },
  { title: '工厂', field: 'factoryName' },
  { title: '出库人', field: 'outboundUserName' },
  {
    title: '出库时间',
    field: 'outboundDate',
    cellRender: {
      name: 'Date',
    },
  },
  { title: '操作', field: 'action', slots: { default: 'action' }, width: 80, fixed: 'right' },
];

export const LEADERSHIP_COLUMNS: BasicColumn[] = [
  { title: '来源类型', dataIndex: 'sourceTypeName' },
  { title: '单据号', dataIndex: 'documentNumber' },
  { title: '工单号', dataIndex: 'workOrderNo' },
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '描述', dataIndex: 'depiction' },
  { title: '状态', dataIndex: 'auditStatus', format: `tag|${JSON.stringify(AUDIT_STATUS_OPTIONS)}` },
  { title: '节点记录', dataIndex: 'nodeDetail' },
  { title: '当前处理人', dataIndex: 'currentProcessorName' },
  { title: '计划入库数量', dataIndex: 'planStoreQuantity' },
  { title: '实际入库数量', dataIndex: 'actualStoreQuantity' },
  { title: '计量单位', dataIndex: 'unitName' },
  { title: '工厂', dataIndex: 'factoryName' },
  { title: '仓库代码', dataIndex: 'warehouseCode' },
  { title: '仓库名称', dataIndex: 'warehouseName' },
  { title: 'LotNo', dataIndex: 'lotNo' },
  { title: '创建人', dataIndex: 'applyUserName' },
  {
    title: '创建时间',
    dataIndex: 'applyDate',
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
  {
    title: '审批时间',
    dataIndex: 'auditDate',
    width: 120,
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
  { title: '修改人', dataIndex: 'lastModifyUserName' },
  {
    title: '修改时间',
    dataIndex: 'lastModifyTime',
    width: 120,
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
];

export const WAREHOUSEAPPROVAL_COLUMNS: BasicColumn[] = [
  { title: '来源类型', dataIndex: 'sourceTypeName' },
  { title: '单据号', dataIndex: 'documentNumber' },
  { title: '工单号', dataIndex: 'workOrderNo' },
  { title: '模具编号', dataIndex: 'moldNo' },
  { title: '描述', dataIndex: 'depiction' },
  { title: '状态', dataIndex: 'warehouseAuditStatus', format: `tag|${JSON.stringify(OUTBOUND_STATUS_OPTIONS)}` },
  { title: '节点记录', dataIndex: 'nodeDetail' },
  { title: '当前处理人', dataIndex: 'currentProcessorName' },
  { title: '计划入库数量', dataIndex: 'planStoreQuantity' },
  { title: '实际入库数量', dataIndex: 'actualStoreQuantity' },
  { title: '计量单位', dataIndex: 'unitName' },
  { title: '工厂', dataIndex: 'factoryName' },
  { title: '仓库代码', dataIndex: 'warehouseCode' },
  { title: '仓库名称', dataIndex: 'warehouseName' },
  { title: 'LotNo', dataIndex: 'lotNo' },
  { title: '创建人', dataIndex: 'applyUserName' },
  {
    title: '创建时间',
    dataIndex: 'applyDate',
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
  {
    title: '审批时间',
    dataIndex: 'auditDate',
    width: 120,
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
  { title: '修改人', dataIndex: 'lastModifyUserName' },
  {
    title: '修改时间',
    dataIndex: 'lastModifyTime',
    width: 120,
    format: 'date|YYYY-MM-DD hh:mm:ss',
  },
];

export const PRINT_COLUMNS: any[] = [
  {
    title: '采购订单号',
    dataIndex: 'poNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
    },
  },
  {
    title: '模具编号',
    dataIndex: 'moldNo',
    isEdit: true,
    inputType: 'code',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
    },
  },
  {
    title: '齿数',
    dataIndex: 'teethQuantity',
    isEdit: true,
    inputType: 'number',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
      min: 0,
    },
  },
  {
    title: '模数',
    dataIndex: 'modulus',
    isEdit: true,
    inputType: 'float',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
      min: 0,
    },
  },
  {
    title: '工程',
    dataIndex: 'pdId',
    isEdit: true,
    inputType: '',
    cpmType: 'CustomUserSelect',
    cpmSetting: {
      placeholder: '请输入',
      showSearch: false,
      resultField: 'data',
      valueField: 'id',
      labelField: 'name',
      filterOption: false,
      immediate: false,
    },
  },
  {
    title: '数量/PCS',
    dataIndex: 'planStoreQuantity',
    isEdit: true,
    inputType: 'number',
    width: 260,
    cpmType: 'Input',
    cpmSetting: {
      placeholder: '请输入',
      min: 0,
    },
  },
  {
    title: '备注',
    dataIndex: 'depiction',
    isEdit: true,
    inputType: '',
    cpmType: 'Input',
    cpmSetting: { placeholder: '请输入' },
  },
];

export const PRINT_SCHEMAS: FormSchema[] = [
  {
    field: 'customer',
    label: '客户',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      fieldNames: {
        label: 'fullName',
        value: 'fullName',
      },
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
  {
    field: 'deliveryAddress',
    label: '地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],

    colProps: { span: 6 },
  },
  {
    field: 'contactsId',
    label: '联系人',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '请选择',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],

    colProps: { span: 6 },
  },
  {
    field: 'deliveryPersonId',
    label: '送货人',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '请选择',
    },
    rules: [{ required: true, message: '', trigger: 'blur' }],
    colProps: { span: 6 },
  },
];

export const BASICINFO_FORMCONFIG: Props = {
  labelWidth: 120,
  baseColProps: { span: 6 },
  actionColOptions: { span: 24 },
  autoSubmitOnEnter: true,
  layout: 'vertical',
  // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
  schemas: PRINT_SCHEMAS,
};
