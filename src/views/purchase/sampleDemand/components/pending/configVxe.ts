import type { VxeGridPropTypes } from '/@/components/VxeTable';
import type { FormSchema } from '/@/components/Form/src/types/form';

import { useI18n } from '/@/hooks/web/useI18n';
import { getNumber } from '/@/views/engineering/sampleApply/components/configVxe';
import Decimal from 'decimal.js';
import { transformI18nVxeTable } from '/@/utils/index';
import { getSupplierList } from '/@/api/equipment/information';
import { useUserStore } from '/@/store/modules/user';
import { getFactoryList } from '/@/api/customerSerivce';

const { t } = useI18n();
const userStore = useUserStore();

const isSTATUS_ENUM = [
  { id: '0', fullName: t('common.no'), theme: 'gray' },
  { id: '1', fullName: t('common.yes'), theme: 'green' },
];

/**
 * 采购 - 样品需求状态选项
 */
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

/**
 * 导入表格展示列
 */
export const importColumn = [
  {
    title: '单号',
    field: 'applyNumber',
    width: 140,
  },
  {
    title: '材料八码',
    field: 'innerMaterialNumber',
    sortable: true,
    width: 150,
  },
  {
    title: '原厂商型号',
    field: 'innerExternalNumber',
    sortable: true,
    width: 210,
  },
  {
    title: '回复宽度(MM)',
    field: 'replySizeWide',
    width: 160,
  },
  {
    title: '回复长度(M)',
    field: 'replySizeLong',
    width: 160,
  },
  {
    title: '回复数量',
    field: 'replyQty',
    width: 160,
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
      format: 'YYYY-MM-DD',
    },
    width: 120,
  },
  {
    title: '快递信息',
    field: 'expressInformation',
    width: 120,
  },
  {
    title: '备注',
    field: 'remark',
    width: 130,
  },
];

/**
 * 清单页 - 搜索表单
 */
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

