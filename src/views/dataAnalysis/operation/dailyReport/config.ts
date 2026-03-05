import XEUtils from 'xe-utils';
import { commonOrgCode1FormOptions, commonDateRangeFormOptions } from '/@/views/dataAnalysis/config';
import { getDateRangeDim } from '/@/views/dataAnalysis/utils';
import { PERSONNEL_DETAIL_STATUS_OPTIONS } from '/@/views/dashboard/operate/config';

import AnalysisPopover from './components/AnalysisPopover.vue';
import AnalysisInfoDetail from './components/AnalysisInfoDetail/index.vue';
import { EFormItemType, ETimeDimension, TFormItemOption } from '/@/views/dataAnalysis/components/BaseSearchForm/types';
import { commonMediumTextOption, commonTextOption, commonValueOption } from '/@/views/dataAnalysis/components/BaseVxeTable/config';
import dayjs, { Dayjs } from 'dayjs';
import { BaseVxeTableTypes, ESlotDefault } from '/@/views/dataAnalysis/components/BaseVxeTable/types';
import { PowerOnStatus } from '/@/views/dashboard/operate/types';
import { EEquipmentManagementModulesLabel, EManagementModulesLabel, ETicketsManagementModulesLabel } from './types';
import { EAOIMark } from '/@/views/dashboard/operate/metricsCenter/components/UtilizationRate/config';

// 表单配置
const timeDimensionOptions = [
  { text: '天', value: ETimeDimension.DAY },
  { text: '周', value: ETimeDimension.WEEK },
  { text: '月', value: ETimeDimension.MONTH },
];
export const formOptions: TFormItemOption[] = [
  commonOrgCode1FormOptions,
  {
    type: EFormItemType.SELECT,
    default: ETimeDimension.DAY,
    key: 'dimension',
    attrs: {
      allowClear: false,
    },
    options: timeDimensionOptions,
  },
  {
    ...commonDateRangeFormOptions,
    getParam: (value: [Dayjs, Dayjs], searchFormValue) => {
      const { dimension } = searchFormValue;
      if (dimension === ETimeDimension.DAY) {
        const [startDate, endDate] = value;
        return { startTime: startDate.startOf('day').valueOf(), endTime: endDate.startOf('day').valueOf() };
      }
      const { startDim, endDim } = getDateRangeDim(searchFormValue.dimension, value);
      return { startDim, endDim };
    },
  },
];

// 导出表格字段配置
const ALL_PROBLEM_CATEGARO_TARGET_TYPE = ['时间稼动率', '模切', '手工']; // 目前分析浮窗支持的指标类型
const ALL_PROBLEM_METRIC_TARGET_TYPE = ['时间稼动率', '出勤率']; // 目前分析浮窗支持的指标
export const commonValueFormatter = ({ cellValue: value }) => {
  if (!value) {
    return '';
  }
  if (value.includes('%')) {
    return value.replace(' ', '');
  }
  return XEUtils.commafy(value, { digits: 0 });
};
export const commonColumns: Record<string, BaseVxeTableTypes.Column> = {
  modules: {
    ...commonMediumTextOption,
    title: '管理模块',
    field: 'modules',
    fixed: 'left',
    mergeConfig: {
      needMergeRow: true,
    },
  },
  category: {
    ...commonMediumTextOption,
    title: '指标类型',
    field: 'category',
    fixed: 'left',
    mergeConfig: {
      needMergeRow: true,
    },
  },
  metric: {
    ...commonMediumTextOption,
    title: '指标',
    field: 'metric',
    fixed: 'left',
  },
  target: {
    ...commonTextOption,
    title: '目标',
    field: 'target',
  },
  vlist: {
    field: 'vlist',
  },
  totalS: {
    ...commonValueOption,
    title: 'Total',
    field: 'totalS',
    formatter: commonValueFormatter,
  },
  Analysis: {
    field: 'Analysis',
    title: 'Daily top分析',
    minWidth: 120,
  },
};
export const getAllColumns = (): BaseVxeTableTypes.Columns => {
  return [
    commonColumns.modules,
    commonColumns.category,
    commonColumns.metric,
    commonColumns.target,
    commonColumns.vlist,
    commonColumns.totalS,
    commonColumns.Analysis,
  ];
};

