import { ActionItem, BasicColumn, FormProps } from '/@/components/Table';
import { h } from 'vue';
import { useBaseStore } from '/@/store/modules/base';
import { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { isNullOrUnDef } from '/@/utils/is';
import { getFactoryList } from '/@/api/customerSerivce/index';

const { t } = useI18n();
const baseStore = useBaseStore();

const mainProcessList = await baseStore.getDictionaryData('MainProcess');
export const column = [
  {
    title: '申请单号',
    sortable: true,
    field: 'ApplyCode',
    width: 180,
  },
  {
    title: '主要制程',
    field: 'MainProcess',
    visible: false,
    formatter: ({ cellValue, column }) => {
      const fullName = mainProcessList.find(item => item.enCode === cellValue)?.fullName;
      column.copyData = fullName;
      return fullName;
    },
    aqpFilter: {
      name: 'ApiSelect',
      cSharpType: 'int',
      props: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        placeholder: '请选择',
      },
    },
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'InsidePartNumber',
    sortable: true,
    width: 220,
  },
  {
    title: '脱敏图纸',
    field: 'DesensitizedDrawingsName',
    width: 220,
    sortable: true,
    slots: { default: 'DesensitizedDrawingsName' },
  },
  {
    title: '状态',
    field: 'Status',
    sortable: true,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: [
        { id: 1, fullName: t('dict.enableStatus.1'), theme: 'green', rowKey: 'statusDesc' },
        { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.Quotation.Status.1'), theme: 'gray', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
  },
  {
    title: '是否共用件',
    field: 'IsSharePart',
    sortable: true,
    visible: false,
    cellRender: {
      name: 'Tag',
      cSharpType: 'int',
      options: [
        { id: '0', fullName: t('dict.YesOrNo.0'), theme: 'red', rowKey: 'statusDesc' },
        { id: '1', fullName: t('dict.YesOrNo.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
  },
  {
    title: '共用项目代码',
    field: 'InsideProjectCode',
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 220,
  },
  {
    title: '终端项目代码',
    field: 'TerminalCustomerProjectCode',
    width: 150,
  },
  {
    title: '终端客户料号',
    field: 'TerminalCustomerPartNumber',
    sortable: true,
    width: 120,
  },
  {
    title: '终端Config描述',
    field: 'ConfigDescription',
    sortable: true,
    width: 120,
  },
  {
    title: '终端料号版本	',
    field: 'TerminalCustomerPartVersion',
    sortable: true,
    visible: false,
    width: 120,
  },
  {
    title: '产品描述',
    field: 'ProductDesc',
    width: 220,
  },
  {
    title: 'AE料号',
    field: 'AEPartNumber',
    width: 120,
  },
  {
    title: '出货形态',
    visible: false,
    aqpFilter: {
      name: 'ApiSelect',
      searchField: 'ShipPattern',
      props: {
        api: () => baseStore.getDictionaryData('DieCutShipPattern'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    field: 'ShipPatternName',
    i18nField: 'ShipPattern',
    width: 120,
  },
  {
    title: '直接客户信息',
    field: 'ImmediateCustomerName',
    width: 260,
  },
  {
    title: '产品线信息',
    field: 'ProductLineName',
    visible: false,
    width: 160,
  },
  {
    title: '预留码',
    field: 'ReserveCode',
    visible: false,
    width: 70,
  },
  {
    title: '直接客户项目代码',
    visible: false,
    field: 'ImmediateCustomerProjectCode',
    width: 120,
  },
  {
    title: '直接客户SAP代码',
    visible: false,
    field: 'ImmediateCustomerSapCode',
    width: 120,
  },
  {
    title: '直接客户料号',
    field: 'ImmediateCustomerPartNumber',
    width: 120,
  },
  {
    title: '直接客户料号2',
    field: 'ImmediateCustomerPartNumber2',
    width: 120,
  },
  {
    title: '直接客户料号版本',
    field: 'ImmediateCustomerPartVersion',
    width: 160,
  },
  {
    title: '工厂',
    field: 'FactoryNames',
    i18nField: 'Factory',
    exportField: 'FactoryName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    //   searchField: 'Factory',
    // },
    aqpFilter: {
      name: 'ApiSelect',
      searchField: 'Factorys',
      props: {
        api: getFactoryList,
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        filterOption: false,
      },
    },
    width: 110,
  },
  {
    title: '直接客户Config描述',
    field: 'ImmediateCustomerConfigDescription',
    width: 220,
    visible: false,
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '备注',
    field: 'Remark',
    width: 120,
  },
  {
    title: '旧版成品编码',
    field: 'InsidePartNumberOld',
    width: 220,
  },
  {
    title: '失效日期',
    field: 'ExpiryDate',
    width: 160,
    sortable: true,
    visible: false,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '项目资料',
    field: 'projectFile',
    visible: false,
    width: 210,
    slots: { default: 'projectFile' },
  },
  {
    title: 'V63config',
    field: 'VSTC',
    visible: false,
    width: 150,
  },
  {
    title: 'V67config',
    field: 'VSSC',
    visible: false,
    width: 150,
  },
  {
    title: 'V68config',
    field: 'VSEC',
    visible: false,
    width: 150,
  },
  {
    title: 'V62config',
    field: 'VSixtyTwoConfig',
    visible: false,
    width: 150,
  },
  {
    title: 'V64config',
    field: 'V64config',
    visible: false,
    width: 150,
  },
  {
    title: 'V69config',
    field: 'V69config',
    visible: false,
    width: 150,
  },
  {
    title: '产品代码',
    field: 'ProductCode',
    visible: false,
    width: 150,
  },
  {
    title: 'Batch',
    field: 'Batch',
    visible: false,
    width: 150,
  },
  {
    title: 'V63Description',
    field: 'VSTD',
    visible: false,
    width: 150,
  },
  {
    title: 'V64Description',
    field: 'VSFD',
    visible: false,
    width: 150,
  },
  {
    title: 'config34',
    field: 'CTF',
    visible: false,
    width: 150,
  },
  {
    title: '标签打印版本',
    field: 'LabelPV',
    visible: false,
    width: 150,
  },
  {
    title: 'SAP公司代码',
    field: 'SapCompanyCode',
    visible: false,
    width: 150,
    formatter: ({ cellValue, row }) => {
      return [cellValue, row.SapCompanyName].filter(Boolean).join('/');
    },
  },
  {
    title: '申请人',
    field: 'ApplyUserName',
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    aqpFilter: {
      searchField: 'ApplyUserId',
      name: 'CustomUserSelect',
    },
    width: 210,
  },
  {
    title: '申请部门',
    field: 'ApplyDeptName',
    visible: false,
    width: 220,
  },
  {
    title: '申请日期',
    field: 'ApplyDate',
    width: 160,
    sortable: true,
    cellRender: {
      name: 'Date',
    },
  },
  { title: '修改人', field: 'LastModifyUserName', width: 160 },
  {
    title: '修改日期',
    field: 'LastModifyTime',
    visible: false,
    sortable: true,
    width: 160,
    cellRender: {
      name: 'Date',
    },
  },
];
export const UPLOAD_POP_COLUMNS: BasicColumn[] = [
  {
    title: t('dict.PCCColumn.status'),
    dataIndex: 'statusDesc',
    customRender: ({ record, text }) => {
      if (record.status == 1) {
        return h(
          'span',
          {
            style: {
              color: '#52C41A',
            },
          },
          text,
        );
      } else {
        return h(
          'span',
          {
            style: {
              color: '#FF4D4F',
            },
          },
          text,
        );
      }
    },
  },
  { title: t('dict.DrawingsReviewColumn.sheetName'), dataIndex: 'originFileName', width: 260 },
  { title: t('dict.SalesForecastColumn.InsidePartNumber'), dataIndex: 'insidePartNumber', width: 260 },
  {
    title: t('component.upload.version'),
    dataIndex: 'version',
    customRender: ({ text }) => {
      return isNullOrUnDef(text) ? '/' : `T${text}`;
    },
  },
];

export function importColumns(): BasicColumn[] {
  return [
    { title: '主要制程', dataIndex: 'MainProcessName', width: 120 },
    // { title: '终端项目代码', dataIndex: 'TerminalCustomerProjectCode', width: 150 },
    // { title: '终端客户料号', dataIndex: 'TerminalCustomerPartNumber', width: 120 },
    // { title: '产品描述', dataIndex: 'ProductDesc', width: 220 },
    // {
    //   title: '出货形态',
    //   dataIndex: 'ShipPatternName',
    //   width: 120,
    // },
    // { title: '直接客户信息', dataIndex: 'ImmediateCustomerCode', width: 220 },
    // { title: '预留码', dataIndex: 'ReserveCode', width: 70 },
    // { title: '直接客户项目代码', dataIndex: 'ImmediateCustomerProjectCode', width: 120 },
    // { title: '直接客户料号', dataIndex: 'ImmediateCustomerPartNumber', width: 120 },
    // { title: '直接客户料号版本', dataIndex: 'ImmediateCustomerPartVersion', width: 160 },
    // { title: '工厂', dataIndex: 'Factory', width: 110 },
    // { title: '备注', dataIndex: 'Remark', width: 120 },
    // { title: '失效日期', dataIndex: 'ExpiryDate', width: 160, format: 'date|YYYY-MM-DD' },
    // { title: '申请人', dataIndex: 'ApplyUserName', width: 120 },
    // { title: '申请部门', dataIndex: 'ApplyDeptName', width: 220 },
    // { title: '申请日期', dataIndex: 'ApplyDate', width: 160, format: 'date|YYYY-MM-DD HH:mm:ss' },
    {
      title: '共用件提示',
      dataIndex: 'repetitionMsg',
      width: 160,
    },
    {
      title: '内部项目代码',
      dataIndex: 'InsideProjectCode',
      width: 120,
    },
    {
      title: '终端客户料号',
      dataIndex: 'TerminalCustomerPartNumber',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 120,
    },
    {
      title: '产品描述',
      dataIndex: 'ProductDesc',
      width: 220,
    },
    {
      title: '标签版本打印',
      dataIndex: 'LabelPV',
      width: 220,
    },
    {
      title: 'SAP公司代码',
      dataIndex: 'SapCompanyCode',
      width: 120,
    },
    {
      title: '终端料号版本',
      dataIndex: 'TerminalCustomerPartVersion',
      width: 120,
    },
    {
      title: 'Config编号',
      dataIndex: 'Config',
      width: 120,
    },
    {
      title: 'Config描述',
      dataIndex: 'ConfigDescription',
      width: 120,
    },
    {
      title: '',
      dataIndex: 'AEPartNumber',
      width: 120,
    },
    {
      title: '出货形态',
      dataIndex: 'ShipPatternName',
      width: 120,
    },
    {
      title: '直接客户信息',
      dataIndex: 'ImmediateCustomerCode',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 120,
    },
    {
      title: '预留码',
      dataIndex: 'ReserveCode',
      width: 120,
    },
    {
      title: '直接客户项目代码',
      dataIndex: 'ImmediateCustomerProjectCode',
      width: 120,
    },
    {
      title: '直接客户SAP代码',
      dataIndex: 'ImmediateCustomerSapCode',
      width: 120,
    },
    {
      title: '直接客户料号',
      dataIndex: 'ImmediateCustomerPartNumber',
      width: 120,
    },
    {
      title: '直接客户料号2',
      dataIndex: 'ImmediateCustomerPartNumber2',
      width: 120,
    },
    {
      title: '直接客户料号版本',
      dataIndex: 'ImmediateCustomerPartVersion',
      width: 120,
    },
    {
      title: '工厂',
      dataIndex: 'Factory',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      width: 180,
    },
    {
      title: '旧版成品编码',
      dataIndex: 'InsidePartNumberOld',
      width: 220,
    },
  ];
}

export function getFormConfig(): FormSchema[] {
  return {
    baseColProps: {
      span: 4,
    },
    autoAdvancedLine: 1,
    autoSubmitOnEnter: true,
    schemas: [
      {
        field: 'ApplyCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '申请单号',
          submitOnPressEnter: true,
        },
      },
      {
        field: 'ApplyUserName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '申请人',
          submitOnPressEnter: true,
        },
      },
      {
        field: 'InsidePartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
        },
      },
      // {
      //   field: 'TerminalCustomerCode',
      //   label: '',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '终端客户代码',
      //   },
      // },
      {
        field: 'ImmediateCustomerCode',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户信息',
        },
      },
      {
        field: 'Status',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: '状态',
        },
      },
      {
        field: 'ImmediateCustomerPartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户料号',
        },
      },
      {
        field: 'TerminalCustomerPartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
        },
      },
      {
        field: 'ProductDesc',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品描述',
        },
      },
      // {
      //   field: 'InsideProjectCode',
      //   label: '',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '内部项目代码',
      //   },
      // },
      {
        field: 'Factory',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '工厂',
        },
      },
    ],
  };
}

