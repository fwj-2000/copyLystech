import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDate } from '/@/utils/dateUtil';
import { getSupplierlist } from '/@/api/engineering/mould';

const { t } = useI18n();

/**
 * 邮件发送 - 表单校验规则
 */
export const schemas = [
  {
    field: 'themeText',
    label: '主题',
    component: 'Input',
    i18nField: 'CommonCol.themeText',
    rules: [{ required: true, trigger: 'blur' }],
  },
];

/**
 * 邮件发送 - 表格列表配置
 */
export function getEditTableColumn() {
  return [
    {
      title: t('component.table.index'),
      type: 'seq',
      field: 'seq',
      minWidth: 50,
    },
    {
      title: '费用归属',
      field: 'costAttribution',
      formatter: ({ cellValue, row }) => row.costAttributionName || cellValue || '',
      width: 200,
    },
    {
      title: '收货厂址',
      field: 'deliveryAddress',
      width: 200,
    },
    {
      title: '下单日期',
      field: 'orderDate',
      width: 200,
      // cellRender: {
      //   name: 'Date',
      // },
      formatter: ({ cellValue }) => formatToDate(cellValue),
    },
    {
      title: '要求交期',
      field: 'requireDeliveryDate',
      width: 200,
      // cellRender: {
      //   name: 'Date',
      // },
      formatter: ({ cellValue }) => formatToDate(cellValue),
    },
    {
      title: '回复交期',
      field: 'replyDeliveryDate',
      width: 200,
      slots: {
        default: () => t('dict.SampleApply.SupplierFill'),
      },
    },
    {
      title: '模具编号',
      field: 'moldNo',
      i18nField: 'CommonCol.moldNo',
      width: 200,
    },
    {
      title: '模具类型',
      field: 'moldType',
      formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
      width: 200,
    },
    {
      title: '供方',
      field: 'supplier',
      width: 200,
      i18nField: 'supplierName',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getSupplierlist,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          showSearch: true,
          filterOption: false,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          immediate: true,
          alwaysLoad: true,
        },
      },
    },
    {
      title: '数量',
      field: 'quantity',
      width: 200,
    },
    {
      title: '工程师',
      field: 'engineeringId',
      formatter: ({ cellValue, row }) => row.engineeringName || cellValue || '',
      width: 200,
    },
    {
      title: '紧急联系人',
      field: 'emergencyContact',
      width: 200,
    },
    {
      title: '维修类型',
      field: 'repairType',
      formatter: ({ cellValue, row }) => row.repairTypeName || cellValue || '',
      width: 200,
    },
    {
      title: '维修内容(改善对策)',
      field: 'repairContent',
      width: 200,
    },
    {
      title: '图纸',
      field: 'drawingsName',
      width: 200,
      slots: {
        default: 'drawingsName',
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
  ];
}

/**
 * 邮件发送 - 表格校验规则
 */
export const editRules: any = {
  supplierId: [{ required: true, message: t('common.required') }],
};

/**
 * 回复 - 表格列表配置
 */
export function getReplyTableColumn() {
  return [
    {
      title: t('component.table.index'),
      type: 'seq',
      field: 'seq',
      minWidth: 50,
    },
  ];
}
