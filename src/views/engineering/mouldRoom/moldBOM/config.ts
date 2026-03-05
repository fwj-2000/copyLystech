import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();
const { t } = useI18n();

export const formSchemas = [
  {
    field: 'moldNo',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '模具编号',
      submitOnPressEnter: true,
    },
  },
  {
    field: 'code',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '项目代码',
      submitOnPressEnter: true,
    },
    i18nField: 'projectCode',
  },
  {
    field: 'productName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '产品名称',
      submitOnPressEnter: true,
    },
  },
  {
    field: 'material',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '材质',
      submitOnPressEnter: true,
    },
  },
  {
    field: 'category',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '分类',
      submitOnPressEnter: true,
    },
  },
];

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'gray', rowKey: 'statusDesc' },
];

export const column = [
  // { title: '序号', type: 'seq', field: 'index', width: 50 },
  {
    title: 'BOM单据号',
    sortable: true,
    field: 'bomDocumentNumber',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '项目代码',
    field: 'projectCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '产品名称',
    field: 'productName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '版本号',
    field: 'bomVersion',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '入ERP系统',
    field: 'erpSystem',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '产品材料',
    field: 'productMaterials',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '费用归属',
    field: 'expenseAttribution',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '零件名称',
    field: 'partName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '零件编号',
    field: 'partNo',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '规格',
    field: 'specification',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '材质',
    field: 'material',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },

  {
    title: '数量',
    field: 'quantity',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 120,
  },
  {
    title: '是否需要加工',
    field: 'isNeedProcess',
    width: 160,
    slots: {
      default: 'IsNeedProcess',
    },
  },
  {
    title: '是否胶位件',
    field: 'isRubberPart',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    slots: {
      default: 'IsRubberPart',
    },
  },
  {
    title: '附图订购',
    field: 'isDrawOrder',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    slots: {
      default: 'IsDrawOrder',
    },
  },
  {
    title: '类别',
    field: 'category',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '留有余量',
    field: 'isLeaveMargin',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    slots: {
      default: 'IsLeaveMargin',
    },
  },
  {
    title: '硬度要求',
    field: 'hardnessRequirement',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '品牌',
    field: 'brand',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '需求日期',
    field: 'demandDate',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  {
    title: '是否启用',
    field: 'enabledStatus',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
  },
  {
    title: '备注',
    field: 'remark',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '预估价格(总)',
    field: 'estimatedTotalPrice',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
    i18nField: 'CommonCol.creatorUserName',
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 160,
    i18nField: 'CommonCol.creatorTime',
  },
];

export function getColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  if (hasBtnP('btn_detail')) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    // columnData.push({
    //   title: t('common.action'),
    //   field: 'action',
    //   slots: { default: 'action' },
    //   width: 100,
    //   fixed: 'right',
    // });
  }
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export const importColumns = [
  {
    title: '提示信息',
    dataIndex: 'confirmMsg',
    width: 120,
    i18nField: 'CommonCol.promptMessage',
  },
  {
    title: '行号',
    dataIndex: 'number',
    width: 120,
    i18nField: 'CommonCol.lineNumber',
  },
  {
    title: '项目代码',
    dataIndex: 'projectCode',
    width: 120,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: 120,
  },
  {
    title: '版本号',
    dataIndex: 'bomVersion',
    width: 120,
  },
  {
    title: '入ERP系统',
    dataIndex: 'erpSystem',
    width: 120,
  },
  {
    title: '产品材料',
    dataIndex: 'productMaterials',
    width: 120,
  },
  {
    title: '费用归属',
    dataIndex: 'expenseAttribution',
    width: 120,
  },
  {
    title: '零件名称',
    dataIndex: 'partName',
    width: 120,
  },
  {
    title: '零件编号',
    dataIndex: 'partNo',
    width: 120,
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: 120,
  },
  {
    title: '材质',
    dataIndex: 'material',
    width: 120,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    width: 120,
  },
  // {
  //   title: '零件形状',
  //   dataIndex: 'partShape',
  //   width: 120,
  // },
  {
    title: '是否加工',
    dataIndex: 'isNeedProcessName',
    width: 120,
  },
  {
    title: '是否胶位件',
    dataIndex: 'isRubberPartName',
    width: 120,
  },
  {
    title: '附图订购',
    dataIndex: 'isDrawOrderName',
    width: 120,
  },
  {
    title: '类别',
    dataIndex: 'category',
    width: 120,
  },
  {
    title: '留有余量',
    dataIndex: 'isLeaveMarginName',
    width: 120,
  },
  {
    title: '硬度要求',
    dataIndex: 'hardnessRequirement',
    width: 120,
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    width: 120,
  },
  {
    title: '需求日期',
    dataIndex: 'demandDate',
    format: 'date|YYYY-MM-DD',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '预估价格(总)',
    dataIndex: 'estimatedTotalPrice',
    width: 120,
  },
  {
    title: '创建人',
    dataIndex: 'creatorUserName',
    width: 120,
    i18nField: 'CommonCol.creatorUserName',
  },
  {
    title: '创建时间',
    dataIndex: 'creatorTime',
    width: 120,
    i18nField: 'CommonCol.creatorTime',
  },
];

