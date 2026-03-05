import { useI18n } from '/@/hooks/web/useI18n';
import {
  moldStatusOptions,
  // reasonOptions,
  repairOptions,
  moldTypeOptions,
  costAttributionOptions,
} from '../config';
import { pick } from 'lodash-es';
import { getMoldNoList } from '/@/api/productionDeal/mouldBusinessMaintenance';
import { getSupplierlist } from '/@/api/engineering/mould';

const { t } = useI18n();

export enum TYPE_ENUM {
  新增 = 'add',
  编辑 = 'edit',
  详情 = 'view',
}

export const schemas = [
  {
    field: 'moldRepairApplyNo',
    label: t('dict.CommonCol.applyCode'),
    component: 'Input',
    componentProps: { placeholder: t('common.fromSys'), maxlength: 50, disabled: true },
  },
  {
    field: 'documentPreparer',
    label: t('dict.MoldRepairApplyColumn.documentPreparer'),
    component: 'Input',
    componentProps: { placeholder: t('dict.MoldRepairApplyColumn.documentPreparer'), maxlength: 50, disabled: true },
  },
  {
    field: 'requestingDepartment',
    label: t('component.batchImport.department'),
    component: 'Input',
    componentProps: { placeholder: t('component.batchImport.department'), maxlength: 50, disabled: true },
  },
  {
    field: 'creatorDateTime',
    label: t('common.createTime'),
    component: 'Input',
    componentProps: { placeholder: t('common.fromSys'), maxlength: 50, disabled: true },
  },
];

/**
 * 编辑页面 - 获取表格列配置
 * @returns
 */
export function getEditTableColumn() {
  return [
    {
      title: '模具料号',
      field: 'moldNo',
      width: 200,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: param => getMoldNoList(param), //Promise.resolve({ data: ['CF-JFDA114A-AD002', 'CF-JFDA114A-AD003', 'CF-JFDA114A-AD004', , 'CF-JFDA114B-AD001', 'CF-JFDA114B-AD002'] }),
          // 传 "5,9" 表示在库和已领用，传的值与字典MoldLedgerStatusEnum保持一致
          params: { statusTag: '5,9' },
          resultField: 'data',
          labelField: 'moldNo',
          valueField: 'moldNo',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'moldPartNumber',
          },
          filterOption: false,
          notFoundContent: null,
          onChange: (_value: string, option: any, { row, $grid }) => {
            handleMoldNoChange(option, { row, $grid });
          },
        },
      },
    },
    {
      title: '模具状态',
      field: 'moldStatus',
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        enabled: false,
        props: {
          options: moldStatusOptions,
        },
      },
    },
    {
      title: '需求返厂日期',
      field: 'demandReturnDate',
      width: 200,
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD',
        },
      },
    },
    {
      title: '费用归属',
      field: 'costAttribution',
      editRender: {
        name: 'ASelect',
        props: {
          options: costAttributionOptions,
        },
      },
    },
    {
      title: '原因分析',
      field: 'causeAnalysis',
      width: 200,
      editRender: {
        enabled: true,
      },
      slots: {
        default: 'causeAnalysis',
        edit: 'dynamicSelect',
      },
    },
    {
      title: '维修内容(改善对策)',
      field: 'repairContent',
      width: 200,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '维修类型',
      field: 'repairType',
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          options: repairOptions,
        },
      },
    },
    {
      title: '模具采购员',
      field: 'moldPurchaser',
      width: 200,
      editRender: {
        cacheField: 'moldPurchaserName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '代维修供应商',
      field: 'repairSupplier',
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getSupplierlist,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          filterOption: false,
        },
      },
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
      title: '模具类型',
      field: 'moldType',
      formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
      width: 200,
    },
    {
      title: '供应商',
      field: 'supplier',
      formatter: ({ cellValue, row }) => row.supplierName || cellValue || '',
      width: 200,
    },
    {
      title: '入库日期',
      field: 'inboundDate',
      width: 200,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
    },
    {
      title: '维修次数',
      field: 'repairCount',
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    // {
    //   title: '审核人',
    //   field: 'reviewUserName',
    //   width: 200,
    // },
    {
      title: '预估寿命(KPCS)',
      field: 'estimateLifespan',
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: '已使用寿命(KPCS)',
      field: 'usedLifespan',
      width: 200,
      aqpFilter: { cSharpType: 'int' },
    },
    {
      title: t('common.action'),
      width: 120,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules = {
  moldNo: [{ required: true, message: t('common.required') }],
  demandReturnDate: [{ required: true, message: t('common.required') }],
  costAttribution: [{ required: true, message: t('common.required') }],
  causeAnalysis: [{ required: true, message: t('common.required') }],
  repairContent: [{ required: true, message: t('common.required') }],
  repairType: [{ required: true, message: t('common.required') }],
  moldPurchaser: [{ required: true, message: t('common.required') }],
};

/**
 * 模具料号发生改变
 */
export function handleMoldNoChange(option: any, { row, $grid }) {
  const relatedKeys = [
    'moldStatus',
    'moldType',
    'supplier',
    'inboundDate',
    'repairCount',
    'estimateLifespan',
    'usedLifespan',
    'moldPurchaser',
    'moldPurchaserName',
  ];
  if (option) {
    const moldStatusOption = moldStatusOptions.find(item => +item.value === +option.moldStatus);
    const moldTypeOption = moldTypeOptions.find(item => item.value === option.moldType);
    $grid.setRow(row, { ...pick(option, relatedKeys), moldStatusName: moldStatusOption?.fullName || '', moldTypeName: moldTypeOption?.fullName || '' });
  } else {
    $grid.setRow(
      row,
      relatedKeys.reduce(
        (obj, key) => {
          return { ...obj, [key]: '' };
        },
        { moldStatusName: '', moldTypeName: '' },
      ),
    );
  }
}
