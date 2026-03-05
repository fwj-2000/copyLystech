import { ColumnsType, ColumnsOption, ETableCellSlotType } from '/@/views/dashboard/operate/hooks/useReportPage';
import { EPersonnelDetailStatus, PERSONNEL_DETAIL_STATUS_OPTIONS } from '/@/views/dashboard/operate/config';
import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

import { t } from '/@/hooks/web/useI18n';
import { getWeeklyreport, getWeeklyreportAttendance, getWeeklyreportOee, getWeeklyreportOrder, getWeeklyreportValue } from '/@/api/dashbord/report';
import { cloneDeep, merge } from 'lodash-es';

import { IPageInfo, EManagementModules, EModuleCode, EManagementModulesLabel, EEquipmentManagementModulesLabel, ETicketsManagementModulesLabel } from './type';
import { IOptions, PowerOnStatus, SearchFormValueType, TimeDimension } from '/@/views/dashboard/operate/types';
import dayjs from 'dayjs';
import { EAOIMark } from '../metricsCenter/components/UtilizationRate/config';

const { setParams, objectToHash } = useRouteParams();

// 前端定义的key和name的映射
export const MODULES_OPTIONS = Object.keys(EManagementModulesLabel).map(key => ({
  label: EManagementModulesLabel[key as keyof typeof EManagementModulesLabel],
  value: EManagementModules[key as keyof typeof EManagementModules],
}));

// 人员管理模块类型
export const PERSONNEL_MODULE_CODE_OPTIONS: IOptions[] = [
  { label: '在职', value: EModuleCode.INCUMBENCY },
  { label: '出勤', value: EModuleCode.ATTENDANCE },
  { label: '出勤率', value: EModuleCode.ATTENDANCE_RATE },
];

// 设备管理模块类型
export const EQUIPMENT_MODULE_CODE_OPTIONS: IOptions[] = [
  { label: '联线率', value: '1' },
  { label: '开线率', value: '2' },
  { label: '时间稼动率', value: '3' },
  { label: '通用AOI', value: '4' },
  { label: '专用AOI', value: '5' },
  { label: 'AOI汇总', value: '6' },
];

// 工单管理模块类型
export const TICKETS_MODULE_CODE_OPTIONS: IOptions[] = [
  { label: '实际产出', value: '1' },
  { label: '良率', value: '2' },
  { label: '品质稽核', value: '3' },
];

// 产销存管理模块类型
export const OUTPUT_MODULE_CODE_OPTIONS: IOptions[] = [
  { label: '产值', value: '1' },
  { label: '出货', value: '2' },
  { label: 'JIT/VMI', value: '3' },
  { label: '库存(W)', value: '4' },
  { label: 'WOS/DOS', value: '5' },
];

// 所有的指标code配置--给二级跳转用
export const ALL_MODULE_CODE_OPTIONS = {
  [EManagementModules.PERSONNEL]: PERSONNEL_MODULE_CODE_OPTIONS,
  [EManagementModules.EQUIPMENT]: EQUIPMENT_MODULE_CODE_OPTIONS,
  [EManagementModules.TICKETS]: TICKETS_MODULE_CODE_OPTIONS,
  [EManagementModules.OUTPUT]: OUTPUT_MODULE_CODE_OPTIONS,
};

// 根据配置label获取配置的值
const getOptionValueByLabel = (options, label) => {
  // 格式化表格列名
  return (options.find(item => item.label === label) || { value: '' }).value;
};
// 获取时间路由参数
const getDateParams = (searchFormValue: SearchFormValueType, isRange = true) => {
  if (isRange) {
    return {
      date: searchFormValue?.dateRange && searchFormValue?.dateRange[1].format('YYYY-MM-DD'),
      startDate: searchFormValue?.dateRange && searchFormValue?.dateRange[0].format('YYYY-MM-DD'),
    };
  }
  return {
    date: searchFormValue?.dateRange && searchFormValue?.dateRange[0].format('YYYY-MM-DD'),
  };
};