export const PartInformationColumn: any[] = [
  {
    title: '零件名称',
    field: 'partName',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '零件编号',
    field: 'partNo',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '规格',
    field: 'specification',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '材质',
    field: 'material',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '数量',
    field: 'quantity',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  // {
  //   title: '零件形状',
  //   field: 'partShape',
  //   minWidth: 120,
  //   editRender: {
  //     name: 'Input',
  //   },
  // },
  {
    title: '是否加工',
    field: 'isNeedProcess',
    minWidth: 120,
    editRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '是', enCode: 1 },
          { fullName: '否', enCode: 0 },
        ],
      },
    },
  },
  {
    title: '是否胶位件',
    field: 'isRubberPart',
    minWidth: 120,
    editRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '是', enCode: 1 },
          { fullName: '否', enCode: 0 },
        ],
      },
    },
  },
  {
    title: '附图订购',
    field: 'isDrawOrder',
    minWidth: 120,
    editRender: {
      name: 'ASelect',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: '是', enCode: 1 },
          { fullName: '否', enCode: 0 },
        ],
      },
    },
  },

  {
    title: '类别',
    field: 'category',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '留有余量',
    field: 'isLeaveMargin',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '硬度要求',
    field: 'hardnessRequirement',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '品牌',
    field: 'brand',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '需求日期',
    field: 'demandDate',
    minWidth: 160,
    editRender: {
      name: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '是否启用',
    field: 'enabledStatus',
    minWidth: 120,
    editRender: {
      name: 'ApiSelect',
      props: {
        api: () => baseStore.getDictionaryData('enableStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        onChange(_: any, option: any, { row }) {
          row.enabledStatus = option?.label || '';
        },
      },
    },
    i18nField: 'CommonCol.isEnable',
  },
  {
    title: '备注',
    field: 'remark',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '预估价格(总)',
    field: 'estimatedTotalPrice',
    minWidth: 120,
    editRender: {
      name: 'Input',
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const PART_TABLE_ROW_DATA = {
  partName: '',
  partNo: '',
  specification: '',
  material: '',
  quantity: '',
  partShape: '',
  isRubberPart: '',
  isDrawOrder: '',
  category: '',
  isLeaveMargin: '',
  hardnessRequirement: '',
  brand: '',
  demandDate: '',
  enabledStatus: '',
  remark: '',
  estimatedTotalPrice: '',
  creatorUserName: '',
  creatorTime: '',
};

export const detailFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'projectCode',
    label: '项目代码',
    component: 'Input',
    componentProps: { placeholder: '请输入' },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: {
      placeholder: t('请输入'),
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'erpSystem',
    label: '入ERP系统',
    component: 'Input',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'expenseAttribution',
    label: '费用归属',
    component: 'Input',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'bomVersion',
    label: '版本',
    component: 'Input',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'productMaterials',
    label: '产品材料',
    component: 'Input',
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'orgId',
    label: '组织名称',
    component: 'TreeSelect',
    slot: 'OrgId',
    componentProps: { placeholder: '请选择组织' },
    rules: [{ required: true, trigger: 'change', message: '必填' }],
    i18nField: 'CommonCol.organizationName',
  },
];
