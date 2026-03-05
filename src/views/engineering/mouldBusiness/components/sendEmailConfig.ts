import { useI18n } from '/@/hooks/web/useI18n';
import { formatToDate } from '/@/utils/dateUtil';
import { getSupplierlist } from '/@/api/engineering/mould';
import { h } from 'vue';
import { ITEM_TYPE_ENUM } from './config';
import { useBaseStore } from '/@/store/modules/base';

import { Input as AInput } from 'ant-design-vue';
import { LydcCustomUserSelect } from '/@/components/Lydc/Organize';

export { ITEM_TYPE_ENUM } from './config';
export { MOLD_MODIFY_TYPE } from '/@/views/engineering/mouldBusiness/apply/components/modifyPopConfig';

const { t } = useI18n();
const baseStore = useBaseStore();

/** 采购类型 选项 */
export const purchaseTypeOptions: Array<{ label: string; value: number }> = [];

/**
 * 获取【采购类型】选项
 */
export async function getPurchaseTypeOptions() {
  if (purchaseTypeOptions.length > 0) {
    return true;
  }
  return baseStore.getDictionaryData('MoldApply.PurchaseType', true).then((res: Array<any>) => {
    purchaseTypeOptions.push(
      ...res.map(el => ({
        ...el,
        label: el.fullName,
        value: el.enCode,
      })),
    );
  });
}

