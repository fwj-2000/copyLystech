import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
// import { getSupplierList } from '/@/api/equipment/information';
// import { getNumber } from '/@/views/engineering/sampleApply/components/configVxe';
// import Decimal from 'decimal.js';
import { getFactoryList } from '/@/api/customerSerivce';

const { t } = useI18n();

export const statusOptions = [
  { id: 1, fullName: t('common.todoText'), theme: 'gray' }, //待处理
  { id: 2, fullName: t('common.doneText'), theme: 'green' }, //已处理
  { id: 3, fullName: t('common.stopText'), theme: 'red' }, //终止
  { id: 4, fullName: t('common.revoke'), theme: 'purple' }, //撤回
  { id: 5, fullName: t('common.rejectText'), theme: 'yellow' }, //驳回
];

export const confirmStatusOptions = [
  { id: 1, fullName: t('common.toConfirm'), theme: 'gray' }, //待确认
  { id: 2, fullName: t('dict.OpinionEnum.2'), theme: 'green' }, //满足
  { id: 3, fullName: t('dict.OpinionEnum.3'), theme: 'yellow' }, //不满足
  { id: 4, fullName: t('common.stopText'), theme: 'red' }, //终止
];

export function getFormConfig() {
  return [
    {
      fieldName: 'applyNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '申请单号',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'innerMaterialNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '材料八码',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'innerExternalNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '原厂商型号',
        allowClear: true,
      },
    },
    {
      fieldName: 'supplierName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '供应商简称',
        allowClear: true,
      },
    },
    {
      fieldName: 'factoryName',
      i18nField: 'CommonCol.factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        api: getFactoryList,
        resultField: 'data',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        valueField: 'Code',
        immediate: false,
        filterOption: false,
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'terminalProjectCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '终端项目代码',
        allowClear: true,
      },
    },
    {
      fieldName: 'handleStatus',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'purchaseUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '采购',
        allowClear: true,
      },
    },
    {
      fieldName: 'applyUserName',
      label: '',
      i18nField: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
        allowClear: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: '50',
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
      field: 'applyNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '申请仓位',
      field: 'applyShippingSpaceName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      formatter({ row }) {
        const code = row.applyShippingSpaceCode || '';
        const name = row.applyShippingSpaceName || '';
        if (code && name) return `${code}/${name}`;
        return code || name || '';
      },
      width: 220,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
        props: {
          searchField: ['applyDateStart', 'applyDateEnd'],
        },
      },
      width: 170,
      cellRender: {
        name: 'Date',
        format: 'YYYY/MM/DD HH:MM',
      },
    },
    {
      title: '申请人',
      field: 'applyUserId',
      i18nField: 'applyUserName',
      formatter: ({ cellValue, row }) => row.applyUserName || cellValue || '',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 170,
    },
    {
      title: '供应商简称',
      field: 'supplierName',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      // sortable: true,
      width: 210,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '申请宽度(MM)',
      field: 'applySizeWide',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '申请长度(M)',
      field: 'applySizeLong',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    // {
    //   title: '申请数量',
    //   field: 'qty',
    //   sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'Input' },
    //   width: 200,
    // },
    // {
    //   title: '数量单位',
    //   field: 'measurementUnit',
    //   // sortable: true,
    //   // filters: [{ data: '' }],
    //   // filterRender: { name: 'Input' },
    //   width: 200,
    // },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '要求到样日期',
      field: 'requestArrivalDate',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
        props: {
          searchField: ['requestArrivalDateStart', 'requestArrivalDateEnd'],
        },
      },
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '所处阶段',
      field: 'currentStageNew',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
    },
    {
      title: '成品打样数量(KPCS)',
      field: 'finishedProductQty',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '采购',
      field: 'purchaseUserName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 170,
    },
    {
      title: '回复宽度(MM)',
      field: 'replySizeWide',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '回复长度(M)',
      field: 'replySizeLong',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '回复数量',
      field: 'replyQty',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '回复面积(M2)',
      field: 'replyArea',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '到料日期',
      field: 'arrivalDate',
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
        props: {
          searchField: ['arrivalDateStart', 'arrivalDateEnd'],
        },
      },
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '快递信息',
      field: 'expressInformation',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 170,
    },
    {
      title: '备注',
      field: 'replyRemark',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 170,
    },
    {
      title: 'PD',
      field: 'personEngineeringName',
      i18nField: 'personEngineeringName',
      formatter: ({ cellValue, row }) => row.personEngineeringName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input', props: { style: 'width: 200px' } },
      width: 170,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
    { title: '终端项目代码', field: 'terminalProjectCode', width: 150 },
    {
      title: '材料描述',
      field: 'materialDescription',
      width: 200,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '产品宽度(MM)',
      field: 'productSizeWide',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    {
      title: '产品长度(MM)',
      field: 'productSizeLong',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
    },
    // {
    //   title: '产品面积(M2)',
    //   field: 'productArea',
    //   sortable: true,
    //   filters: [{ data: '' }],
    //   filterRender: { name: 'Input' },
    //   width: 200,
    // },
    // {
    //   title: '申请类型',
    //   field: 'applyTypeDesc',
    //   sortable: true,
    //   filters: [{ data: '' }],
    //   filterRender: { name: 'Input' },
    //   formatter: ({ cellValue }) => (cellValue === '样品申请' ? t('dict.ApplyTypeEnum.SampleApply') : cellValue),
    //   width: 200,
    // },
    {
      title: '工厂',
      field: 'factoryName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      formatter({ row }) {
        const code = row.factoryCode || '';
        const name = row.factoryName || '';
        if (code && name) return `${code}/${name}`;
        return code || name || '';
      },
      width: 150,
    },
    {
      title: '申请人意见',
      field: 'opinion',
      width: 150,
      // sortable: true,
      i18nField: 'opinion',
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: confirmStatusOptions } },
      cellRender: {
        name: 'Tag',
        options: confirmStatusOptions,
      },
    },
    {
      title: '状态',
      field: 'handleStatus',
      // sortable: true,
      i18nField: 'CommonCol.status',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '当前处理人',
      field: 'currentProcessorId',
      i18nField: 'CommonCol.currentNodeUser',
      formatter: ({ cellValue, row }) => row.currentProcessor || cellValue || '',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 170,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
    },
    {
      title: '节点记录',
      field: 'nodeDetail',
      i18nField: 'CommonCol.nodeDetail',
      width: 120,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '产品描述',
      field: 'description',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    // 操作行
    {
      title: t('common.action'),
      width: '60',
      field: 'action',
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
}