/**
 * 清单页 - 表格列配置
 */
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
      title: '是否导出',
      field: 'isExport',
      width: '100',
      filters: [{ data: '' }],
      filterRender: { name: 'ASelect', props: { options: isSTATUS_ENUM } },
      cellRender: {
        name: 'Tag',
        options: isSTATUS_ENUM,
      },
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
      title: '材料描述',
      field: 'materialDescription',
      width: 120,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '供应商简称',
      field: 'supplierName',
      width: 120,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
    },
    {
      title: '申请人意见',
      field: 'opinion',
      width: 120,
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
      // filterRender: { name: 'Input', props: { style: 'width: 200px' } },
      width: 180,
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
      title: '产品内部料号',
      field: 'insidePartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
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
    //   minWidth: 120,
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
      width: 130,
    },
    {
      title: '产品长度(MM)',
      field: 'productSizeLong',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '产品宽度(MM)',
      field: 'productSizeWide',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '产品面积(M2)',
      field: 'productArea',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 140,
    },
    {
      title: '产品描述',
      field: 'description',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 150,
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
      width: 130,
    },
    {
      title: '申请数量',
      field: 'qty',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 130,
    },
    {
      title: '数量单位',
      field: 'measurementUnit',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 130,
    },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 130,
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
      title: '采购',
      field: 'purchaseUserName',
      // sortable: true,
      width: 170,
    },
    {
      title: '备注',
      field: 'remark',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 120,
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
 * 邮件发送 - 表单校验规则
 */
export const schemas: Array<FormSchema> = [
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
      width: 50,
    },
    {
      title: '申请仓位',
      field: 'applyShippingSpaceName',
      width: 120,
    },
    {
      title: '申请时间',
      field: 'applyDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 180,
    },
    {
      title: '旧版成品编码',
      field: 'insideNumberOld',
      width: 150,
    },
    {
      title: '材料八码',
      field: 'innerMaterialNumber',
      width: 120,
    },
    {
      title: '原厂商型号',
      field: 'innerExternalNumber',
      width: 120,
    },
    {
      title: '供应商简称',
      field: 'supplierId',
      width: 230,
      i18nField: 'supplierName',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'supplierName',
        isDefaultLabel: true,
        props: {
          filterOption: false,
          api: getSupplierList,
          apiSearch: {
            show: true,
            searchName: 'shortName',
          },
          labelField: 'shortName',
          valueField: 'id',
          showSearch: true,
          resultField: 'data',
          nameFormat: ['shortName', ' / ', 'name'],
        },
      },
    },
    {
      title: '材料描述',
      field: 'materialDescription',
      width: 250,
    },
    {
      title: '申请宽度(MM)',
      field: 'applySizeWide',
      width: 120,
    },
    {
      title: '申请长度(M)',
      field: 'applySizeLong',
      width: 120,
    },
    {
      title: '申请面积(M2)',
      field: 'applyArea',
      width: 120,
    },
    {
      title: '终端项目代码',
      field: 'terminalProjectCode',
      width: 120,
    },
    {
      title: '产品宽度(MM)',
      field: 'productSizeWide',
      width: 120,
    },
    {
      title: '产品长度(MM)',
      field: 'productSizeLong',
      width: 120,
    },
    {
      title: '产品描述',
      field: 'description',
      width: 230,
    },
    {
      title: '要求到样日期',
      field: 'requestArrivalDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '所处阶段',
      field: 'currentStageNew',
      width: 120,
    },
    {
      title: '成品打样数量(KPCS)',
      field: 'finishedProductQty',
      width: 120,
    },
    {
      title: '采购',
      field: 'purchaseUserName',
      width: 120,
    },
    {
      title: '申请人',
      field: 'applyUserName',
      width: 180,
    },
    {
      title: '厂商提供数量',
      field: 'supplierQty',
      width: 120,
      slots: {
        default: () => t('dict.SampleApply.SupplierFill'),
      },
    },
    {
      title: '寄样时间/单号',
      field: 'supplierTrackingNumber',
      width: 120,
      slots: {
        default: () => t('dict.SampleApply.SupplierFill'),
      },
    },
    {
      title: '预计到料时间',
      field: 'expectedDeliveryTime',
      width: 120,
      slots: {
        default: () => t('dict.SampleApply.SupplierFill'),
      },
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
    {
      title: t('common.applyInfo'),
      align: 'center',
      headerClassName: 'border-right',
      children: transformI18nVxeTable(
        [
          {
            title: '材料八码',
            field: 'innerMaterialNumber',
            width: 120,
          },
          {
            title: '原厂商型号',
            field: 'innerExternalNumber',
            width: 150,
          },
          {
            title: '供应商简称',
            field: 'supplierName',
            width: 120,
          },
          {
            title: '材料描述',
            field: 'materialDescription',
            width: 180,
          },
          {
            title: '申请宽度(MM)',
            field: 'applySizeWide',
            width: 120,
          },
          {
            title: '申请长度(M)',
            field: 'applySizeLong',
            width: 120,
          },
          {
            title: '申请数量',
            field: 'qty',
            width: 120,
          },
          {
            title: '数量单位',
            field: 'measurementUnit',
            width: 120,
          },
          {
            title: '申请面积(M2)',
            field: 'applyArea',
            width: 120,
          },
          {
            title: '要求到样日期',
            field: 'requestArrivalDate',
            width: 170,
            className: 'border-right',
            headerClassName: 'border-right',
            cellRender: {
              name: 'Date',
              format: 'YYYY-MM-DD',
            },
          },
        ],
        'SampleApplyColumn',
      ),
    },
    {
      title: t('common.replyInfo'),
      align: 'center',
      children: transformI18nVxeTable(
        [
          {
            title: '回复宽度(MM)',
            field: 'replySizeWide',
            width: 160,
            editRender: {
              name: 'InputNumber',
              props: {
                onChange: (_: number, { row }) => {
                  row.replyArea = computeReplyArea(row);
                },
              },
            },
          },
          {
            title: '回复长度(M)',
            field: 'replySizeLong',
            width: 160,
            editRender: {
              name: 'InputNumber',
              props: {
                onChange: (_: number, { row }) => {
                  row.replyArea = computeReplyArea(row);
                },
              },
            },
          },
          {
            title: '回复数量',
            field: 'replyQty',
            width: 160,
            editRender: {
              name: 'InputNumber',
              props: {
                onChange: (_: number, { row }) => {
                  row.replyArea = computeReplyArea(row);
                },
              },
            },
          },
          {
            title: '回复面积(M2)',
            field: 'replyArea',
            helpMessage: '【回复宽度*回复长度*回复数量】/1000',
            width: 120,
          },
          {
            title: '到料日期',
            field: 'arrivalDate',
            width: 150,
            require: true,
            editRender: {
              name: 'DatePicker',
              props: {
                valueFormat: 'YYYY-MM-DD',
                showTime: false,
              },
            },
          },
          {
            title: '快递信息',
            field: 'expressInformation',
            width: 120,
            editRender: {
              name: 'Input',
            },
          },
          {
            title: '备注',
            field: 'replyRemark',
            width: 120,
            editRender: {
              name: 'Input',
            },
          },
        ],
        'SampleApplyColumn',
      ),
    },
  ];
}

/**
 * 回复 - 表格校验规则
 */
export const replyEditRules: any = {
  arrivalDate: [{ required: true, message: t('common.required') }],
};

/**
 * 根据数据中的`回复宽度(MM)`、`回复长度(M)`和`回复数量`，计算相应的`产品面积(M2)`
 * @param row 行数据
 * @returns 回复面积
 */
export function computeReplyArea(row: { replySizeWide: number; replySizeLong: number; replyQty: number }) {
  // 回复面积：【回复宽度*回复长度*回复数量】/1000
  return Decimal.mul(getNumber(row.replySizeWide), getNumber(row.replySizeLong)).mul(getNumber(row.replyQty)).div(1000).toNumber();
}