// 自定义格式化字段表头配置
export const customFieldOptions = {
  vlist: {
    getColumns: ({ data }) => {
      const columns = data.map((item, idx) => ({
        field: `list${idx}`,
        title: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dayjs(item.dateS).day()],
        headerAlign: 'center',
        headerClassName: 'bg-purple',
        children: [
          {
            ...commonValueOption,
            field: item.dateS,
            title: dayjs(item.dateS).format('MM-DD'),
            headerClassName: 'bg-purple',
            formatter: commonValueFormatter,
            slots: {
              default: ESlotDefault.DAILY_REPORT,
            },
            params: {
              popoverComponent: AnalysisPopover,
              dialogueCompo: AnalysisInfoDetail,
              getPathUrl: ({ searchFormValue, row }) => {
                if (searchFormValue.dimension !== ETimeDimension.DAY) {
                  return '';
                }
                switch (row.modules) {
                  // 人员管理模块跳转
                  case EManagementModulesLabel.PERSONNEL:
                    return '/dashboard/operate/attendanceRate/personnelDetail';
                  // 设备管理模块跳转
                  case EManagementModulesLabel.EQUIPMENT:
                    switch (row.category) {
                      // 设备管理--联线率模块跳转
                      case EEquipmentManagementModulesLabel.CONNECTION_RATE:
                      case EEquipmentManagementModulesLabel.OPEN_LINE_RATE:
                        return '/dashboard/operate/uptime/machineDetails';
                      // 设备管理--时间稼动率模块跳转
                      case EEquipmentManagementModulesLabel.TIME_UTILIZATION_RATE:
                        return '/dashboard/operate/oee/detail/timeUtilizationRateAbnormal';
                      // 设备管理--AOI模块跳转
                      case EEquipmentManagementModulesLabel.COMMON_AOI:
                      case EEquipmentManagementModulesLabel.DEDICATED_AOI:
                      case EEquipmentManagementModulesLabel.ALL_AOI:
                        return '/dashboard/operate/utilizationRate/infoDetail';
                      default:
                        return '';
                    }
                  // 工单管理模块跳转
                  case EManagementModulesLabel.TICKETS:
                    switch (row.metric) {
                      // 工单管理--模切产出(K)模块跳转
                      case ETicketsManagementModulesLabel.DIE_CUT_OUTPUT:
                      case ETicketsManagementModulesLabel.MQ_RATE:
                        return '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal';
                      // 工单管理--AOI良率模块跳转
                      case ETicketsManagementModulesLabel.AOI_RATE:
                      case ETicketsManagementModulesLabel.AOI_OUTPUT:
                        return '/dashboard/operate/utilizationRate/infoDetail';
                      // 工单管理--手工良率模块跳转
                      case ETicketsManagementModulesLabel.MANUAL_YIELD:
                        return '/dashboard/operate/processYield/handInfoDetail';
                      // 工单管理--结单良率模块跳转
                      case ETicketsManagementModulesLabel.STATEMENT_YIELD:
                        return '/dashboard/operate/processYield/stateInfoDetail';
                      // 工单管理--手工产出(K)模块跳转
                      case ETicketsManagementModulesLabel.HAND_OUTPUT:
                        return '/dashboard/operate/processYield/handInfoDetail';
                      // 工单管理--包装产出(K)模块跳转
                      case ETicketsManagementModulesLabel.PROCESS_OUTPUT:
                        return '/dashboard/operate/processYield/processDetail';
                      // 工单管理--FAI直通率模块跳转
                      case ETicketsManagementModulesLabel.FAI_RATE:
                        return '/dashboard/operate/qualityAudit/faiDetail';
                      // 工单管理--FQC直通率模块跳转
                      case ETicketsManagementModulesLabel.FQC_RATE:
                        return '/dashboard/operate/qualityAudit/fqcDetail';
                      // 工单管理--低级问题模块跳转
                      case ETicketsManagementModulesLabel.LOW_QUESTIONS:
                      case ETicketsManagementModulesLabel.GENERAL_QUESTIONS:
                        return '/dashboard/operate/qualityAudit/problemDetail';
                      default:
                        return '';
                    }
                  // 达成状况模块跳转
                  case EManagementModulesLabel.STATUS_ACHIEVED:
                    return '/dashboard/operate/dieCutting/infoDetail';
                  default:
                    return '';
                }
              },
              getPathParams: ({ row, column, searchFormValue }) => {
                const { field } = column;
                switch (row.modules) {
                  // 人员管理模块跳转
                  case EManagementModulesLabel.PERSONNEL:
                    return {
                      type: row.category === '汇总' ? '全部' : row.category,
                      status: (PERSONNEL_DETAIL_STATUS_OPTIONS.find(item => item.label === row.metric) || PERSONNEL_DETAIL_STATUS_OPTIONS[0]).value,
                      orgCode: searchFormValue.orgCode,
                      date: field,
                    };
                  // 设备管理模块跳转
                  case EManagementModulesLabel.EQUIPMENT:
                    switch (row.category) {
                      // 设备管理--联线率模块跳转
                      case EEquipmentManagementModulesLabel.CONNECTION_RATE:
                        return {
                          ...(row.metric === '联线数' ? { isonline: PowerOnStatus.ON } : {}),
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 设备管理--开线率模块跳转
                      case EEquipmentManagementModulesLabel.OPEN_LINE_RATE:
                        return {
                          ...(row.metric === '开线数' ? { status: PowerOnStatus.ON } : {}),
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 设备管理--时间稼动率模块跳转
                      case EEquipmentManagementModulesLabel.TIME_UTILIZATION_RATE:
                        return {
                          orgCode: searchFormValue.orgCode,
                          startTime: dayjs(field).tz().valueOf(),
                          endTime: dayjs(field).tz().valueOf(),
                        };
                      // 设备管理--AOI模块跳转
                      case EEquipmentManagementModulesLabel.COMMON_AOI:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                          mark: EAOIMark.GENERAL,
                        };
                      case EEquipmentManagementModulesLabel.DEDICATED_AOI:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                          mark: EAOIMark.SPECIAL,
                        };
                      case EEquipmentManagementModulesLabel.ALL_AOI:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                          mark: EAOIMark.ALL,
                        };
                      default:
                        return {};
                    }
                  // 工单管理模块跳转
                  case EManagementModulesLabel.TICKETS:
                    switch (row.metric) {
                      // 工单管理--模切良率模块跳转
                      case ETicketsManagementModulesLabel.MQ_RATE:
                        return {
                          orgCode: searchFormValue.orgCode,
                          startTime: dayjs(field).tz().valueOf(),
                          endTime: dayjs(field).tz().valueOf(),
                        };
                      // 工单管理--AOI良率模块跳转
                      case ETicketsManagementModulesLabel.AOI_RATE:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--手工良率模块跳转
                      case ETicketsManagementModulesLabel.MANUAL_YIELD:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--结单良率模块跳转
                      case ETicketsManagementModulesLabel.STATEMENT_YIELD:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--模切产出(K)模块跳转
                      case ETicketsManagementModulesLabel.DIE_CUT_OUTPUT:
                        return {
                          orgCode: searchFormValue.orgCode,
                          startTime: dayjs(field).tz().valueOf(),
                          endTime: dayjs(field).tz().valueOf(),
                        };
                      // 工单管理--AOI产出(K)模块跳转
                      case ETicketsManagementModulesLabel.AOI_OUTPUT:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--手工产出(K)模块跳转
                      case ETicketsManagementModulesLabel.HAND_OUTPUT:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--包装产出(K)模块跳转
                      case ETicketsManagementModulesLabel.PROCESS_OUTPUT:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--FAI直通率模块跳转
                      case ETicketsManagementModulesLabel.FAI_RATE:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--FQC直通率模块跳转
                      case ETicketsManagementModulesLabel.FQC_RATE:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                        };
                      // 工单管理--低级问题模块跳转
                      case ETicketsManagementModulesLabel.LOW_QUESTIONS:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                          type: '低级问题',
                        };
                      // 工单管理--常规问题模块跳转
                      case ETicketsManagementModulesLabel.GENERAL_QUESTIONS:
                        return {
                          orgCode: searchFormValue.orgCode,
                          date: field,
                          type: '常规问题',
                        };
                      default:
                        return {};
                    }
                  // 达成状况模块跳转
                  case EManagementModulesLabel.STATUS_ACHIEVED:
                    return {
                      orgCode: searchFormValue.orgCode,
                      date: field,
                    };
                  default:
                    return {};
                }
              },
              getHasAnalysis: row => {
                return ALL_PROBLEM_CATEGARO_TARGET_TYPE.includes(row.category) && ALL_PROBLEM_METRIC_TARGET_TYPE.includes(row.metric);
              },
              getDialogueInfo: ({ row, column, searchFormValue }) => {
                return {
                  startTime: dayjs(column.field).valueOf(),
                  endTime: dayjs(column.field).valueOf(),
                  target: row.category,
                  metric: row.metric,
                  orgCode: searchFormValue.orgCode,
                };
              },
            },
          },
        ],
      }));
      return columns;
    },
    formatData: (values: any[]) => {
      const info = values.reduce((pre, cur) => {
        return {
          ...pre,
          [cur.dateS]: cur.valueS,
        };
      }, {});
      return info;
    },
  },
};