/** 采购邮件 列配置 */
export const getVxeProcurementColumns: (isPurchase: boolean) => any[] = (isPurchase = false) => [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  { title: '成本中心', field: 'costCenter', placeholder: '费用归属', width: '260px' },
  {
    title: '供应商',
    field: 'supplier',
    width: '260px',
    formatter: 'ApiSelect',
    editRender: {
      enabled: isPurchase,
      name: 'ApiSelect',
      cacheField: 'supplier',
      props: {
        api: getSupplierlist,
        dynamicDisabled: (row: any) => `${row.itemType}` === ITEM_TYPE_ENUM.修改审批,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        valueField: 'name',
        labelField: 'name',
        placeholder: t('common.selectText'),
        immediate: true,
        filterOption: false,
        onChange: (value: string, option: any, { row }) => handleSupplierChange(value, option, row),
      },
    },
  },
  {
    title: '供应商联系人',
    field: 'designatedEngReviewerId',
    i18nField: 'CommonCol.supplierContact',
    width: '260px',
    editRender: {
      enabled: isPurchase,
    },
    slots: {
      default: ({ row }) => row.designatedEngReviewerName,
      edit: ({ row }) => {
        if (row.supplierType === 'External') {
          // 外部供应商，直接手动输入
          return h(AInput, {
            value: row.designatedEngReviewerId,
            onChange: (value: ChangeEvent) => {
              const val = value.target?.value || '';
              row.designatedEngReviewerId = val;
              row.designatedEngReviewerName = val;
            },
          });
        }
        // 内部供应商，从用户选择
        return h(LydcCustomUserSelect, {
          value: row.designatedEngReviewerId,
          onChange: (value: string, option: any) => {
            row.designatedEngReviewerId = value;
            row.designatedEngReviewerName = option?.label || option?.fullName || '';
          },
        });
      },
    },
  },
  {
    title: '收货厂址',
    field: 'deliveryAddress',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: '320px',
    placeholder: '收货厂址',
    editRender: {
      enabled: isPurchase,
      name: 'Input',
    },
  },
  {
    title: '采购类型',
    field: 'purchaseType',
    i18nField: 'purchaseTypeName',
    width: '120px',
    editRender: {
      enabled: isPurchase,
      name: 'ASelect',
      props: {
        options: purchaseTypeOptions,
        onChange: (_value: string, option: any, { row }) => {
          row.purchaseTypeName = option?.label || '';
        },
        allowClear: true,
      },
    },
  },
  {
    title: '下单日期',
    field: 'applyDate',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: '160px',
    placeholder: '下单日期',
    formatter: ({ cellValue }) => formatToDate(cellValue),
  },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: '160px',
    placeholder: '选择日期',
    formatter: ({ cellValue }) => formatToDate(cellValue),
  },
  {
    title: '回复交期',
    field: 'replyDeliveryTime',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: '160px',
    placeholder: '选择日期',
    formatter: ({ cellValue }) => (cellValue ? formatToDate(cellValue) : ''),
  },
  { title: '产品类型', field: 'productTypeName', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '产品类型' },
  { title: '内部项目代码', field: 'insideProjectCode', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '内部项目代码' },
  { title: '模具料号', field: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: '260px', placeholder: '模具料号' },
  { title: '模具类型', field: 'moldTypeName', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '模具类型' },
  { title: '模具备注', field: 'moldRemark', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '模具备注' },
  { title: '数量', field: 'quantity', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '数量' },
  { title: '模具用途', field: 'moldUseName', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '模具用途' },
  { title: '预估寿命(KPCS)', field: 'estimateLifespan', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '预估寿命(KPCS)' },
  { title: '申请人', field: 'applyUserName', disabled: true, isEdit: true, inputType: '', width: '160px', placeholder: '申请人' },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: '160px',
    placeholder: '备注',
    editRender: {
      enabled: true,
      name: 'Input',
    },
  },
  // 操作行
  {
    title: t('common.action'),
    width: '90',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

/** 比价邮件 列配置 */
export const getVxeComparePricesCloumns: () => any[] = () => [
  {
    field: 'seq',
    title: t('component.table.index'),
    type: 'seq',
    width: '50',
    align: 'center',
  },
  {
    title: '要求交期',
    field: 'requireDeliveryTime',
    disabled: true,
    isEdit: true,
    inputType: '',
    placeholder: '选择日期',
    width: 200,
    formatter: ({ cellValue }) => formatToDate(cellValue),
  },
  { title: '产品类型', field: 'productTypeName', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '默认自动带入' },
  { title: '模具料号', field: 'moldNo', disabled: true, isEdit: true, inputType: 'code', width: 200, placeholder: '模具料号' },
  { title: '模具类型', field: 'moldTypeName', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '模具类型' },
  { title: '模具备注', field: 'moldRemark', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '模具备注' },
  // { title: '费用归属', field: 'costAttribution', disabled: true, isEdit: true, inputType: '', width: 260, placeholder: '费用归属' },
  { title: '数量', field: 'quantity', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '数量' },
  { title: '模具用途', field: 'moldUseName', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '模具用途' },
  // {
  //   title: '收货厂址',
  //   field: 'deliveryAddress',
  //   disabled: true,
  //   isEdit: true,
  //   inputType: '',
  //   width: 260,
  //   placeholder: '收货厂址',
  //   editRender: {
  //     enabled: true,
  //   },
  //   slots: {
  //     edit: 'deliveryAddress'
  //   },
  // },
  { title: '工程负责人', field: 'applyUserName', disabled: true, isEdit: true, inputType: '', width: 200, placeholder: '工程负责人' },
  // {
  //   title: '供应商',
  //   field: 'supplier',
  //   disabled: true,
  //   isEdit: true,
  //   inputType: '',
  //   width: 260,
  //   placeholder: '供应商',
  //   editRender: {
  //     enabled: true,
  //   },
  //   slots: {
  //     edit: 'supplier'
  //   },
  // },
  {
    title: '备注',
    field: 'remark',
    i18nField: 'CommonCol.remark',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: 200,
    placeholder: '备注',
    editRender: {
      enabled: true,
      name: 'Input',
    },
  },
  {
    title: '回复交期',
    field: 'replyDeliveryTime',
    disabled: true,
    isEdit: true,
    inputType: '',
    width: 200,
    placeholder: '选择日期',
    format: 'date|YYYY-MM-DD',
  },
  {
    title: '供应商报价',
    field: 'CommonCol.supplierPrices',
    disabled: true,
    isEdit: true,
    inputType: '',
    placeholder: '供应商报价',
    width: 200,
    format: 'date|YYYY-MM-DD',
  },
  // 操作行
  {
    title: t('common.action'),
    width: '90',
    field: 'action',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

/** 供应商变化处理 */
export async function handleSupplierChange(_e: any, option: any, row: any) {
  option = option || {};
  // 记录选中的`供应商sapCode`
  row.supplierSapCode = option?.sapCode || '';

  row.supplier = option?.label || option?.name || '';
  const { contactsList, supplierType } = option || { contactsList: [] };
  row.supplierType = supplierType || '';

  const _designatedEngReviewerId: any = [];
  // `contactsList`的`name`字段: 内部供应商的时候存的`id`，外部供应商存的名字
  const contactsOptions: Array<{ value: string; label: string }> = (contactsList || []).reduce((pre: Array<{ value: string; label: string }>, item: any) => {
    if (row.supplierType === 'External') {
      if (item.name && item.contactInfo) {
        _designatedEngReviewerId.push(item.name + '/' + item.contactInfo);
        pre.push({
          value: item.name + '/' + item.contactInfo,
          label: item.name + '/' + item.contactInfo,
        });
      }
    } else {
      _designatedEngReviewerId.push(item.name);
      pre.push({
        value: item.name,
        label: item.fullName || item.name,
      });
    }
    return pre;
  }, []);

  const content: any = {
    designatedEngReviewerId: _designatedEngReviewerId[0],
    designatedEngReviewerName: contactsOptions[0]?.label,
  };

  Object.assign(row, content);
}