// 通用的表格头配置
const ALL_COLUMNS_OPTIONS: { [key: string]: ColumnsOption } = {
  // 总数据
  modules: {
    dataIndex: 'modules',
    baseInfo: {
      title: '管理模块',
      fixed: 'left',
      width: '74px',
      cssStyle: 'font-weight: bolder;',
      type: ETableCellSlotType.LINK,
      getIsLink: record => {
        return [EManagementModulesLabel.PERSONNEL, EManagementModulesLabel.EQUIPMENT, EManagementModulesLabel.TICKETS, EManagementModulesLabel.OUTPUT].includes(
          record.modules,
        );
      },
      getRouteInfo: ({ record, searchFormValue }) => {
        const moduleName = getOptionValueByLabel(MODULES_OPTIONS, record.modules);
        return {
          path: '/dashboard/operate/report',
          query: {
            name: moduleName,
            ...getDateParams(searchFormValue),
          },
        };
      },
    },
    isRowSpan: true,
    filterable: true,
  },
  category: {
    dataIndex: 'category',
    baseInfo: {
      title: '指标类型',
      fixed: 'left',
      width: '74px',
      cssStyle: 'font-weight: bolder',
    },
    isRowSpan: true,
    filterable: true,
  },
  metric: {
    dataIndex: 'metric',
    baseInfo: {
      title: '指标',
      fixed: 'left',
      width: '64px',
      cssStyle: 'font-weight: bolder',
    },
    filterable: true,
  },
  target: {
    dataIndex: 'target',
    baseInfo: {
      fixed: 'left',
      title: '目标',
      width: '64px',
    },
  },
  vlist: {
    dataIndex: 'vlist',
    type: ColumnsType.DATE_VALUE_LIST,
    baseInfo: {},
  },
  totalS: {
    dataIndex: 'totalS',
    sortable: true,
    baseInfo: {
      title: 'Total',
      fixed: 'right',
      width: '94px',
      customRender: ({ text }) => {
        return text.replace(' ', '');
      },
    },
  },
  Analysis: {
    dataIndex: 'Analysis',
    baseInfo: {
      title: 'Daily top分析',
      fixed: 'right',
      width: '64px',
      cssStyle: 'white-space: nowrap;',
    },
  },
  // 人员管理
  bu: {
    dataIndex: 'bu',
    baseInfo: {
      title: 'BU',
      fixed: 'left',
      width: '44px',
      cssStyle: 'font-weight: bolder;',
    },
    isRowSpan: true,
    filterable: true,
  },
  sbu: {
    dataIndex: 'sbu',
    baseInfo: {
      title: '厂区',
      fixed: 'left',
      width: '64px',
      cssStyle: 'font-weight: bolder;',
    },
    isRowSpan: true,
    filterable: true,
  },
};
// 根据dataIndex列表获取表头配置
const getColumnsOptions = (columns: ColumnsOption[]) => {
  return columns.map(item => merge(cloneDeep(ALL_COLUMNS_OPTIONS[item.dataIndex]) || { title: item.dataIndex }, item));
};
// 获取传递额外参数的promise请求
const getPromiseApi = (reqMth: any, query: any) =>
  new Promise((resolve, reject) => {
    reqMth(query)
      .then(res => resolve(res))
      .catch(res => reject(res));
  });

// 目前分析浮窗支持的指标类型
const ALL_PROBLEM_CATEGARO_TARGET_TYPE = ['时间稼动率', '模切', '手工'];
export enum EAllProblemMetricTargetType {
  TIME_UTILIZATION_RATE = '时间稼动率',
  ATTENDANCE = '出勤率',
}

