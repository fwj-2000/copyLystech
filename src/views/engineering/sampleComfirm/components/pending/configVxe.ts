import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { STATUS_ENUM, renderSatisfiedStatus, statusEnumDict } from '../../config';
import { useUserStore } from '/@/store/modules/user';
import { getFactoryList } from '/@/api/customerSerivce';

const { t } = useI18n();
const userStore = useUserStore();

/**
 * 状态选项
 */

export const statusOptions = [
  { id: 1, fullName: t('common.toConfirm'), theme: 'gray' }, // 待确认.
  // { id: 2, fullName: t('dict.OpinionEnum.2'), theme: 'green' }, // 满足.
  // { id: 3, fullName: t('dict.OpinionEnum.3'), theme: 'yellow' }, // 不满足.
  { id: 4, fullName: t('common.revoke'), value: 4, label: t('common.revoke'), theme: 'purple' }, // 撤回.
  // { id: 5, fullName: t('common.stopText'), value: 2, label: t('common.stopText'), theme: 'red' }, // 终止.
];

/**
 * 意见选项
 */

export const opinionOptions = [
  { id: 1, fullName: t('common.toConfirm'), value: 1, label: t('common.toConfirm'), theme: 'gray' }, //待确认
  { id: 2, fullName: t('dict.OpinionEnum.2'), value: 2, label: t('dict.OpinionEnum.2'), theme: 'green' }, //满足
  { id: 3, fullName: t('dict.OpinionEnum.3'), value: 3, label: t('dict.OpinionEnum.3'), theme: 'yellow' }, //不满足
  { id: 4, fullName: t('common.stopText'), value: 4, label: t('common.stopText'), theme: 'red' }, //终止
];

export const satisfyOptions = [
  { fullName: t('dict.OpinionTypeEnum.Satisfy'), id: 'true', label: t('dict.OpinionTypeEnum.Satisfy'), value: true },
  { fullName: t('dict.OpinionTypeEnum.Discontent'), id: 'false', label: t('dict.OpinionTypeEnum.Discontent'), value: false },
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
      fieldName: 'currentProcessorId',
      label: '',
      i18nField: 'CommonCol.currentNodeUser',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
        defaultValue: userStore.getUserInfo?.userId,
      },
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
      fieldName: 'confirmStatus',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
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
      width: 200,
    },
    {
      title: '材料八码',
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
      title: '数量是否满足',
      field: 'isQtySatisfiedEnum',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
          options: renderSatisfiedStatus,
        },
      },
      cellRender: {
        name: 'Tag',
        options: renderSatisfiedStatus,
      },
    },
    {
      title: '交期是否满足',
      field: 'isArrivalDateSatisfiedEnum',
      width: 200,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
          options: renderSatisfiedStatus,
        },
      },
      cellRender: {
        name: 'Tag',
        options: renderSatisfiedStatus,
      },
    },
    {
      title: '状态',
      field: 'confirmStatus',
      // sortable: true,
      i18nField: 'CommonCol.status',
      width: 160,
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
      // filterRender: { name: 'Input', props: { style: 'width: 200px' } },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      width: 200,
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
      title: '申请仓位',
      field: 'applyShippingSpaceName',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      formatter({ row }) {
        const code = row.applyShippingSpaceCode || '';
        const name = row.applyShippingSpaceName || '';
        if (code && name) return `${code}/${name}`;
        return code || name || '';
      },
      width: 200,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
    { title: '终端项目代码', field: 'terminalProjectCode', width: 150 },
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
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
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
      filterRender: {
        name: 'DateRange',
        props: {
          searchField: ['requestArrivalDateStart', 'requestArrivalDateEnd'],
        },
      },
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '到料日期',
      field: 'arrivalDate',
      i18nField: 'arrivalDate',
      filters: [{ data: '' }],
      filterRender: {
        name: 'DateRange',
        props: {
          searchField: ['arrivalDateStart', 'arrivalDateEnd'],
        },
      },
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
      i18nField: 'personEngineeringName',
      formatter: ({ cellValue, row }) => row.personEngineeringName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input', props: { style: 'width: 200px' } },
      width: 200,
    },
    {
      title: '采购',
      field: 'purchaseUserName',
      // sortable: true,
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
      title: '申请人',
      field: 'applyUserId',
      i18nField: 'applyUserName',
      formatter: ({ cellValue, row }) => row.applyUserName || cellValue || '',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 200,
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
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY/MM/DD HH:MM',
      },
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

