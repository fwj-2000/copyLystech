import { useI18n } from '/@/hooks/web/useI18n';
import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useUserStore } from '/@/store/modules/user';
import { getFactoryList } from '/@/api/customerSerivce';

const userStore = useUserStore();

const { t } = useI18n();

export enum STATUS_ENUM {
  暂存 = 1,
  在办 = 2,
  终止 = 3,
  撤回 = 4,
  驳回 = 5,
  结案 = 6,
}

export const statusOptions = [
  {
    label: t('common.temporarySave'),
    value: STATUS_ENUM.暂存,
    fullName: t('common.temporarySave'),
    id: STATUS_ENUM.暂存,
    theme: 'gray',
    rowKey: 'handleStatus',
  },
  { label: t('common.doing'), value: STATUS_ENUM.在办, fullName: t('common.doing'), id: STATUS_ENUM.在办, theme: 'blue', rowKey: 'handleStatus' },
  { label: t('common.stopText'), value: STATUS_ENUM.终止, fullName: t('common.stopText'), id: STATUS_ENUM.终止, theme: 'red', rowKey: 'handleStatus' },
  { label: t('common.revoke'), value: STATUS_ENUM.撤回, fullName: t('common.revoke'), id: STATUS_ENUM.撤回, theme: 'purple', rowKey: 'handleStatus' },
  { label: t('common.rejectText'), value: STATUS_ENUM.驳回, fullName: t('common.rejectText'), id: STATUS_ENUM.驳回, theme: 'yellow', rowKey: 'handleStatus' },
  { label: t('common.endding'), value: STATUS_ENUM.结案, fullName: t('common.endding'), id: STATUS_ENUM.结案, theme: 'green', rowKey: 'handleStatus' },
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
      fieldName: 'applyUserId',
      label: '',
      i18nField: 'applyUserName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
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
      fieldName: 'applyStatus',
      label: '',
      component: 'Select',
      i18nField: 'CommonCol.status',
      componentProps: {
        placeholder: '状态',
        options: statusOptions,
        allowClear: true,
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
      slots: {
        default: 'applyNumber',
      },
    },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      // sortable: true,
      width: 200,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      // sortable: true,
      width: 150,
    },
    {
      title: '状态',
      field: 'applyStatus',
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
      filters: [{ data: '' }],
      filterRender: { name: 'CustomUserSelect', props: { style: 'width: 200px' } },
      width: 200,
    },
    {
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'CommonCol.currentNode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
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
      width: 220,
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
      width: 150,
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
        format: 'YYYY-MM-DD HH:mm',
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

/**
 * 导入表格展示列
 */
export const importColumn = [
  {
    title: '申请仓位',
    dataIndex: 'applyShippingSpaceName',
  },
  {
    title: '产品内部料号',
    dataIndex: 'insidePartNumber',
  },
  {
    title: '旧版成品编码',
    dataIndex: 'insideNumberOld',
  },
  {
    title: '终端项目代码',
    dataIndex: 'terminalProjectCode',
  },
  {
    title: '材料八码',
    dataIndex: 'innerMaterialNumber',
  },
  {
    title: '原厂商型号',
    dataIndex: 'innerExternalNumber',
  },
  {
    title: '工厂',
    dataIndex: 'factoryName',
  },
  {
    title: '产品宽度(MM)',
    dataIndex: 'productSizeWide',
  },
  {
    title: '产品长度(MM)',
    dataIndex: 'productSizeLong',
  },
  {
    title: '产品描述',
    dataIndex: 'description',
  },
  {
    title: '申请长度(M)',
    dataIndex: 'applySizeLong',
  },
  {
    title: '申请宽度(MM)',
    dataIndex: 'applySizeWide',
  },
  {
    title: '申请数量',
    dataIndex: 'qty',
  },
  {
    title: '数量单位',
    dataIndex: 'measurementUnit',
  },
  {
    title: '成品打样数量(KPCS)',
    dataIndex: 'finishedProductQty',
  },
  {
    title: '要求到样日期',
    dataIndex: 'requestArrivalDate',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '所处阶段',
    dataIndex: 'currentStageNew',
  },
  {
    title: 'PD',
    dataIndex: 'personEngineeringName',
  },
  {
    title: '采购',
    dataIndex: 'purchaseUserName',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];
