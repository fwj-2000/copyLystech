import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Form';
import { getInnermaterialnumberlist } from '/@/api/engineering/mould';
import { classesOptions, iQCAuditResultOptions, iQCTestProgressOptions, mrbReviewResultOptions } from '../iqcInputReview/config';

const { t } = useI18n();
export const STATUS_OPTIONS = [
  { id: 'OK', fullName: 'OK', theme: 'green' }, // ok
  { id: 'NG', fullName: 'NG', theme: 'red' }, // ng
];

export const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('common.disableText'), theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.PartNumberApplyStatus.3'), theme: 'gray', rowKey: 'statusDesc' },
];

// IQCTestProgress
export const columns = [
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
  // {
  //   title: '材料类别',
  //   field: 'typeName',
  //   minWidth: 160,
  //   sortable: true,
  //   filterMultiple: true,
  //   filters: [{ data: '' }],
  //   filterRender: { name: 'Input' },
  // },
  {
    title: 'IQC单号',
    field: 'testNo',
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '状态',
    field: 'testProgress',
    i18nField: 'testProgressName',
    cellRender: {
      name: 'Tag',
      options: iQCTestProgressOptions,
    },
    width: 120,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: iQCTestProgressOptions,
      },
    },
  },
  {
    title: '厂区',
    field: 'factoryAreaName',
    minWidth: 120,
    sortable: true,
  },
  {
    title: 'MRB单号',
    field: 'mrbNo',
    minWidth: 150,
    sortable: true,
  },
  {
    title: 'MRB执行结果',
    field: 'mrbReviewResult',
    i18nField: 'mrbReviewResultDes',
    cellRender: {
      name: 'Tag',
      options: mrbReviewResultOptions,
    },
    width: 130,
    sortable: true,
  },
  {
    title: '内部物料编码',
    field: 'innerMaterialCode',
    minWidth: 180,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '检验员',
    field: 'testUserName',
    minWidth: 200,
    sortable: true,
  },
  {
    title: '检验结果',
    field: 'testResult',
    minWidth: 120,
    sortable: true,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: 'Lot No.',
    field: 'lotNo',
    minWidth: 160,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    sortable: true,
  },
  {
    title: '班次',
    field: 'classesName',
    minWidth: 100,
    sortable: true,
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    minWidth: 200,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '开始时间',
    field: 'testStartTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minWidth: 160,
    sortable: true,
    filterMultiple: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
  },
  {
    title: '结束时间',
    field: 'testCompletedTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minWidth: 160,
  },
  {
    title: '提交审核时间',
    field: 'auditSubmitTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minWidth: 160,
  },

  {
    title: '审核人',
    field: 'auditUserName',
    minWidth: 180,
  },
  {
    title: '审核结果',
    field: 'auditResult',
    minWidth: 140,
    filterMultiple: true,
    cellRender: {
      name: 'Tag',
      options: iQCAuditResultOptions,
    },
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      props: {
        options: iQCAuditResultOptions,
      },
    },
  },
  {
    title: '审核时间',
    field: 'auditTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    minWidth: 160,
  },
  {
    title: '审核说明',
    field: 'auditDescription',
    minWidth: 220,
  },
  {
    title: '材料归属',
    field: 'materialTypeBigName',
    minWidth: 140,
  },
  {
    title: '材料类型',
    field: 'materialTypeName',
    minWidth: 140,
  },
  {
    title: '产品料号来源',
    field: 'materialCodeSource',
    minWidth: 140,
  },
  // {
  //   title: '料号厂区',
  //   field: 'materialCodeFacatoryArea',
  //   minWidth: 220,
  // },
  {
    title: '采购单号',
    field: 'purchaseNo',
    minWidth: 140,
  },
  {
    title: '供应商编号',
    field: 'supplierNo',
    minWidth: 140,
  },
  {
    title: '供应商名称',
    field: 'supplierName',
    minWidth: 220,
  },
  // {
  //   title: '集采工厂',
  //   field: 'gatherFactory',
  //   minWidth: 220,
  // },
  {
    title: '内部物料描述',
    field: 'innerMaterialDescription',
    minWidth: 220,
  },
  {
    title: '来料日期',
    field: 'materialInDate',
    minWidth: 160,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    title: '来料总数',
    field: 'materialInCount',
    minWidth: 120,
  },
  {
    title: '来料单位',
    field: 'materialInUnit',
    minWidth: 120,
  },
  // {
  //   title: '来料仓库',
  //   field: 'materialInWarehouse',
  //   minWidth: 220,
  // },
  // {
  //   title: '最终计量数量',
  //   field: 'totalCount',
  //   minWidth: 220,
  // },
  // {
  //   title: '计量单位',
  //   field: 'meteringUnit',
  //   minWidth: 220,
  // },
  {
    title: '检验数量',
    field: 'testCount',
    minWidth: 100,
  },
  // {
  //   title: '客户名称',
  //   field: 'customerName',
  //   minWidth: 220,
  // },
  // {
  //   title: '客户代码',
  //   field: 'customerCode',
  //   minWidth: 220,
  // },
  // {
  //   title: '供应商来料批次号',
  //   field: 'supplierInMaterialLotNo',
  //   minWidth: 220,
  // },
  // {
  //   title: '外部料号',
  //   field: 'outsideMaterialCode',
  //   minWidth: 220,
  // },
  // {
  //   title: '外部料号描述',
  //   field: 'outsideMaterialDescription',
  //   minWidth: 220,
  // },
  {
    title: '知会人',
    field: 'notifyPeopleName',
    minWidth: 220,
  },
  {
    title: '外观不良',
    field: 'badAppearances',
    minWidth: 220,
    children: [
      {
        title: t('dict.IQCApplyColumn.badSize'), //不良占比(%)
        field: 'appBadRate',
        minWidth: 100,
      },
      {
        title: t('dict.IQCApplyColumn.appBadDescription'), //不良描述
        field: 'appBadDescription',
        minWidth: 220,
      },
    ],
  },
  // 尺寸不良
  {
    title: '尺寸不良',
    field: 'badSize',
    // i18nField: 'badType.3',
    minWidth: 220,
    children: [
      {
        title: t('dict.IQCApplyColumn.sizeBadRate'), //不良占比(%)
        field: 'sizeBadRate',
        minWidth: 100,
      },
      {
        title: t('dict.IQCApplyColumn.sizeBadDescription'), //不良描述
        field: 'sizeBadDescription',
        minWidth: 220,
      },
    ],
  },
  {
    title: '备注',
    field: 'remark',
    minWidth: 220,
  },
  {
    title: t('common.action'),
    field: 'action',
    width: 140,
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'testNo',
    label: '',
    // label: 'IQC单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入IQC单号',
      allowClear: true,
    },
  },
  {
    field: 'creatorUserName',
    label: '',
    // label: 'Lot No.',
    component: 'Input',
    componentProps: {
      placeholder: '请输入创建人.',
      allowClear: true,
    },
  },
  {
    field: 'lotNo',
    label: '',
    // label: 'Lot No.',
    component: 'Input',
    componentProps: {
      placeholder: '请输入Lot No.',
      allowClear: true,
    },
  },
  {
    field: 'innerMaterialCode',
    label: '',
    component: 'ApiSelect',
    componentProps: {
      api: getInnermaterialnumberlist,
      placeholder: '请选择产品料号',
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'InnerMaterialNumber',
      },
      resultField: 'data',
      valueField: 'insidePartNumber',
      labelField: 'insidePartNumber',
    },
  },
  // {
  //   field: 'supplierInMaterialLotNo',
  //   label: '',
  //   // label: '供应商来料批次号',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入供应商来料批次号',
  //     allowClear: true,
  //   },
  // },
  // {
  //   field: 'outsideMaterialCode',
  //   label: '',
  //   // label: '外部料号',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: '请输入外部料号',
  //     allowClear: true,
  //   },
  // },
  {
    field: 'testProgress',
    label: '',
    // label: '申请进度',
    i18nField: 'testProgressName',
    component: 'Select',
    componentProps: {
      placeholder: '请选择申请状态',
      allowClear: true,
      options: iQCTestProgressOptions,
      // options: statusOptions.map(item => {
      //   return {
      //     ...item,
      //     value: item.id,
      //   };
      // }),
    },
  },
  {
    field: 'startTime',
    i18nField: 'CommonCol.startTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    label: '',
    // label: '开始时间',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择开始时间',
      allowClear: true,
    },
  },
  {
    field: 'endTime',
    i18nField: 'CommonCol.endTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    label: '',
    // label: '结束时间',
    component: 'DatePicker',
    componentProps: {
      placeholder: '请选择结束时间',
      allowClear: true,
    },
  },
];
