import type Dayjs from 'dayjs';
import type { VxeGridPropTypes } from '/@/components/VxeTable';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useI18n } from '/@/hooks/web/useI18n';
import { transformI18nVxeTable } from '/@/utils/index';
import { statusOptions } from '/@/views/purchase/sampleDemand/config';
import { statusOptions as confirmStatusOptions } from '/@/views/engineering/sampleComfirm/config';
import { getLabelByOptions } from '/@/views/business/report/utils';
import { getFactoryList } from '/@/api/engineering/sample';

// const baseStore = useBaseStore();
const { t } = useI18n();
dayjs.extend(duration);

const isSatisfiedOption = [
  { id: 1, fullName: t('dict.OpinionEnum.2'), theme: 'green', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.OpinionEnum.3'), theme: 'yellow', rowKey: 'statusDesc' },
];

const opinionOption = [
  { id: 1, fullName: t('dict.OpinionEnum.1'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.OpinionEnum.2'), theme: 'green', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.OpinionEnum.3'), theme: 'yellow', rowKey: 'statusDesc' },
  { id: 4, fullName: t('common.stopText'), theme: 'red', rowKey: 'statusDesc' },
];

/**
 * 计算两个时间之间相差的天数、小时数、分钟数和秒数
 * @param startTime 开始时间字符串
 * @param endTime 结束时间字符串
 * @returns 格式化的字符串，例如 "1天2小时3分4秒"
 */
export function calculateTimeDifference(startTime: Dayjs.ConfigType, endTime: Dayjs.ConfigType): string {
  const start = dayjs(startTime).tz();
  const end = dayjs(endTime).tz();

  if (!startTime || !endTime || !(start.isValid() && end.isValid())) {
    return '';
  }

  const duration = dayjs.duration(end.diff(start));
  return `${Math.floor(duration.asDays())}天${duration.hours()}小时${duration.minutes()}分${duration.seconds()}秒`;
}

const _vxeTableColumns: VxeGridPropTypes.Columns = [
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
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请类型',
    field: 'applyTypeDesc',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
    formatter: ({ cellValue, row }) => {
      return getLabelByOptions(row.applyType, cellValue, [{ value: 1, label: t('dict.ApplyTypeEnum.SampleApply') }]);
    },
  },
  {
    title: '申请人姓名',
    field: 'applyUserName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请时间',
    field: 'applyDate',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'DatePicker', props: { valueFormat: 'YYYY/MM/DD HH:MM' } },
    width: 200,
    cellRender: {
      name: 'Date',
      format: 'YYYY/MM/DD HH:MM',
    },
  },
  {
    title: '申请仓位',
    field: 'applyShippingSpaceName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '材料内部料号',
    field: 'innerMaterialNumber',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '原厂商型号',
    field: 'innerExternalNumber',
    // sortable: true,
    width: 200,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
  },
  {
    title: '工厂名称',
    field: 'factoryName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '产品长度(MM)',
    field: 'productSizeLong',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '产品宽度(MM)',
    field: 'productSizeWide',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '产品面积(M2)',
    field: 'productArea',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '产品描述',
    field: 'description',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请宽度(MM)',
    field: 'applySizeWide',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请长度(M)',
    field: 'applySizeLong',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请数量',
    field: 'qty',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '数量单位',
    field: 'measurementUnit',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '申请面积(M2)',
    field: 'applyArea',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '成品打样数量(KPCS)',
    field: 'finishedProductQty',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '要求到样日期',
    field: 'requestArrivalDate',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'DatePicker', props: { valueFormat: 'YYYY-MM-DD' } },
    width: 200,
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
    width: 200,
  },
  {
    title: 'PD',
    field: 'personEngineeringName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '采购',
    field: 'purchaseUserName',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '备注',
    field: 'remark',
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: { name: 'Input' },
    width: 200,
  },
  {
    title: '采购处理状态',
    field: 'handleStatusDesc',
    width: 200,
    formatter: ({ cellValue, row }) => {
      return getLabelByOptions(row.handleStatus, cellValue, statusOptions);
    },
  },
  {
    title: '采购处理时间',
    field: 'purchaseDealTime',
    width: 200,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '采购处理时长',
    field: 'purchaseDatetimeTimeSpan',
    width: 200,
  },
  {
    title: '处理人',
    field: 'purchaseUserName',
    width: 200,
  },
  {
    title: '采购处理详情',
    field: 'id',
    i18nField: 'purchaseDetail',
    width: 200,
    slots: {
      default: 'id',
    },
  },
  {
    title: '申请人确认结果',
    field: 'confirmStatusDesc',
    width: 200,
    formatter: ({ cellValue, row }) => {
      return getLabelByOptions(row.confirmStatus, cellValue, confirmStatusOptions);
    },
  },
  {
    title: '申请人确认原因',
    field: 'reason',
    width: 200,
  },
];

export const vxeTableColumns = transformI18nVxeTable(_vxeTableColumns, 'SampleApplyColumn');

export const vxeSchema = [
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '材料内部料号',
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
    fieldName: 'handleStatus',
    label: '',
    component: 'Select',
    i18nField: 'handleStatusDesc',
    componentProps: {
      options: statusOptions,
      placeholder: '处理状态',
      allowClear: true,
    },
  },
  {
    fieldName: 'purchaseUserName',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '处理人',
      allowClear: true,
    },
  },
];