export function getConfirmTableColumn() {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      title: t('component.table.index'),
      type: 'seq',
      field: 'seq',
      minWidth: 50,
    },
    {
      title: '意见',
      field: 'opinion',
      minWidth: 120,
      editRender: {
        name: 'ASelect',
        cacheField: 'opinionName',
        props: {
          options: opinionOptions,
        },
      },
    },
    {
      title: '原因',
      field: 'reason',
      width: 120,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.SampleMaterialApply.confirmTip'),
        },
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      minWidth: 180,
    },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      minWidth: 150,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      minWidth: 150,
    },
    {
      title: '回复宽度(MM)',
      field: 'replySizeWide',
      minWidth: 110,
    },
    {
      title: '回复长度(M)',
      field: 'replySizeLong',
      minWidth: 100,
    },
    {
      title: '回复数量',
      field: 'replyQty',
      minWidth: 80,
    },
    {
      title: '回复面积(M2)',
      field: 'replyArea',
      minWidth: 105,
    },
    {
      title: '到料日期',
      field: 'arrivalDate',
      i18nField: 'arrivalDate',
      minWidth: 90,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '快递信息',
      field: 'expressInformation',
      minWidth: 180,
    },
    {
      title: '申请宽度(MM)',
      field: 'applySizeWide',
      minWidth: 110,
    },
    {
      title: '申请长度(M)',
      field: 'applySizeLong',
      minWidth: 100,
    },
    {
      title: '申请数量',
      field: 'qty',
      minWidth: 80,
    },
    {
      title: '数量单位',
      field: 'measurementUnit',
      minWidth: 80,
    },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      minWidth: 105,
    },
    {
      title: '成品打样数量(KPCS)',
      field: 'finishedProductQty',
      minWidth: 144,
    },
    {
      title: '要求到样日期',
      field: 'requestArrivalDate',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '申请时间',
      field: 'applyDate',
      minWidth: 144,
      cellRender: {
        name: 'Date',
        format: 'YYYY/MM/DD HH:mm',
      },
    },
    {
      title: '数量是否满足',
      field: 'isQtySatisfiedEnum',
      minWidth: 100,
      cellRender: {
        name: 'Tag',
        options: renderSatisfiedStatus,
      },
      // slots: {
      //   default: ({ row }) => renderSatisfiedStatus(row.isQtySatisfied),
      // },
    },
    {
      title: '交期是否满足',
      field: 'isArrivalDateSatisfiedEnum',
      minWidth: 100,
      cellRender: {
        name: 'Tag',
        options: renderSatisfiedStatus,
      },
    },
    {
      title: '供应商简称',
      field: 'supplierName',
      minWidth: 180,
    },
    {
      title: '备注',
      field: 'replyRemark',
      minWidth: 180,
    },
  ];
}

export const editRules = {
  opinion: [
    {
      validator: ({ cellValue }) => {
        if (cellValue === STATUS_ENUM.待确认) {
          return Promise.reject(new Error(t('common.selectPlaceholder')));
        }
        return Promise.resolve();
      },
    },
  ],
  reason: [
    {
      validator: ({ cellValue, row }) => {
        if (!cellValue && (row.opinion === STATUS_ENUM.不满足 || row.opinion === STATUS_ENUM.终止)) {
          return Promise.reject(new Error(t('dict.SampleMaterialApply.confirmTip')));
        }
        return Promise.resolve();
      },
    },
  ],
};
