import {
  getAttendanceRanking,
  getMachworkingRanking,
  getMqachieveRanking,
  getAoidatanewRanking,
  getOeeDataRanking,
  getOutputvalueRanking,
  getProcessyieldRanking,
  getFinanceeconomicBgRanking,
  getFinanceeconomicClshRanking,
  getFinanceeconomicRgRanking,
  getUtilizationrateRankingData,
  getQcauditRanking,
  getFaremanageAllocationrank,
  getProductsalesumRanking,
  getWorkorderloss38rank,
  performanceranking,
} from '/@/api/dashbord/ranking';
import { cloneDeep, merge } from 'lodash-es';

import { EIsONline, EOrgCode, PowerOnStatus, TimeDimension } from '/@/views/dashboard/operate/types';
import {
  IColumnsOption,
  IPageInfo,
  EModules,
  ETableCellSlotType,
  EOrgLevel,
  IGetColumnsOptionsParams,
  EUptimeRank,
  EMqAchieveRank,
  EAOIRank,
  EOEERank,
  EOutputRank,
  EProcessYieldRank,
  EBengonRank,
  EArtificialRank,
  ELostRank,
  EUtilizationRank,
  EQualityAuditRank,
  EExpenseRank,
} from './type';
import { EPersonnelDetailStatus } from '../config';
import dayjs from 'dayjs';
import { getSearchFormDateDimByDate } from '../../utils';
import { useRouteParams } from '/@/views/dataAnalysis/hooks/useRouteParams';

// 排行等级配置
export const ORG_LEVEL_OPTIONS = [
  { label: 'SBU', value: EOrgLevel.SBU },
  { label: 'BU', value: EOrgLevel.BU },
];

// 将维度字符串转换成日期YYYY-MM-DD格式
const convertDimensionStrToDate = (dimension: TimeDimension, str: string) => {
  if (dimension === TimeDimension.WEEK) {
    const [year, week] = str.split('WK');
    return dayjs().tz().year(Number(year)).week(Number(week)).startOf('week').format('YYYY-MM-DD');
  }
  return str;
};

