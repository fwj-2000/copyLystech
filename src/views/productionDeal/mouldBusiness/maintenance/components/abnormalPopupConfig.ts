import { getMoldNoList } from '/@/api/productionDeal/mouldBusinessMaintenance';
import { useI18n } from '/@/hooks/web/useI18n';
import { moldTypeOptions, moldStatusOptions, formatPercentage } from '../config';
import { pick } from 'lodash-es';
import { getSupplierlist } from '/@/api/engineering/mould';
import { getShipList } from '/@/api/common/basedata';

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
        // cacheField: 'repairMoldNo',
        props: {
          api: param => getMoldNoList(param),
          // 传 "9" 表示已领用, 传的值与字典MoldLedgerStatusEnum保持一致
          params: { statusTag: '9' },
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
      title: 'SAP工单号',
      field: 'sapWorkOrderNo',
      width: 200,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '异常类别',
      field: 'exceptionCategory',
      width: 200,
      editRender: {
        enabled: true,
      },
      slots: {
        default: 'exceptionCategory',
        edit: 'dynamicSelect',
      },
    },
    {
      title: '问题描述',
      field: 'issueDescription',
      width: 600,
      editRender: {
        name: 'Input',
        props: {
          maxlength: 300,
        },
      },
    },
    {
      title: '发生时间',
      field: 'occurrenceTime',
      width: 200,
      editRender: {
        name: 'DatePicker',
        props: {
          valueFormat: 'YYYY-MM-DD HH:mm',
          format: 'YYYY-MM-DD HH:mm',
          showTime: { format: 'HH:mm' },
        },
      },
    },
    {
      title: '本次使用寿命(KPCS)',
      field: 'currentUsedLife',
      width: 200,
      formatter: ({ cellValue }) => {
        return cellValue ? cellValue.toFixed(2) : '';
      },
      editRender: {
        name: 'InputNumber',
        props: {
          precision: 2,
        },
      },
    },
    {
      title: '不良数(KPCS)',
      field: 'defectiveCountKpcs',
      width: 200,
      editRender: {
        name: 'InputNumber',
      },
    },
    {
      title: '不良率',
      field: 'defectRate',
      width: 200,
      formatter: ({ cellValue }) => formatPercentage(cellValue),
      editRender: {
        name: 'InputNumber',
        props: {
          formatter: (value: string | number) => `${value || 0}%`,
          parser: (value: string) => value.replace('%', ''),
          precision: 2,
        },
      },
    },
    {
      title: '调入仓库',
      field: 'inShippingSpaceCode',
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'inShippingSpaceName',
        props: {
          api: getShipList,
          resultField: 'data',
          rowParams: {
            factoryCode: 'factory',
          },
          nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          filterOption: false,
        },
      },
    },
    {
      title: '调出仓库',
      field: 'outShippingSpaceCode',
      width: 200,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'outShippingSpaceName',
        props: {
          api: getShipList,
          resultField: 'data',
          labelField: 'shippingSpaceName',
          valueField: 'shippingSpaceCode',
          rowParams: {
            factoryCode: 'factory',
          },
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shippingSpace',
          },
          nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
          filterOption: false,
        },
      },
    },
    {
      title: '生产人员',
      field: 'productionStaff',
      width: 200,
      editRender: {
        cacheField: 'productionStaffName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '组长',
      field: 'teamLeader',
      width: 200,
      editRender: {
        cacheField: 'teamLeaderName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '主管',
      field: 'supervisor',
      width: 200,
      editRender: {
        cacheField: 'supervisorName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '工程/生技',
      field: 'engineeringTechnician',
      width: 200,
      editRender: {
        cacheField: 'engineeringTechnicianName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: '退料人',
      field: 'materialReturner',
      width: 200,
      editRender: {
        cacheField: 'materialReturnerName',
        name: 'CustomUserSelect',
        props: {
          multiple: true,
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
      title: '检验文件',
      field: 'inspectionDocument',
      width: 200,
      editRender: {
        name: 'Input',
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
      title: '模具类型',
      field: 'moldType',
      formatter: ({ cellValue, row }) => row.moldTypeName || cellValue || '',
      width: 200,
    },
    {
      title: '模具状态',
      field: 'moldStatus',
      formatter: ({ cellValue, row }) => row.moldStatusName || cellValue || '',
      width: 200,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 200,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 200,
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
  sapWorkOrderNo: [
    { required: true, message: t('common.required') },
    { pattern: /^.{12}$/, message: t('component.form.equalTip', [12]) },
  ],
  exceptionCategory: [{ required: true, message: t('common.required') }],
  issueDescription: [{ required: true, message: t('common.required') }],
  occurrenceTime: [{ required: true, message: t('common.required') }],
  currentUsedLife: [{ required: true, message: t('common.required') }],
  productionStaff: [{ required: true, message: t('common.required') }],
  teamLeader: [{ required: true, message: t('common.required') }],
  supervisor: [{ required: true, message: t('common.required') }],
  moldPurchaser: [{ required: true, message: t('common.required') }],
  inShippingSpaceCode: [{ required: true, message: t('common.required') }],
  outShippingSpaceCode: [{ required: true, message: t('common.required') }],
  engineeringTechnician: [{ required: true, message: t('common.required') }],
};

/**
 * 模具料号发生改变
 */
export function handleMoldNoChange(option: any, { row, $grid }) {
  const relatedKeys = [
    'sapWorkOrderNo',
    'moldStatus',
    'moldStatusName',
    'moldType',
    'moldTypeName',
    'factory',
    'factoryName',
    'insidePartNumber',
    'inShippingSpaceCode',
    'inShippingSpaceName',
    'outShippingSpaceCode',
    'outShippingSpaceName',
    'shippingSpaceCode',
    'shippingSpaceName',
    'moldPurchaser',
    'moldPurchaserName',
  ];
  if (option) {
    const moldStatusOption = moldStatusOptions.find(item => +item.value === +option.moldStatus);
    const moldTypeOption = moldTypeOptions.find(item => item.value === option.moldType);
    $grid.setRow(row, {
      ...pick(option, relatedKeys),
      moldStatusName: moldStatusOption?.fullName || '',
      moldTypeName: moldTypeOption?.fullName || '',
      outShippingSpaceCode: option.outShippingSpaceCode || option.shippingSpaceCode,
      outShippingSpaceName: option.outShippingSpaceName || option.shippingSpaceName,
    });
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