export function getColumn(hasPermission?: any): any {
  const { hasBtnP } = usePermission();
  const columnData: any = cloneDeep(column);
  if (hasBtnP('btn_detail') || hasPermission) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    columnData.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export function getVxeSchema() {
  return [
    {
      fieldName: 'ApplyCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请单号',
      },
    },
    {
      fieldName: 'InsidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'ImmediateCustomerCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户信息',
      },
    },
    {
      fieldName: 'TerminalCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
      },
    },
    {
      fieldName: 'DrawingPersonId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '图纸上传人',
        immediate: true,
      },
    },
    {
      fieldName: 'Factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
      },
    },
    {
      fieldName: 'ApplyUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
      },
    },
    {
      fieldName: 'ShipPattern',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '出货形态',
        api: () => baseStore.getDictionaryData('DieCutShipPattern'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
    },
    {
      fieldName: 'ProductDesc',
      label: '',
      component: 'Input',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '产品描述',
      },
    },
    {
      fieldName: 'Status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: t('dict.enableStatus.1'), enCode: 1 },
          { fullName: t('common.disableText'), enCode: 2 },
          { fullName: t('dict.Quotation.Status.1'), enCode: 3 },
        ],
      },
    },
    {
      fieldName: 'ImmediateCustomerPartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户料号',
      },
    },
    {
      fieldName: 'IsSharePart',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '是否共用件',
        api: () => baseStore.getDictionaryData('YesOrNo'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
    },
  ];
}
