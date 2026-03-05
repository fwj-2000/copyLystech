import { BasicColumn } from '/@/components/Table';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';

const { t } = useI18n();
const baseStore = useBaseStore();

export function getEcnApplyColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: '请选择产品内部料号',
        api: getPartNumberApplySearch,
        showSearch: true,
        resultField: 'data',
        notFoundContent: null,
        labelField: 'insidePartNumber',
        valueField: 'insidePartNumber',
        immediate: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        onChange: (insidePartNumber, data, record) => {
          console.log(insidePartNumber);
          const { factory, productDesc, members } = data;
          const { editValueRefs } = record;
          console.log(members);
          editValueRefs.factory = factory;
          editValueRefs.productDesc = productDesc;
          const PD = members.find(item => item.configType === 'PDPerson')?.memberName;
          editValueRefs.pd = PD || '';
        },
      },
      width: 120,
    },
    {
      title: '资料类型',
      dataIndex: 'documentType',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: '请选择资料类型',
        api: () => baseStore.getDictionaryData('EngineeringDocApply.DocType', true),
        showSearch: true,
        resultField: 'data',
        notFoundContent: null,
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
      },
      width: 120,
    },
    {
      title: t('dict.CommonCol.factory'),
      dataIndex: 'factoryName',
      width: 120,
      // editComponent: 'ApiSelect',
      // editComponentProps: {
      //   api: getFactoryList,
      //   showSearch: true,
      //   apiSearch: {
      //     show: true,
      //     searchName: 'keyword',
      //   },
      //   resultField: 'data',
      //   labelField: 'Name',
      //   valueField: 'Code',
      //   immediate: true,
      // },
    },
    {
      title: '变更后版本',
      dataIndex: 'version',
      width: 100,
      customRender: ({ text }) => {
        return `T${text}`;
      },
    },
    {
      title: '产品描述',
      dataIndex: 'productDesc',
      editRow: true,
      width: 120,
    },
  ];
}

export function getApplyColumns(): BasicColumn[] {
  return [
    {
      title: '产品内部料号',
      dataIndex: 'insidePartNumber',
      editComponent: 'Input',
      editComponentProps: {
        placeholder: '请选择产品内部料号',
        // api: getPartNumberApplySearch,
        // showSearch: true,
        // resultField: 'data',
        // notFoundContent: null,
        // labelField: 'insidePartNumber',
        // valueField: 'insidePartNumber',
        // immediate: true,
        // apiSearch: {
        //   show: true,
        //   searchName: 'keyword',
        // },
        // onChange: (insidePartNumber, data, record) => {
        //   console.log(insidePartNumber);
        //   const { factory, productDesc, members } = data;
        //   const { editValueRefs } = record;
        //   console.log(members);
        //   editValueRefs.factory = factory;
        //   editValueRefs.productDesc = productDesc;
        //   const PD = members.find(item => item.configType === 'PDPerson')?.memberName;
        //   editValueRefs.pd = PD || '';
        // },
      },
      width: 120,
    },
    {
      title: '已出货',
      dataIndex: 'shippedQty',
      editRow: true,
      editComponent: 'InputNumber',
      width: 120,
    },
    {
      title: '库存成品',
      dataIndex: 'finishedGoodsInventory',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '在制成品',
      dataIndex: 'wipFinishedQty',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '半成品',
      dataIndex: 'semiFinishedGoodsQty',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '库存物料(特殊、专用)',
      dataIndex: 'inventoryMaterialQty',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '未收货订单',
      dataIndex: 'unfulfilledOrders',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '申请人处理意见',
      dataIndex: 'comments',
      editComponentProps: {
        placeholder: '申请人填写',
      },
      editComponent: 'Input',
      editRow: true,
      width: 120,
    },
  ];
}

export function getSignDeptColumns(): BasicColumn[] {
  return [
    {
      title: t('dict.DepartmentColumn'),
      dataIndex: 'deptName',
      width: 120,
    },
    {
      title: t('dict.DrawingsReview.ReviewOpinion'),
      dataIndex: 'reviewComments',
    },
    {
      title: t('dict.ECNColumn.coSigner'),
      dataIndex: 'userName',
      width: 120,
    },
  ];
}

export function getReviewColumns(): BasicColumn[] {
  return [
    {
      title: '角色',
      dataIndex: 'role',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        placeholder: '请选择角色',
        api: () => {
          return baseStore.getDictionaryData('ECN.Role');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
      width: 120,
    },
    {
      title: '审批人',
      componentProps: {
        placeholder: '请选择负责人',
        allowClear: true,
        showSearch: true,
      },
      dataIndex: 'userName',
    },
    {
      title: '意见',
      editComponent: 'Input',
      dataIndex: 'reviewComments',
      width: 120,
      editRow: true,
    },
    {
      title: '审批时间',
      dataIndex: 'creatorTime',
      format: 'date|YYYY-MM-DD HH:mm:ss',
      width: 120,
    },
  ];
}

export const STATUS_OPTIONS = [
  { id: 1, fullName: '待提交', theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: '处理中', theme: 'blue', rowKey: 'statusDesc' },
  { id: 3, fullName: '结案', theme: 'green', rowKey: 'statusDesc' },
  { id: 4, fullName: '撤回', theme: 'purple', rowKey: 'statusDesc' },
  { id: 5, fullName: '驳回', theme: 'yellow', rowKey: 'statusDesc' },
  { id: 6, fullName: '终止', theme: 'red', rowKey: 'statusDesc' },
];

export const ROW_DATA = {
  insidePartNumber: '',
  productDesc: '',
  version: '',
  onEdit: true,
  editable: true,
  disabled: {
    insidePartNumber: false,
    productDesc: true,
  },
};
