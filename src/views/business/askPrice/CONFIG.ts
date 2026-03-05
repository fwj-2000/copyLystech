import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';

const { t } = useI18n();
export function waitGetColumns(handleDraw, handleFileView?, showPurchasingUnit = false): any[] {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '单号',
      field: 'qrApplyCode',
      width: 150,
    },
    // 备注
    {
      title: t('common.remark'),
      field: 'isInquiry',
      width: 210,
      formatter: ({ row }) => {
        return +row.isInquiry === 1 ? t('dict.PriceInquiry.inquiryTip', [row.inquiryUserName]) : '';
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 210,
    },
    // 半成品料号
    {
      title: t('dict.SemiFinishedProductsColumn.semiFinishedProductsPartNumber'),
      field: 'semiFinishedProductsPartNumber',
      width: 150,
      formatter: ({ row }) => {
        return +row.type === 3 ? row.materialCode : '';
      },
    },
    {
      title: '项目量(W)',
      field: 'totalQty',
      width: 210,
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 210,
    },
    {
      title: '是否标记',
      field: 'inquiryMark',
      width: 120,
      formatter: ({ cellValue }) => {
        return cellValue ? t('common.yes') : t('common.no');
      },
    },
    {
      title: '产品描述',
      field: 'productDesc',
      width: 220,
    },
    {
      title: '终端客户',
      // i18nField: 'terminalCustomerPartNumber',
      field: 'terminalCustomerName',
      width: 210,
    },
    // {
    //   title: '是否保税',
    //   field: 'insidePartNumber',
    // },
    {
      title: '产品线',
      field: 'productLineName',
      width: 210,
    },
    {
      title: '材料类型',
      // field: 'materialType',
      field: 'materialAreaName',
      i18nField: 'CommonCol.materialArea',
      width: 150,
    },
    {
      title: '物料料号',
      field: 'materialCode',
      width: 220,
      formatter: ({ row }) => {
        return +row.type === 3 ? '' : row.materialCode;
      },
    },
    {
      title: '材料描述',
      field: 'materialDescription',
      width: 210,
    },
    {
      title: '新材料厂商型号',
      field: 'materialTypeFromManufacturer',
      width: 210,
    },
    {
      title: '工程图纸',
      field: 'engineeringDrawingsName',
      width: 160,
      slots: {
        default: ({ row }) => {
          return h('span', { class: 'table-a', onClick: handleDraw.bind(null, row) }, t('common.viewDetails'));
        },
      },
    },
    // 半成品图纸
    {
      title: t('dict.PriceInquiry.halfFinishedPartFiles'),
      field: 'halfFinishedPartFiles',
      width: 160,
      slots: {
        default: ({ row }) => {
          if (typeof handleFileView !== 'function') {
            return '';
          }
          return row.type === 3 ? h('span', { class: 'table-a', onClick: handleFileView.bind(null, row) }, t('common.viewDetails')) : '';
        },
      },
    },
    {
      title: '开发采购',
      field: 'purchaserName',
      width: 210,
    },
    {
      title: '采购单位',
      field: 'purchasingUnit',
      width: 80,
      visible: showPurchasingUnit,
    },
    {
      title: 'PD',
      field: 'pdName',
      width: 210,
    },
    {
      title: 'PDT Leader备注',
      field: 'pmDesc',
      width: 210,
    },
    {
      title: '客户要求交期',
      field: 'deliveryDate',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '日期',
      field: 'creatorTime',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

const userStore = useUserStore();

/** 清单页 - 搜索表单配置 */
export const formSchemas = () => [
  {
    label: '',
    fieldName: 'purchaserId',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '开发采购',
      defaultValue: userStore.getUserInfo?.userId,
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'qrApplyCode',
    component: 'Input',
    componentProps: {
      placeholder: '单号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      submitOnPressEnter: true,
    },
  },
  // {
  //   label: '',
  //   fieldName: 'status',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     placeholder: '状态',
  //     submitOnPressEnter: true,
  //     api: () => baseStore.getDictionaryData('Flow.BillStatus'),
  //     labelfieldName: 'fullName',
  //     valuefieldName: 'enCode',
  //   },
  // },
  {
    label: '',
    fieldName: 'materialCode',
    component: 'Input',
    componentProps: {
      placeholder: '物料料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'terminalCustomerName',
    component: 'Input',
    componentProps: {
      placeholder: '终端客户',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'productLineName',
    component: 'Input',
    componentProps: {
      placeholder: '产品线',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'materialAreaName',
    component: 'Input',
    i18nField: 'CommonCol.materialArea',
    componentProps: {
      placeholder: '材料类型',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'materialTypeFromManufacturer',
    component: 'Input',
    componentProps: {
      placeholder: '新材料厂商型号',
      submitOnPressEnter: true,
    },
  },
];