// 通用的表格头配置
const ALL_COLUMNS_OPTIONS: { [key: string]: IColumnsOption } = {
  // 出勤概况
  Rank: {
    baseInfo: {
      title: '排名',
      width: 15,
    },
    sortable: true,
  },
  OrgName: {
    baseInfo: {
      title: 'BU',
      width: 30,
    },
  },
  AllCQRate: {
    baseInfo: {
      title: '出勤率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  AllCQNum: {
    baseInfo: {
      title: '出勤人数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/attendanceRate/personnelDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, KQDimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          status: EPersonnelDetailStatus.ATTENDANCE,
          date: convertDimensionStrToDate(timeDimension, KQDimension),
        };
      },
    },
    sortable: true,
  },
  AllQQNum: {
    baseInfo: {
      title: '缺勤人数',
      width: 20,
      customRender: ({ record }) => {
        const res = record.AllZZNum - record.AllCQNum;
        return res;
      },
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/attendanceRate/personnelDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, KQDimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          status: EPersonnelDetailStatus.ABSENCE,
          date: convertDimensionStrToDate(timeDimension, KQDimension),
        };
      },
    },
    sortable: true,
  },
  DLCQNum: {
    baseInfo: {
      title: 'DL出勤',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/attendanceRate/personnelDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, KQDimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          type: 'DL',
          status: EPersonnelDetailStatus.ATTENDANCE,
          date: convertDimensionStrToDate(timeDimension, KQDimension),
        };
      },
    },
    sortable: true,
  },
  IDLCQNum: {
    baseInfo: {
      title: 'IDL出勤',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/attendanceRate/personnelDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, KQDimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          type: 'IDL',
          status: EPersonnelDetailStatus.ATTENDANCE,
          date: convertDimensionStrToDate(timeDimension, KQDimension),
        };
      },
    },
    sortable: true,
  },
  AllZZNum: {
    baseInfo: {
      title: '总在职',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/attendanceRate/personnelDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, KQDimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          status: EPersonnelDetailStatus.INCUMBENCY,
          date: convertDimensionStrToDate(timeDimension, KQDimension),
        };
      },
    },
    sortable: true,
  },
  // 开机率
  OnlineRate: {
    baseInfo: {
      title: '联线率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  OnlineNum: {
    baseInfo: {
      title: '联机线体数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/uptime/machineDetails',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          isonline: EIsONline.ONLINE,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  TotalNum: {
    baseInfo: {
      title: '线体总数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/uptime/machineDetails',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  WorkingRate: {
    baseInfo: {
      title: '开线率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  PlatWorkingNum: {
    baseInfo: {
      title: '平板开机数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/uptime/machineDetails',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          type: '平板',
          status: PowerOnStatus.ON,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  RotaryWoringNum: {
    baseInfo: {
      title: '圆刀开机数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/uptime/machineDetails',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          type: '圆刀',
          status: PowerOnStatus.ON,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  // 模切达成
  BatchAchieveRate: {
    baseInfo: {
      title: '批次达成率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  AchieveBatch: {
    baseInfo: {
      title: '达成批次数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/machineDetails',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  TotalBatch: {
    baseInfo: {
      title: '总批次数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  QtyAchieveRate: {
    baseInfo: {
      title: '数量达成率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  AchieveQty: {
    baseInfo: {
      title: '模切报数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  TotalQty: {
    baseInfo: {
      title: '计划总数',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  // AOI数据
  Kaijilv: {
    baseInfo: {
      title: '开机率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  Kongxianbanci: {
    baseInfo: {
      title: '空闲班次',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/utilizationRate/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension, mark } = searchFormValue;
        return {
          orgCode: OrgCode,
          status: PowerOnStatus.OFF,
          mark,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  Kaijibanci: {
    baseInfo: {
      title: '开机班次',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/utilizationRate/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension, mark } = searchFormValue;
        return {
          orgCode: OrgCode,
          status: PowerOnStatus.ON,
          mark,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  Lianjilv: {
    baseInfo: {
      title: '联机率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  Lianglv: {
    baseInfo: {
      title: '良率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  Jitaijiadonglv: {
    baseInfo: {
      title: '稼动率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  // OEE
  Moqiejiadonglv: {
    baseInfo: {
      title: '时间稼动率',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/oee/detail/timeUtilizationRateAbnormal',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        const date = convertDimensionStrToDate(timeDimension, Dimension);
        const timeValue = dayjs(date).tz().valueOf();
        return {
          orgCode: OrgCode,
          startTime: timeValue,
          endTime: timeValue,
        };
      },
    },
    sortable: true,
  },
  Xingnengliyonglv: {
    baseInfo: {
      title: '性能利用率',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/oee/detail/performanceUtilizationAbnormal',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        const date = convertDimensionStrToDate(timeDimension, Dimension);
        const timeValue = dayjs(date).tz().valueOf();
        return {
          orgCode: OrgCode,
          startTime: timeValue,
          endTime: timeValue,
        };
      },
    },
    sortable: true,
  },
  Moqielianglv: {
    baseInfo: {
      title: '模切良率',
      width: 20,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/oee/detail/dieCuttingYieldAbnormal',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        const date = convertDimensionStrToDate(timeDimension, Dimension);
        const timeValue = dayjs(date).tz().valueOf();
        return {
          orgCode: OrgCode,
          startTime: timeValue,
          endTime: timeValue,
        };
      },
    },
    sortable: true,
  },
  Oee: {
    baseInfo: {
      title: 'OEE',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  // 产值
  FValueWan: {
    baseInfo: {
      title: '产值(万元)',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  AvgValue: {
    baseInfo: {
      title: '平均产值',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  FSalesWan: {
    baseInfo: {
      title: '出货(万元)',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  FSalesValue: {
    baseInfo: {
      title: '产销率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  // 制程良率
  MQYield: {
    baseInfo: {
      title: '模切良率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  MQTotal: {
    baseInfo: {
      title: '标准产出',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  MQGQty: {
    baseInfo: {
      title: '实际产出',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/dieCutting/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  HandYield: {
    baseInfo: {
      title: '手工良率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  HandGQty: {
    baseInfo: {
      title: '良品数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/processYield/handInfoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  HandTotal: {
    baseInfo: {
      title: '产品总数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/processYield/handInfoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  AOIYield: {
    baseInfo: {
      title: 'AOI良率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  AOIGQty: {
    baseInfo: {
      title: '良品数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/utilizationRate/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  AOITotal: {
    baseInfo: {
      title: '过检总数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/utilizationRate/infoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  OrderYield: {
    baseInfo: {
      title: '结单良率',
      type: ETableCellSlotType.RANKING,
      width: 40,
    },
    sortable: true,
  },
  OrderQty: {
    baseInfo: {
      title: '工单数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/processYield/stateInfoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  OrderGQty: {
    baseInfo: {
      title: '入库数',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/processYield/stateInfoDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  // 边贡
  sjbge: {
    baseInfo: {
      title: '实际边贡额',
      width: 40,
    },
    sortable: true,
  },
  sjbgl: {
    baseInfo: {
      title: '实际边贡率',
      width: 40,
    },
    sortable: true,
  },
  sjclzb: {
    baseInfo: {
      title: '实际材料占比',
      width: 40,
    },
    sortable: true,
  },
  sjrgzb: {
    baseInfo: {
      title: '实际人工占比',
      width: 40,
    },
    sortable: true,
  },
  bzbgl: {
    baseInfo: {
      title: '标准边贡率',
      width: 40,
    },
    sortable: true,
  },
  bgdcl: {
    baseInfo: {
      title: '边贡达成率',
      width: 40,
    },
    sortable: true,
  },
  bgsse: {
    baseInfo: {
      title: '边贡损失额',
      width: 40,
    },
    sortable: true,
  },
  // 人工
  sjmqxlkh: {
    baseInfo: {
      title: '实际模切效率',
      width: 40,
    },
    sortable: true,
  },
  bzmqxlkh: {
    baseInfo: {
      title: '标准模切效率',
      width: 40,
    },
    sortable: true,
  },
  mqxldc: {
    baseInfo: {
      title: '模切效率达成',
      width: 40,
    },
    sortable: true,
  },
  sjsgxlkh: {
    baseInfo: {
      title: '实际手工效率',
      width: 40,
    },
    sortable: true,
  },
  bzsgxlkh: {
    baseInfo: {
      title: '标准手工效率',
      width: 40,
    },
    sortable: true,
  },
  sgxldc: {
    baseInfo: {
      title: '手工效率达成',
      width: 40,
    },
    sortable: true,
  },
  rgzbgap: {
    baseInfo: {
      title: '人工占比Gap',
      width: 40,
    },
    sortable: true,
  },
  sgzbgap: {
    baseInfo: {
      title: '手工占比Gap',
      width: 40,
    },
    sortable: true,
  },
  mqzbgap: {
    baseInfo: {
      title: '模切占比Gap',
      width: 40,
    },
    sortable: true,
  },
  bzrgzb: {
    baseInfo: {
      title: '标准人工占比',
      width: 40,
    },
    sortable: true,
  },
  rgsse: {
    baseInfo: {
      title: '人工损失额',
      width: 40,
    },
    sortable: true,
  },
  shlgap: {
    baseInfo: {
      title: '损耗率GAP',
      width: 40,
    },
    sortable: true,
  },
  clzbgap: {
    baseInfo: {
      title: '占比GAP',
      width: 40,
    },
    sortable: true,
  },
  // 材料损耗
  sjshl: {
    baseInfo: {
      title: '实际损耗率',
      width: 40,
    },
    sortable: true,
  },
  bzshl: {
    baseInfo: {
      title: '标准损耗率',
      width: 40,
    },
    sortable: true,
  },
  shsse: {
    baseInfo: {
      title: '损耗超损额',
      width: 40,
    },
    sortable: true,
  },
  bzclzb: {
    baseInfo: {
      title: '标准材料占比',
      width: 40,
    },
    sortable: true,
  },
  // 时间稼动率
  Lower30: {
    baseInfo: {
      title: '低于30%计划数',
      width: 20,
    },
    sortable: true,
  },
  // 品质稽核
  FAIYield: {
    baseInfo: {
      title: 'FAI直通率',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/qualityAudit/faiDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  FQCYield: {
    baseInfo: {
      title: 'FQC直通率',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/qualityAudit/fqcDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
        };
      },
    },
    sortable: true,
  },
  LowProblem: {
    baseInfo: {
      title: '低级问题',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/qualityAudit/problemDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
          type: '低级问题',
        };
      },
    },
    sortable: true,
  },
  RegularProblem: {
    baseInfo: {
      title: '常规问题',
      width: 40,
      type: ETableCellSlotType.LINK,
      routePath: '/dashboard/operate/qualityAudit/problemDetail',
      getRouteParams: (searchFormValue, record) => {
        const { OrgCode, Dimension } = record;
        const { timeDimension } = searchFormValue;
        return {
          orgCode: OrgCode,
          date: convertDimensionStrToDate(timeDimension, Dimension),
          type: '常规问题',
        };
      },
    },
    sortable: true,
  },
  // 费用
  zcpcz: {
    baseInfo: {
      title: '入库产值',
      width: 40,
    },
    sortable: true,
  },
  fare: {
    baseInfo: {
      title: '费用管理',
      width: 40,
    },
    sortable: true,
  },
  scrapCost: {
    baseInfo: {
      title: '报废成本',
      width: 40,
    },
    sortable: true,
  },
  deValue: {
    baseInfo: {
      title: '倒扣产值',
      width: 40,
    },
    sortable: true,
  },
  fareZb: {
    baseInfo: {
      title: '费用管理占比',
      width: 40,
    },
    sortable: true,
  },
  scrapCostZb: {
    baseInfo: {
      title: '报废成本占比',
      width: 40,
    },
    sortable: true,
  },
  deValueZb: {
    baseInfo: {
      title: '倒扣产值占比',
      width: 40,
    },
    sortable: true,
  },
  // 产销汇总
  SjChfValue: {
    baseInfo: {
      title: '实际出货值',
      width: 40,
    },
    sortable: true,
  },
  SjCxl: {
    baseInfo: {
      title: '实际产销率',
      // width: 40,
    },
    sortable: true,
  },
  SjCzfValue: {
    baseInfo: {
      title: '实际产值',
      width: 40,
    },
    sortable: true,
  },
  YcChfValue: {
    baseInfo: {
      title: '预测出货值',
      width: 40,
    },
    sortable: true,
  },
  YcCxl: {
    baseInfo: {
      title: '预测产销率',
      width: 40,
    },
    sortable: true,
  },
  YcCzfValue: {
    baseInfo: {
      title: '预测产值',
      width: 40,
    },
    sortable: true,
  },
  lossAmount: {
    baseInfo: {
      title: '损失额',
      width: 40,
    },
    sortable: true,
  },
  lossRate: {
    baseInfo: {
      title: '损耗率',
      width: 40,
    },
    sortable: true,
  },

  currentScore: {
    baseInfo: {
      title: '最终绩效分',
      width: 40,
    },
    sortable: true,
  },
  score: {
    baseInfo: {
      title: '间接分',
      width: 40,
    },
    sortable: true,
  },
  achievedTimes: {
    baseInfo: {
      title: '达成工时',
      width: 40,
    },
    sortable: true,
  },
  oaTime: {
    baseInfo: {
      title: 'OA工时',
      width: 40,
    },
    sortable: true,
  },
  oaZb: {
    baseInfo: {
      title: 'OA工时占比',
      width: 40,
    },
    sortable: true,
  },
  scoreZb: {
    baseInfo: {
      title: '间接分占比',
      width: 40,
    },
    sortable: true,
  },
  groupName: {
    baseInfo: {
      title: '组别',
      width: 40,
    },
    sortable: true,
  },
};

// 根据dataIndex列表获取表头配置
const getColumnsOption = ({ columns = [], searchFormValue }: IGetColumnsOptionsParams) => {
  return columns.map(item => {
    let mergeInfo = item;
    // 这里处理动态的表头配置
    if (item.dataIndex === 'OrgName') {
      const optionItem = ORG_LEVEL_OPTIONS.find(info => {
        let findValue = searchFormValue?.orgLevel || EOrgLevel.SBU;
        // 此处特殊逻辑说明：只有模切bg区分层级等级
        if (searchFormValue?.orgCode !== EOrgCode.MQ) {
          findValue = EOrgLevel.SBU;
        }
        return info.value === findValue;
      });
      mergeInfo = merge(item, {
        baseInfo: {
          title: optionItem?.label,
        },
      });
    }
    return merge(cloneDeep(ALL_COLUMNS_OPTIONS[item.dataIndex as string]) || {}, mergeInfo);
  });
};
// 获取传递额外参数的promise请求
const getPromiseApi = (reqMth: any, query: any) =>
  new Promise((resolve, reject) => {
    reqMth(query)
      .then(res => resolve(res))
      .catch(res => reject(res));
  });
// 获取通用的请求参数
const getCommonParams = (queryParams, searchFormValue) => ({
  ...queryParams,
  ...(searchFormValue.timeDimension !== TimeDimension.DAY ? { period: searchFormValue.period } : {}),
  ...(searchFormValue.orgCode === EOrgCode.MQ ? { orgLevel: searchFormValue.orgLevel } : { orgLevel: EOrgLevel.SBU }),
  orgCode: searchFormValue.orgCode,
});
// 所有页面配置信息
export const PAGE_CONFIG_INFO: {
  [key in EModules]: IPageInfo;
} = {
  // 人力出勤
  [EModules.ATTENDANCE]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getAttendanceRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ dataSource, searchFormValue }) =>
      getColumnsOption({
        dataSource,
        searchFormValue,
        columns: [
          { dataIndex: 'Rank' },
          { dataIndex: 'OrgName' },
          { dataIndex: 'AllCQRate' },
          { dataIndex: 'AllCQNum' },
          { dataIndex: 'AllQQNum' },
          { dataIndex: 'DLCQNum' },
          { dataIndex: 'IDLCQNum' },
          { dataIndex: 'AllZZNum' },
        ],
      }),
  },
  // 开机率
  [EModules.UPTIME]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getMachworkingRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EUptimeRank.ONLINE_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'OnlineRate' }, { dataIndex: 'OnlineNum' }, { dataIndex: 'TotalNum' }],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'WorkingRate' },
              { dataIndex: 'PlatWorkingNum' },
              { dataIndex: 'RotaryWoringNum' },
              { dataIndex: 'OnlineNum' },
            ],
          });
      }
    },
  },
  // 模切达成
  [EModules.MQACHIEVE]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getMqachieveRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EMqAchieveRank.BATCH_ACHIEVE_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'BatchAchieveRate' },
              { dataIndex: 'AchieveBatch' },
              { dataIndex: 'TotalBatch' },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'QtyAchieveRate' }, { dataIndex: 'AchieveQty' }, { dataIndex: 'TotalQty' }],
          });
      }
    },
  },
  // AOI数据
  [EModules.AOIDATA]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getAoidatanewRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EAOIRank.KAIJILV:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'Kaijilv' }],
          });
        case EAOIRank.LIANJILV:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'Lianjilv' }],
          });
        case EAOIRank.CHANPINGJIADONGLV:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'Jitaijiadonglv' }],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'Lianglv' }],
          });
      }
    },
  },
  // 产值
  [EModules.OUTPUTVALUE]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getOutputvalueRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EOutputRank.OUTPUT:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'FValueWan' }],
          });
        case EOutputRank.PER_CAPITA_OUTPUT:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'AvgValue' }],
          });
        case EOutputRank.SHIPMENT:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'FSalesWan' }],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'FSalesValue' }],
          });
      }
    },
  },
  // OEE
  [EModules.OEE]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getOeeDataRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EOEERank.OEE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'Oee' },
              { dataIndex: 'Moqiejiadonglv' },
              { dataIndex: 'Xingnengliyonglv' },
              { dataIndex: 'Moqielianglv' },
            ],
          });
        case EOEERank.TIME_UTILIZATION_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'Moqiejiadonglv',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
        case EOEERank.PERFORMANCE_UTILIZATION:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'Xingnengliyonglv',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'Moqielianglv',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
      }
    },
  },
  // 制程良率
  [EModules.PROCESSYIELD]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getProcessyieldRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EProcessYieldRank.DIE_CUTTING_YIELD:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'MQYield' }, { dataIndex: 'MQGQty' }, { dataIndex: 'MQTotal' }],
          });
        case EProcessYieldRank.AOI_YIELD:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'AOIYield' }, { dataIndex: 'AOIGQty' }, { dataIndex: 'AOITotal' }],
          });
        case EProcessYieldRank.MANUAL_YIELD:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'HandYield' }, { dataIndex: 'HandGQty' }, { dataIndex: 'HandTotal' }],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [{ dataIndex: 'Rank' }, { dataIndex: 'OrgName' }, { dataIndex: 'OrderYield' }, { dataIndex: 'OrderQty' }, { dataIndex: 'OrderGQty' }],
          });
      }
    },
  },
  [EModules.FINANCEECONOMIC]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getFinanceeconomicBgRanking, {
        ...getCommonParams(queryParams, searchFormValue),
        isBian: searchFormValue.isBian,
      }),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EBengonRank.THE_ACTUAL_TRIBUTE_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'sjbgl',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjbge' },
              { dataIndex: 'sjclzb' },
              { dataIndex: 'sjrgzb' },
            ],
          });
        case EBengonRank.THE_ACHIEVEMENT_RATE_OF_BENGON:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              {
                dataIndex: 'OrgName',
                baseInfo: {
                  type: ETableCellSlotType.LINK,
                  routePath: '/dataAnalysis/financial/biangong/groupDimension',
                  getRouteParams: (searchFormValue, record) => {
                    const { OrgCode: orgCode, Dimension } = record;
                    const mapBian = {
                      全部: '',
                      是: '1',
                      否: '0',
                    };
                    const { isBian, timeDimension: dimension, date } = searchFormValue;
                    const { objectToHash, setParams } = useRouteParams();
                    const params = {
                      orgCode,
                      startDim: Dimension,
                      endDim: Dimension,
                      dateRange: [date, date],
                      isBian: mapBian[isBian],
                      dimension,
                    };
                    const paramsId = objectToHash(params);
                    setParams(paramsId, params);
                    return { paramsId };
                  },
                },
              },
              {
                dataIndex: 'bgdcl',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjbgl' },
              { dataIndex: 'bzbgl' },
              { dataIndex: 'bgsse' },
            ],
          });
        case EBengonRank.THE_LOSS_OF_THE_BORDER_TRIBUTE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              {
                dataIndex: 'OrgName',
                baseInfo: {
                  type: ETableCellSlotType.LINK,
                  routePath: '/dashboard/operate/biangongDimension/ranking',
                  getRouteParams: (searchFormValue, record) => {
                    const { OrgCode } = record;
                    const { date, orgLevel, isBian } = searchFormValue;
                    return {
                      orgCode: OrgCode,
                      orgLevel: orgLevel === EOrgLevel.BU ? 'bu' : 'sbu',
                      startDate: date.format('YYYY-MM-DD'),
                      endDate: date.format('YYYY-MM-DD'),
                      isBian,
                    };
                  },
                },
              },
              {
                dataIndex: 'bgsse',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjbgl' },
              { dataIndex: 'bzbgl' },
              { dataIndex: 'bgdcl' },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'sjbge' },
              { dataIndex: 'sjbgl' },
              { dataIndex: 'sjclzb' },
              { dataIndex: 'sjrgzb' },
            ],
          });
      }
    },
  },
  // 人工
  [EModules.ARTIFICIAL]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getFinanceeconomicRgRanking, {
        ...getCommonParams(queryParams, searchFormValue),
        isBian: searchFormValue.isBian,
      }),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EArtificialRank.DIE_CUTTING_EFFICIENCY_ACHIEVEMENT_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'mqxldc',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjmqxlkh' },
              { dataIndex: 'bzmqxlkh' },
              { dataIndex: 'mqzbgap' },
            ],
          });
        case EArtificialRank.ACHIEVEMENT_RATE_OF_MANUAL_EFFICIENCY:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'sgxldc',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjsgxlkh' },
              { dataIndex: 'bzsgxlkh' },
              { dataIndex: 'sgzbgap' },
            ],
          });
        case EArtificialRank.ACTUAL_LABOR_PERCENTAGE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'rgsse',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjrgzb' },
              { dataIndex: 'bzrgzb' },
              { dataIndex: 'rgzbgap' },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'mqxldc',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjmqxlkh' },
              { dataIndex: 'bzmqxlkh' },
            ],
          });
      }
    },
  },
  // 材料损耗
  [EModules.MATERIAL_LOSS]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getFinanceeconomicClshRanking, {
        ...getCommonParams(queryParams, searchFormValue),
        isBian: searchFormValue.isBian,
      }),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case ELostRank.ACTUAL_ATTRITION_RATE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'sjshl',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'bzshl' },
              { dataIndex: 'shsse' },
              { dataIndex: 'sjclzb' },
              { dataIndex: 'bzclzb' },
            ],
          });
        case ELostRank.THE_AMOUNT_OF_LOSS_AND_LOSS:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'shsse',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjshl' },
              { dataIndex: 'bzshl' },
              { dataIndex: 'shlgap' },
              { dataIndex: 'sjclzb' },
              { dataIndex: 'bzclzb' },
              { dataIndex: 'clzbgap' },
            ],
          });
        case ELostRank.ACTUAL_MATERIAL_PERCENTAGE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'sjclzb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'bzshl' },
              { dataIndex: 'sjshl' },
              { dataIndex: 'shsse' },
              { dataIndex: 'bzclzb' },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'mqxldc',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'sjmqxlkh' },
              { dataIndex: 'bzmqxlkh' },
            ],
          });
      }
    },
  },
  // 时间稼动率
  [EModules.TIME_UTILIZATION_RATE]: {
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getUtilizationrateRankingData, {
        ...getCommonParams(queryParams, searchFormValue),
        isContain: searchFormValue.isContain,
      }),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EUtilizationRank.LOWER30:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'Moqiejiadonglv' },
              {
                dataIndex: 'Lower30',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'Lower30' },
              {
                dataIndex: 'Moqiejiadonglv',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
      }
    },
  },
  // 品质稽核
  [EModules.QUALITY_AUDIT]: {
    api: (queryParams, searchFormValue) => getPromiseApi(getQcauditRanking, getCommonParams(queryParams, searchFormValue)),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EQualityAuditRank.FQC:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'FAIYield' },
              {
                dataIndex: 'FQCYield',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'LowProblem' },
              { dataIndex: 'RegularProblem' },
            ],
          });
        case EQualityAuditRank.LOW_QUESTIONS:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'FAIYield' },
              {
                dataIndex: 'FQCYield',
              },
              {
                dataIndex: 'LowProblem',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'RegularProblem' },
            ],
          });
        case EQualityAuditRank.GENERAL_QUESTIONS:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'FAIYield' },
              {
                dataIndex: 'FQCYield',
              },
              { dataIndex: 'LowProblem' },
              {
                dataIndex: 'RegularProblem',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'FAIYield',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'FQCYield' },
              { dataIndex: 'LowProblem' },
              { dataIndex: 'RegularProblem' },
            ],
          });
      }
    },
  },
  // 费用
  [EModules.EXPENSE]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    api: (_, searchFormValue) =>
      getPromiseApi(
        getFaremanageAllocationrank,
        (searchFormValue => {
          const { startDim, endDim } = getSearchFormDateDimByDate(searchFormValue);
          const { orgCode = '' } = searchFormValue;
          const res = {
            ...(orgCode.length > 6 ? { orgLevel: 4 } : {}),
            dimension: searchFormValue.timeDimension,
            startDim,
            endDim,
            orgCode: orgCode === 'MQ' ? '' : orgCode,
          };
          return res;
        })(searchFormValue),
      ),
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      switch (itemName) {
        case EExpenseRank.EXPENSE:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'fare' },
              {
                dataIndex: 'fareZb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'scrapCost' },
              { dataIndex: 'scrapCostZb' },
              { dataIndex: 'deValue' },
              { dataIndex: 'deValueZb' },
            ],
          });
        case EExpenseRank.SCRAP_COSTS:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'fare' },
              {
                dataIndex: 'fareZb',
              },
              { dataIndex: 'scrapCost' },
              {
                dataIndex: 'scrapCostZb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'deValue' },
              { dataIndex: 'deValueZb' },
            ],
          });
        case EExpenseRank.REVERSE_DEDUCTION:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'fare' },
              {
                dataIndex: 'fareZb',
              },
              { dataIndex: 'scrapCost' },
              { dataIndex: 'scrapCostZb' },
              { dataIndex: 'deValue' },
              {
                dataIndex: 'deValueZb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
            ],
          });
        default:
          return getColumnsOption({
            dataSource,
            searchFormValue,
            columns: [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'zcpcz',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'fare' },
              {
                dataIndex: 'fareZb',
              },
              { dataIndex: 'scrapCost' },
              { dataIndex: 'scrapCostZb' },
              { dataIndex: 'deValue' },
              { dataIndex: 'deValueZb' },
            ],
          });
      }
    },
  },
  // 产销汇总
  [EModules.PRODUCTION]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },
    api: (queryParams, searchFormValue) =>
      getPromiseApi(getProductsalesumRanking, {
        ...getCommonParams(queryParams, searchFormValue),
        ...(searchFormValue.timeDimension === TimeDimension.DAY
          ? {
              startDim: searchFormValue.date.format('YYYYMMDD'),
              endDim: searchFormValue.date.format('YYYYMMDD'),
            }
          : {
              startDim: queryParams.condition,
              endDim: queryParams.condition,
            }),
      }),
    getColumnsOptions: ({ dataSource, searchFormValue }) => {
      return getColumnsOption({
        dataSource,
        searchFormValue,
        columns: [
          { dataIndex: 'Rank' },
          { dataIndex: 'OrgName' },
          {
            dataIndex: 'SjCxl',
            baseInfo: {
              type: ETableCellSlotType.RANKING,
            },
          },
        ],
      });
    },
  },
  // 3.8
  [EModules.WORKLOSS38RANK]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.WEEK,
    },

    api: async (queryParams, searchFormValue) => {
      const res = await getPromiseApi(getWorkorderloss38rank, {
        ...getCommonParams(queryParams, searchFormValue),
      });

      res.data =
        res?.data?.map(item => ({
          RankItem: item.RankItem,
          Rlist:
            item.Rlist?.map(subItem => ({
              ...subItem,
              lossRate: subItem.lossRate != null ? `${(subItem.lossRate * 100).toFixed(1)}%` : '',
              lossAmount: subItem.lossAmount != null ? subItem.lossAmount.toFixed(0) * 1 : 0,
            })) || [],
        })) || [];

      return res;
    },
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      return getColumnsOption({
        dataSource,
        searchFormValue,
        columns: [
          { dataIndex: 'Rank' },
          { dataIndex: 'OrgName' },
          {
            dataIndex: 'lossRate',
            baseInfo: {
              type: ETableCellSlotType.RANKING,
            },
          },
          { dataIndex: 'lossAmount' },
        ],
      });
    },
  },
  [EModules.MPF]: {
    defaultSearchFormValue: {
      timeDimension: TimeDimension.MONTH,
    },
    api: async (queryParams, searchFormValue) => {
      const { orgCode, condition: month, types } = getCommonParams(queryParams, searchFormValue);
      const res = await getPromiseApi(performanceranking, {
        orgCode,
        month,
        types,
      });
      return res;
    },
    getColumnsOptions: ({ itemName, dataSource, searchFormValue }) => {
      console.log('🚀 ~ itemName1:', searchFormValue);
      const { types } = searchFormValue;
      let columns =
        itemName === 'OA工时占比'
          ? [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              { dataIndex: 'groupName' },
              {
                dataIndex: 'oaZb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'oaTime' },
              { dataIndex: 'achievedTimes' },
            ]
          : [
              { dataIndex: 'Rank' },
              { dataIndex: 'OrgName' },
              {
                dataIndex: 'scoreZb',
                baseInfo: {
                  type: ETableCellSlotType.RANKING,
                },
              },
              { dataIndex: 'currentScore' },
              { dataIndex: 'score' },
              { dataIndex: 'groupName' },
            ];
      if (types === '1') {
        columns = columns.filter(item => item.dataIndex !== 'groupName');
      }
      return getColumnsOption({
        dataSource,
        searchFormValue,
        columns,
      });
    },
  },
};
