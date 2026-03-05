import { useI18n } from '/@/hooks/web/useI18n';
import {
  reasonOptions,
  REASON_ENUM as ORIGIN_REASON_ENUM,
  repairOptions,
  REPAIR_ENUM as ORIGIN_REPAIR_ENUM,
  formatPercentage,
  demandTypeOptions,
} from '/@/views/productionDeal/mouldBusiness/maintenance/config';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 维修类型枚举
 */
export const REPAIR_ENUM = ORIGIN_REPAIR_ENUM;
/**
 * 原因分析枚举
 */
export const REASON_ENUM = ORIGIN_REASON_ENUM;

/**
 * 责任单位枚举
 */
export enum BUSINESS_UNIT_ENUM {
  供应商 = '1',
  生产 = '2',
  工程 = '3',
  生技 = '4',
}
// export const businessUnitOption: Array<{ label: string; value: string; fullName: string; id: string }> = [];
// baseStore.getDictionaryData('MoldRepairResponsibleDepartment').then((res: Array<any>) => {
//   businessUnitOption.push(
//     ...res.map(item => {
//       return {
//         ...item,
//         value: item.enCode,
//         label: item.fullName,
//       };
//     }),
//   );
// });

/**
 * 工程/生技意见 枚举
 */
export enum OPINION_ENUM {
  维修 = '1',
  报废 = '2',
}
// export const opinionOptions: Array<{ label: string; value: string; fullName: string; id: string }> = [];
// baseStore.getDictionaryData('MoldRepairEngTechOpinions').then((res: Array<any>) => {
//   opinionOptions.push(
//     ...res.map(item => {
//       return {
//         ...item,
//         value: item.enCode,
//         label: item.fullName,
//       };
//     }),
//   );
// });

/**
 * 判定 - 表单配置
 */
export const getJudgmentSchemas = () => [
  {
    field: 'causeAnalysis',
    label: '原因分析',
    component: 'Select',
    componentProps: {
      options: reasonOptions,
      fieldNames: { label: 'label', value: 'value' },
    },
  },
  // 原因分析其他信息
  {
    field: 'otherCauseAnalysis',
    label: t('dict.MoldRepairApply.otherCauseAnalysis'),
    component: 'Input',
    componentProps: {
      placeholder: t('dict.mouldBusiness.otherReasonsPlaceholder'),
      disabled: true,
    },
    colProps: {
      span: 20,
    },
  },
  // 判定责任单位
  {
    field: 'responsibleDepartment',
    label: t('dict.MoldRepairApply.responsibleDepartment'),
    component: 'ApiSelect',
    componentProps: {
      api: () => {
        return baseStore.getDictionaryData('MoldRepairResponsibleDepartment');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  {
    field: 'repairContent',
    label: '改善对策',
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  // 工程/生技意见
  {
    field: 'engineeringTechnicianOpinions',
    label: t('dict.MoldRepairApply.engineeringTechnicianOpinions'),
    component: 'ApiSelect',
    componentProps: {
      api: () => {
        return baseStore.getDictionaryData('MoldRepairEngTechOpinions');
      },
      labelField: 'fullName',
      valueField: 'enCode',
      filterOption: false,
      notFoundContent: null,
      immediate: true,
    },
  },
  // 要求交期
  {
    field: 'requireDeliveryTime',
    label: t('dict.MoldRepairApply.requireDeliveryTime'),
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'repairType',
    label: '维修类型',
    component: 'Select',
    componentProps: {
      options: repairOptions,
      fieldNames: { label: 'label', value: 'value' },
      placeholder: t('common.fromSys'),
    },
  },
  {
    field: 'repairSupplierName',
    i18nField: 'supplier',
    label: '供应商',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
];

/**
 * 异常信息 - 表单配置
 */
export const abnormalSchemas = [
  {
    field: 'moldRepairApplyNo',
    label: '单号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'demandType',
    i18nField: 'demandType',
    label: '需求类型',
    component: 'Select',
    componentProps: {
      disabled: true,
      options: demandTypeOptions,
    },
  },
  {
    field: 'moldNo',
    label: '模具料号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'moldTypeName',
    i18nField: 'moldType',
    label: '模具类型',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'moldStatus',
    i18nField: 'moldStatus',
    label: '模具状态',
    component: 'ApiSelect',
    componentProps: {
      disabled: true,
      api: () => baseStore.getDictionaryData('MoldLedgerStatusEnum'),
      resultField: 'data',
      labelField: 'fullName',
      valueField: 'enCode',
      immediate: true,
      showSearch: false,
      filterOption: false,
      notFoundContent: null,
    },
  },
  {
    field: 'insidePartNumber',
    label: '产品内部料号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'sapWorkOrderNo',
    label: 'SAP工单号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'exceptionCategoryName',
    i18nField: 'exceptionCategory',
    label: '异常类别',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'issueDescription',
    label: '问题描述',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: {
      span: 16,
    },
  },
  {
    field: 'factoryName',
    i18nField: 'factory',
    label: '工厂',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'occurrenceTime',
    label: '发生时间',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },

  {
    field: 'inspectionDocument',
    label: '检验文件',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'demandTypeName',
    label: '生产数量(KPCS)',
    i18nField: 'demandType',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'defectiveCountKpcs',
    label: '不良数(KPCS)',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'defectRate',
    label: '不良率',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
      formatter: formatPercentage,
      parser: (value: string) => value.replace('%', ''),
    },
  },
  {
    field: 'productionStaffName',
    i18nField: 'productionStaff',
    label: '生产人员',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'teamLeaderName',
    i18nField: 'teamLeader',
    label: '组长',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'supervisorName',
    i18nField: 'supervisor',
    label: '主管',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'engineeringTechnicianName',
    i18nField: 'engineeringTechnician',
    label: '工程/生技',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'moldPurchaserName',
    i18nField: 'moldPurchaser',
    label: '模具采购员',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'materialReturnerName',
    i18nField: 'materialReturner',
    label: '退料员',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'warehouseManagerName',
    i18nField: 'warehouseManager',
    label: '仓管员',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'documentPreparerName',
    i18nField: 'documentPreparer',
    label: '制单人',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'requestingDepartment',
    label: '申请部门',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'creatorTime',
    label: '创建时间',
    component: 'DatePicker',
    i18nField: 'CommonCol.creatorTime',
    componentProps: {
      disabled: true,
    },
  },
];
