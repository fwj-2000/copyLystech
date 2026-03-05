import { getAttendancePercapitaranking } from '/@/api/dashbord/ranking';
import { cloneDeep, merge } from 'lodash-es';

import { EOrgCode, TimeDimension } from '/@/views/dashboard/operate/types';
import { EOrgLevel } from '/@/views/dashboard/operate/ranking/type';
import { IColumnsOption, IGetColumnsOptionParams } from './type';
import dayjs from 'dayjs';

// 排行等级配置
export const ORG_LEVEL_OPTIONS = [
  { label: 'SBU', value: EOrgLevel.SBU },
  { label: 'BU', value: EOrgLevel.BU },
];

// 通用的表格头配置
const ALL_COLUMNS_OPTIONS: { [key: string]: IColumnsOption } = {
  OrgName: { baseInfo: { title: '厂区' } },
  AvgChanzhi: {
    baseInfo: {
      title: '人均产值(万元)',
    },
    sortable: true,
  },
  IdlAvgChanzhi: { baseInfo: { title: '人均IDL产值(万元)' }, sortable: true },
  DlAvgChanzhi: { baseInfo: { title: '人均DL产值(万元)' }, sortable: true },
  Dl1AvgChanzhi: { baseInfo: { title: '人均DL1产值(万元)' }, sortable: true },
  Dl2AvgChanzhi: { baseInfo: { title: '人均DL2产值(万元)' }, sortable: true },
  ShougongAvgChanzhi: { baseInfo: { title: '人均手工产值(万元)' }, sortable: true },
  MoqieAvgChanzhi: { baseInfo: { title: '人均模切产值(万元)' }, sortable: true },
  AvgMoqieKaixian: { baseInfo: { title: '人均开线数' }, sortable: true },
  AvgPbKaixian: { baseInfo: { title: '人均平板开线数' }, sortable: true },
  AvgYdKaixian: { baseInfo: { title: '人均圆刀开线数' }, sortable: true },
  TimeDate: { baseInfo: { title: '时间' }, sortable: true },
};

// 根据dataIndex列表获取表头配置
const getColumnsOption = ({ columns = [], searchFormValue }: IGetColumnsOptionParams) => {
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
const getCommonParams = (queryParams, searchFormValue) => {
  function formatDate(date) {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
  }

  return {
    ...(searchFormValue.orgCode === EOrgCode.MQ ? { orgLevel: searchFormValue.orgLevel } : { orgLevel: EOrgLevel.SBU }),
    orgCode: searchFormValue.orgCode,
    dimension: queryParams.dimension,
    startTime: queryParams.dimension === TimeDimension.DAY ? formatDate(queryParams.condition) : queryParams.condition,
    endTime: queryParams.dimension === TimeDimension.DAY ? formatDate(queryParams.condition) : queryParams.condition,
  };
};

// 所有页面配置信息
export const PAGE_CONFIG_INFO = {
  defaultSearchFormValue: {
    timeDimension: TimeDimension.MONTH,
  },
  api: (queryParams, searchFormValue) => getPromiseApi(getAttendancePercapitaranking, getCommonParams(queryParams, searchFormValue)),
  /**
   * @param { boolean } isKaixian 是否是`人均开线数`的排名列表
   */
  getColumnsOptions: ({ dataSource, searchFormValue, isKaixian }) =>
    getColumnsOption({
      dataSource,
      searchFormValue,
      columns: [
        { dataIndex: 'OrgName', title: '厂区' },
        ...(isKaixian
          ? [{ dataIndex: 'AvgMoqieKaixian' }, { dataIndex: 'AvgPbKaixian' }, { dataIndex: 'AvgYdKaixian' }]
          : [
              { dataIndex: 'AvgChanzhi' },
              { dataIndex: 'IdlAvgChanzhi' },
              { dataIndex: 'DlAvgChanzhi' },
              { dataIndex: 'Dl1AvgChanzhi' },
              { dataIndex: 'Dl2AvgChanzhi' },
              { dataIndex: 'ShougongAvgChanzhi' },
              { dataIndex: 'MoqieAvgChanzhi' },
            ]),
      ],
    }),
};