// 所有页面配置信息
export const PAGE_CONFIG_INFO: {
  [key in EManagementModules]: IPageInfo;
} = {
  // 首页
  [EManagementModules.ALL]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getWeeklyreport, {
        ...queryParams,
        orgCode: searchFormValue.orgCode,
        period: searchFormValue.period,
      }),
    title: t('views.dashboard.operate.dailyReport.title'),
    columnsOptions: getColumnsOptions([
      { dataIndex: 'modules' },
      {
        dataIndex: 'category',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: record => {
            return [EManagementModulesLabel.EQUIPMENT, EManagementModulesLabel.TICKETS].includes(record.modules);
          },
          getRouteInfo: ({ record, searchFormValue }) => {
            const moduleName = getOptionValueByLabel(MODULES_OPTIONS, record.modules);
            const moduleCodeOptions = ALL_MODULE_CODE_OPTIONS[moduleName] || [];
            return {
              path: '/dashboard/operate/report',
              query: {
                name: moduleName,
                moduleCode: getOptionValueByLabel(moduleCodeOptions, record.category) || '1',
                ...getDateParams(searchFormValue),
              },
            };
          },
        },
      },
      {
        dataIndex: 'metric',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: record => {
            return [EManagementModulesLabel.PERSONNEL].includes(record.modules);
          },
          getRouteInfo: ({ record, searchFormValue }) => {
            const moduleName = getOptionValueByLabel(MODULES_OPTIONS, record.modules);
            const moduleCodeOptions = ALL_MODULE_CODE_OPTIONS[moduleName] || [];
            return {
              path: '/dashboard/operate/report',
              query: {
                name: moduleName,
                moduleCode: getOptionValueByLabel(moduleCodeOptions, record.metric) || '1',
                ...getDateParams(searchFormValue),
              },
            };
          },
        },
      },
      { dataIndex: 'target' },
      {
        dataIndex: 'vlist',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getHasAnalysis: record => {
            return ALL_PROBLEM_CATEGARO_TARGET_TYPE.includes(record.category) && Object.values(EAllProblemMetricTargetType).includes(record.metric);
          },
          getIsLink: (_, searchFormValue) => {
            return searchFormValue.timeDimension === TimeDimension.DAY;
          },
          getRouteInfo: ({ dataIndex, record, searchFormValue }) => {
            switch (record.modules) {
              // 人员管理模块跳转
              case EManagementModulesLabel.PERSONNEL:
                return {
                  path: '/dashboard/operate/attendanceRate/personnelDetail',
                  query: {
                    type: record.category === '汇总' ? '全部' : record.category,
                    status: (PERSONNEL_DETAIL_STATUS_OPTIONS.find(item => item.label === record.metric) || PERSONNEL_DETAIL_STATUS_OPTIONS[0]).value,
                    orgCode: searchFormValue.orgCode,
                    date: dataIndex,
                  },
                };
              // 设备管理模块跳转
              case EManagementModulesLabel.EQUIPMENT:
                switch (record.category) {
                  // 设备管理--联线率模块跳转
                  case EEquipmentManagementModulesLabel.CONNECTION_RATE:
                    return {
                      path: '/dashboard/operate/uptime/machineDetails',
                      query: {
                        ...(record.metric === '联线数' ? { isonline: PowerOnStatus.ON } : {}),
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 设备管理--开线率模块跳转
                  case EEquipmentManagementModulesLabel.OPEN_LINE_RATE:
                    if (['开线人线比', '总人线比'].includes(record.metric)) {
                      const params = {
                        OrgCode: searchFormValue.orgCode,
                        TimeDate: dayjs(dataIndex),
                      };
                      const paramsId = objectToHash(params);
                      setParams(paramsId, params);
                      return {
                        path: `/dataAnalysis/operation/metricsCenter/detail/outputPerCapita?paramsId=${paramsId}`,
                      };
                    }
                    return {
                      path: '/dashboard/operate/uptime/machineDetails',
                      query: {
                        ...(record.metric === '开线数' ? { status: PowerOnStatus.ON } : {}),
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 设备管理--时间稼动率模块跳转
                  case EEquipmentManagementModulesLabel.TIME_UTILIZATION_RATE:
                    return {
                      path: '/dashboard/operate/oee/detail/timeUtilizationRateAbnormal',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        startTime: dayjs(dataIndex).tz().valueOf(),
                        endTime: dayjs(dataIndex).tz().valueOf(),
                      },
                    };
                  // 设备管理--AOI模块跳转
                  case EEquipmentManagementModulesLabel.COMMON_AOI:
                    return {
                      path: '/dashboard/operate/utilizationRate/infoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                        mark: EAOIMark.GENERAL,
                      },
                    };
                  case EEquipmentManagementModulesLabel.DEDICATED_AOI:
                    return {
                      path: '/dashboard/operate/utilizationRate/infoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                        mark: EAOIMark.SPECIAL,
                      },
                    };
                  case EEquipmentManagementModulesLabel.ALL_AOI:
                    return {
                      path: '/dashboard/operate/utilizationRate/infoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                        mark: EAOIMark.ALL,
                      },
                    };
                  default:
                    return {};
                }
              // 工单管理模块跳转
              case EManagementModulesLabel.TICKETS:
                switch (record.metric) {
                  // 工单管理--模切良率模块跳转
                  case ETicketsManagementModulesLabel.MQ_RATE:
                    return {
                      path: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        startTime: dayjs(dataIndex).tz().valueOf(),
                        endTime: dayjs(dataIndex).tz().valueOf(),
                      },
                    };
                  // 工单管理--AOI良率模块跳转
                  case ETicketsManagementModulesLabel.AOI_RATE:
                    return {
                      path: '/dashboard/operate/utilizationRate/infoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--手工良率模块跳转
                  case ETicketsManagementModulesLabel.MANUAL_YIELD:
                    return {
                      path: '/dashboard/operate/processYield/handInfoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--结单良率模块跳转
                  case ETicketsManagementModulesLabel.STATEMENT_YIELD:
                    return {
                      path: '/dashboard/operate/processYield/stateInfoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--模切产出(K)模块跳转
                  case ETicketsManagementModulesLabel.DIE_CUT_OUTPUT:
                    return {
                      path: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        startTime: dayjs(dataIndex).tz().valueOf(),
                        endTime: dayjs(dataIndex).tz().valueOf(),
                      },
                    };
                  // 工单管理--AOI产出(K)模块跳转
                  case ETicketsManagementModulesLabel.AOI_OUTPUT:
                    return {
                      path: '/dashboard/operate/utilizationRate/infoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--手工产出(K)模块跳转
                  case ETicketsManagementModulesLabel.HAND_OUTPUT:
                    return {
                      path: '/dashboard/operate/processYield/handInfoDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--包装产出(K)模块跳转
                  case ETicketsManagementModulesLabel.PROCESS_OUTPUT:
                    return {
                      path: '/dashboard/operate/processYield/processDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--FAI直通率模块跳转
                  case ETicketsManagementModulesLabel.FAI_RATE:
                    return {
                      path: '/dashboard/operate/qualityAudit/faiDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--FQC直通率模块跳转
                  case ETicketsManagementModulesLabel.FQC_RATE:
                    return {
                      path: '/dashboard/operate/qualityAudit/fqcDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                      },
                    };
                  // 工单管理--低级问题模块跳转
                  case ETicketsManagementModulesLabel.LOW_QUESTIONS:
                    return {
                      path: '/dashboard/operate/qualityAudit/problemDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                        type: '低级问题',
                      },
                    };
                  // 工单管理--常规问题模块跳转
                  case ETicketsManagementModulesLabel.GENERAL_QUESTIONS:
                    return {
                      path: '/dashboard/operate/qualityAudit/problemDetail',
                      query: {
                        orgCode: searchFormValue.orgCode,
                        date: dataIndex,
                        type: '常规问题',
                      },
                    };
                  default:
                    return {};
                }
              // 达成状况模块跳转
              case EManagementModulesLabel.STATUS_ACHIEVED:
                return {
                  path: '/dashboard/operate/dieCutting/infoDetail',
                  query: {
                    orgCode: searchFormValue.orgCode,
                    date: dataIndex,
                  },
                };
              default:
                return {};
            }
          },
        },
      },
      { dataIndex: 'totalS' },
      { dataIndex: 'Analysis' },
    ]),
  },
  // 人员管理-二级页面
  [EManagementModules.PERSONNEL]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getWeeklyreportAttendance, {
        ...queryParams,
        orgCode: searchFormValue.orgCode,
        period: searchFormValue.period,
        moduleCode: searchFormValue.moduleCode,
      }),
    title: t('views.dashboard.operate.dailyReport.personnelManagement'),
    columnsOptions: getColumnsOptions([
      { dataIndex: 'bu' },
      { dataIndex: 'sbu' },
      {
        dataIndex: 'metric',
        baseInfo: {
          title: '类别',
          type: ETableCellSlotType.LINK,
          getIsLink: () => true,
          getRouteInfo: ({ record, searchFormValue }) => {
            return {
              path: '/dashboard/operate/attendanceRate/personnelDetail',
              query: {
                type: record.metric === '汇总' ? '全部' : record.metric,
                orgCode: record.orgCode,
                ...getDateParams(searchFormValue, false),
              },
            };
          },
        },
      },
      { dataIndex: 'target' },
      {
        dataIndex: 'vlist',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: (_, searchFormValue) => {
            return searchFormValue.timeDimension === TimeDimension.DAY;
          },
          getRouteInfo: ({ dataIndex, record, searchFormValue }) => {
            return {
              path: '/dashboard/operate/attendanceRate/personnelDetail',
              query: {
                type: record.metric === '汇总' ? '全部' : record.metric,
                status: searchFormValue.moduleCode === EModuleCode.ATTENDANCE ? EPersonnelDetailStatus.ATTENDANCE : EPersonnelDetailStatus.INCUMBENCY,
                orgCode: record.orgCode,
                date: dataIndex,
              },
            };
          },
        },
      },
      { dataIndex: 'totalS' },
      { dataIndex: 'Analysis' },
    ]),
    // 默认搜索条件
    defaultSearchFormValue: { moduleCode: EModuleCode.INCUMBENCY },
  },
  // 设备管理-二级页面
  [EManagementModules.EQUIPMENT]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getWeeklyreportOee, {
        ...queryParams,
        orgCode: searchFormValue.orgCode,
        period: searchFormValue.period,
        moduleCode: searchFormValue.moduleCode,
      }),
    title: t('views.dashboard.operate.dailyReport.equipmentManagement'),
    columnsOptions: getColumnsOptions([
      { dataIndex: 'bu' },
      { dataIndex: 'sbu' },
      { dataIndex: 'metric', baseInfo: { title: '类别' } },
      { dataIndex: 'target' },
      {
        dataIndex: 'vlist',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: (_, searchFormValue) => {
            return searchFormValue.timeDimension === TimeDimension.DAY;
          },
          getRouteInfo: ({ searchFormValue, dataIndex, record }) => {
            const moduleName = (
              EQUIPMENT_MODULE_CODE_OPTIONS.find(item => `${item.value}` === `${searchFormValue.moduleCode}`) || EQUIPMENT_MODULE_CODE_OPTIONS[0]
            )?.label;
            switch (moduleName) {
              // 设备管理--联线率模块跳转
              case EEquipmentManagementModulesLabel.CONNECTION_RATE:
                return {
                  path: '/dashboard/operate/uptime/machineDetails',
                  query: {
                    ...(record.metric === '联线数' ? { isonline: PowerOnStatus.ON } : {}),
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 设备管理--开线率模块跳转
              case EEquipmentManagementModulesLabel.OPEN_LINE_RATE:
                return {
                  path: '/dashboard/operate/uptime/machineDetails',
                  query: {
                    ...(record.metric === '开线数' ? { status: PowerOnStatus.ON } : {}),
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 设备管理--时间稼动率模块跳转
              case EEquipmentManagementModulesLabel.TIME_UTILIZATION_RATE:
                return {
                  path: '/dashboard/operate/oee/detail/timeUtilizationRateAbnormal',
                  query: {
                    orgCode: record.orgCode,
                    startTime: dayjs(dataIndex).tz().valueOf(),
                    endTime: dayjs(dataIndex).tz().valueOf(),
                  },
                };
              // 设备管理--AOI模块跳转
              case EEquipmentManagementModulesLabel.COMMON_AOI:
                return {
                  path: '/dashboard/operate/utilizationRate/infoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                    mark: EAOIMark.GENERAL,
                  },
                };
              case EEquipmentManagementModulesLabel.DEDICATED_AOI:
                return {
                  path: '/dashboard/operate/utilizationRate/infoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                    mark: EAOIMark.SPECIAL,
                  },
                };
              case EEquipmentManagementModulesLabel.ALL_AOI:
                return {
                  path: '/dashboard/operate/utilizationRate/infoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                    mark: EAOIMark.ALL,
                  },
                };
              default:
                return {};
            }
          },
        },
      },
      { dataIndex: 'totalS' },
      { dataIndex: 'Analysis' },
    ]),
    // 默认搜索条件
    defaultSearchFormValue: { moduleCode: EModuleCode.INCUMBENCY },
  },
  // 工单管理-二级页面
  [EManagementModules.TICKETS]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getWeeklyreportOrder, {
        ...queryParams,
        orgCode: searchFormValue.orgCode,
        period: searchFormValue.period,
        moduleCode: searchFormValue.moduleCode,
      }),
    title: t('views.dashboard.operate.dailyReport.ticketsManagement'),
    columnsOptions: getColumnsOptions([
      { dataIndex: 'bu' },
      { dataIndex: 'sbu' },
      { dataIndex: 'metric', baseInfo: { title: '类别' } },
      { dataIndex: 'target' },
      {
        dataIndex: 'vlist',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: (_, searchFormValue) => {
            return searchFormValue.timeDimension === TimeDimension.DAY;
          },
          getRouteInfo: ({ dataIndex, record }) => {
            switch (record.metric) {
              // 工单管理--模切良率模块跳转
              case ETicketsManagementModulesLabel.MQ_RATE:
                return {
                  path: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
                  query: {
                    orgCode: record.orgCode,
                    startTime: dayjs(dataIndex).tz().valueOf(),
                    endTime: dayjs(dataIndex).tz().valueOf(),
                  },
                };
              // 工单管理--AOI良率模块跳转
              case ETicketsManagementModulesLabel.AOI_RATE:
                return {
                  path: '/dashboard/operate/utilizationRate/infoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 工单管理--手工良率模块跳转
              case ETicketsManagementModulesLabel.MANUAL_YIELD:
                return {
                  path: '/dashboard/operate/processYield/handInfoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 工单管理--结单良率模块跳转
              case ETicketsManagementModulesLabel.STATEMENT_YIELD:
                return {
                  path: '/dashboard/operate/processYield/stateInfoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 工单管理--模切产出(K)模块跳转
              case ETicketsManagementModulesLabel.DIE_CUT_OUTPUT:
                return {
                  path: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
                  query: {
                    orgCode: record.orgCode,
                    startTime: dayjs(dataIndex).tz().valueOf(),
                    endTime: dayjs(dataIndex).tz().valueOf(),
                  },
                };
              // 工单管理--AOI产出(K)模块跳转
              case ETicketsManagementModulesLabel.AOI_OUTPUT:
                return {
                  path: '/dashboard/operate/utilizationRate/infoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 工单管理--手工产出(K)模块跳转
              case ETicketsManagementModulesLabel.HAND_OUTPUT:
                return {
                  path: '/dashboard/operate/processYield/handInfoDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              // 工单管理--包装产出(K)模块跳转
              case ETicketsManagementModulesLabel.PROCESS_OUTPUT:
                return {
                  path: '/dashboard/operate/processYield/processDetail',
                  query: {
                    orgCode: record.orgCode,
                    date: dataIndex,
                  },
                };
              default:
                return {};
            }
          },
        },
      },
      { dataIndex: 'totalS' },
      { dataIndex: 'Analysis' },
    ]),
    // 默认搜索条件
    defaultSearchFormValue: { moduleCode: EModuleCode.INCUMBENCY },
  },
  // 产销存管理-二级页面
  [EManagementModules.OUTPUT]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getWeeklyreportValue, {
        ...queryParams,
        orgCode: searchFormValue.orgCode,
        period: searchFormValue.period,
        moduleCode: searchFormValue.moduleCode,
      }),
    title: t('views.dashboard.operate.dailyReport.outputManagement'),
    columnsOptions: getColumnsOptions([
      { dataIndex: 'bu' },
      { dataIndex: 'sbu' },
      { dataIndex: 'metric', baseInfo: { title: '类别' } },
      { dataIndex: 'target' },
      {
        dataIndex: 'vlist',
        baseInfo: {
          type: ETableCellSlotType.LINK,
          getIsLink: (_, searchFormValue) => {
            return searchFormValue.timeDimension === TimeDimension.DAY;
          },
          getRouteInfo: ({ dataIndex, record }) => {
            return {
              path: '/dashboard/operate/output/infoDetail',
              query: {
                orgCode: record.orgCode,
                date: dataIndex,
              },
            };
          },
        },
      },
      { dataIndex: 'totalS' },
      { dataIndex: 'Analysis' },
    ]),
    // 默认搜索条件
    defaultSearchFormValue: { moduleCode: EModuleCode.INCUMBENCY },
  },
};