export function sampleDetailsGetSchema(hasBtnP) {
  const columns = [
    {
      label: '',
      fieldName: 'applyNumber',
      component: 'Input',
      componentProps: {
        placeholder: '单号',
        submitOnPressEnter: true,
      },
    },
    // {
    //   label: '',
    //   fieldName: 'factoryName',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '工厂',
    //     submitOnPressEnter: true,
    //   },
    // },
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
        labelField: 'Name',
        valueField: 'Code',
        immediate: false,
        filterOption: false,
        // nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        autoComplete: 'off',
        placeholder: '产品内部料号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'insideNumberOld',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'innerMaterialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '材料八码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'innerExternalNumber',
      component: 'Input',
      componentProps: {
        placeholder: '原厂商型号',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'supplierName',
      component: 'Input',
      componentProps: {
        placeholder: '供应商简称',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserName',
      component: 'Input',
      componentProps: {
        placeholder: '申请人',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'personEngineeringName',
      component: 'Input',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
      },
    },
    // {
    //   label: '',
    //   fieldName: 'purchaseUserName',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '采购',
    //     submitOnPressEnter: true,
    //   },
    // },
    {
      label: '',
      fieldName: 'purchaseUserName',
      component: 'Input',
      componentProps: {
        placeholder: '采购',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'time',
      component: 'RangePicker',
      componentProps: {
        // placeholder: '单号',
        submitOnPressEnter: true,
      },
    },
  ];
  return hasBtnP('btn_supplier') ? columns : columns.filter(item => item.fieldName !== 'supplierName');
}

const STATUS_OPTIONS = [
  { id: 0, fullName: t('dict.SMAApplyStatus.1'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: t('dict.SMAApplyStatus.1'), theme: 'gray', rowKey: 'statusDesc' },
  { id: 2, fullName: t('dict.SMAApplyStatus.2'), theme: 'blue', rowKey: 'statusDesc' },
  { id: 3, fullName: t('dict.SMAApplyStatus.3'), theme: 'red', rowKey: 'statusDesc' },
  { id: 4, fullName: t('dict.SMAApplyStatus.4'), theme: 'purple', rowKey: 'statusDesc' },
  { id: 5, fullName: t('dict.SMAApplyStatus.5'), theme: 'red', rowKey: 'statusDesc' },
  { id: 6, fullName: t('dict.SMAApplyStatus.6'), theme: 'green', rowKey: 'statusDesc' },
];

export function sampleDetailsGetColumns(hasBtnP) {
  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: '单号',
      field: 'applyNumber',
      width: 150,
    },
    {
      title: '状态',
      field: 'applyStatusEnum',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 90,
    },
    {
      title: '当前节点',
      field: 'currentNode',
      width: 120,
    },
    {
      title: '当前处理人',
      field: 'currentProcessor',
      width: 180,
    },
    {
      title: '节点详情',
      field: 'nodeDetail',
      width: 160,
      slots: {
        default: 'nodeDetail',
      },
    },
    {
      title: '终端项目代码',
      field: 'terminalProjectCode',
      width: 200,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '旧版成品编码',
      field: 'insideNumberOld',
      width: 200,
    },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      width: 200,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      width: 200,
    },
    {
      title: '材料描述',
      field: 'materialDescription',
      width: 200,
    },
    {
      title: '供应商简称',
      field: 'supplierName',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factoryName',
      width: 200,
    },
    {
      title: '申请仓位',
      field: 'applyShippingSpaceName',
      width: 200,
    },
    {
      title: '产品宽度(MM)',
      field: 'productSizeWide',
      width: 200,
    },
    {
      title: '产品长度(MM)',
      field: 'productSizeLong',
      width: 200,
    },
    {
      title: '产品面积(M2)',
      field: 'productArea',
      width: 200,
    },
    {
      title: '产品描述',
      field: 'description',
      width: 200,
    },
    {
      title: '申请宽度(MM)',
      field: 'applySizeWide',
      width: 200,
    },
    {
      title: '申请长度(M)',
      field: 'applySizeLong',
      width: 200,
    },
    {
      title: '申请数量',
      field: 'qty',
      width: 200,
    },
    {
      title: '数量单位',
      field: 'measurementUnit',
      width: 200,
    },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      width: 200,
    },
    {
      title: '成品打样数量(KPCS)',
      field: 'finishedProductQty',
      width: 200,
    },
    {
      title: '要求到样日期',
      field: 'requestArrivalDate',
      cellRender: {
        name: 'Date',
      },
      width: 150,
    },
    {
      title: '所处阶段',
      field: 'currentStageNew',
      width: 200,
    },
    {
      title: '备注(申请人)',
      field: 'remark',
      width: 200,
    },
    {
      title: 'PD',
      field: 'personEngineeringName',
      width: 200,
    },
    {
      title: '采购',
      field: 'purchaseUserName',
      width: 200,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 200,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      cellRender: {
        name: 'Date',
      },
      width: 150,
    },
    {
      title: '回复宽度(MM)',
      field: 'replySizeWide',
      width: 120,
    },
    {
      title: '回复长度(M)',
      field: 'replySizeLong',
      width: 120,
    },
    {
      title: '回复数量',
      field: 'replyQty',
      width: 120,
    },
    {
      title: '回复面积(M2)',
      field: 'replyArea',
      width: 120,
    },
    {
      title: '到料日期',
      field: 'arrivalDate',
      cellRender: {
        name: 'Date',
      },
      width: 150,
    },
    {
      title: '快递信息',
      field: 'expressInformation',
      width: 200,
    },
    {
      title: '数量是否满足',
      field: 'isQtySatisfiedEnum',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: isSatisfiedOption,
      },
    },
    {
      title: '交期是否满足',
      field: 'isArrivalDateSatisfiedEnum',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: isSatisfiedOption,
      },
    },
    {
      title: '申请人意见',
      field: 'opinionEnum',
      width: 120,
      cellRender: {
        name: 'Tag',
        options: opinionOption,
      },
    },
  ];
  return hasBtnP('btn_supplier') ? columns : columns.filter(item => item.field !== 'supplierName');
}
