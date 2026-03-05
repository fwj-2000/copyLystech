// 运营指标趋势页 hook 封装
import { provide, ref } from 'vue';
import dayjs from 'dayjs';
import { cloneDeep, flatten, groupBy, isEmpty } from 'lodash-es';
import { useRoute } from 'vue-router';
import { useSearchForm } from '/@/hooks/web/useSearchForm';
import { commonSeriesDataSyle, commonSeriesLineDataSyle, commonYAxis, getCommonTooltipHtmlStr } from '/@/views/dashboard/operate/components/BaseChart/config';

import { TimeDimension, PeriodEnum } from '/@/views/dashboard/operate/types';
import { isFunction } from '/@/utils/is';
import { merge } from 'highcharts';
import XEUtils from 'xe-utils';
import type { EChartsOption } from 'echarts';

export interface ChartQuotaInfo {
  type?: IChartType; // 图表类型
  quotaKey: string; // 后台对应指标的字段名
  subTitle: string; // 图表的副标题（例：BG-${ subTitle}
  suffix?: string; // 指标的单位后缀，默认'%'
  pathInfo?: {
    path?: string; // 趋势页路由
    infoPath?: string; // 详情页路由
  };
}

export interface SingleChartQuotaInfo {
  keys?: {
    key: string;
    title: string;
  }[];
  subTitle: string; // 图表的副标题（例：BG-${subTitle}
  suffix?: string; // 指标的单位后缀，默认'%'
  pathInfo?: {
    path?: string; // 趋势页路由
    infoPath?: string; // 详情页路由
  };
}

export enum IChartType {
  NORMAL = 'normal',
  UPTIME = 'uptime',
}

interface HookParams {
  pathInfo?: {
    path?: string; // 趋势页路由
    infoPath?: string; // 详情页路由
  };
  isSpecailSyncSign?: boolean; // 是否 特殊处理单厂单图表指标配置
  defaultSearchFormValue?: Record<string, any>;
  chartQuotaInfoList: ChartQuotaInfo[]; // 字段key值信息
  singleChartQuotaInfoList?: SingleChartQuotaInfo[]; // 字段key值信息
  getChartQuotaInfoList?: (queryParams: any) => any[]; // 字段key值信息
  getSingleChartQuotaInfoList?: (queryParams: any) => any[]; // 字段key值信息
  getParams?: (searchFormValue, queryParams) => {};
  requestMth: (queryParams: any) => Promise<any>;
  afterMth?: (res: any) => void;
  getChartInfoMth?: (params: any) => any;
  getRouteParams?: (searchFormValue, dimension) => {};
  getPathUrl?: (searchFormValue) => string; // 动态获取趋势页跳转url
  formatData?: (data) => any;
  getFullParams?: (searchFormValue) => {};
  formatValue?: (data) => any; // 格式化值
}
export function useTrendPage(params: HookParams) {
  const route = useRoute();

  const defaultGetParams = () => ({});
  const {
    requestMth,
    afterMth,
    getChartInfoMth,
    getParams = defaultGetParams,
    getRouteParams = () => ({}),
    formatData = data => data,
    formatValue = ({ value }) => value,
    defaultSearchFormValue = {},
    isSpecailSyncSign = false,
  } = params;
  const chartInfoList: any = ref([]);
  const { query: routeQuery } = route;
  const routeTimeDimension = (routeQuery?.dimension || TimeDimension.DAY) as TimeDimension;
  const routeEndDate = dayjs((routeQuery?.date as string) || new Date()).tz();
  const routeStartDate = routeQuery?.startDate
    ? dayjs(routeQuery?.startDate as string).tz() || new Date()
    : routeEndDate.subtract(6, routeTimeDimension as any);

  // 从路由和默认传参确定初始参数
  const getDefaultSearchFormValue = () => {
    return Object.keys(defaultSearchFormValue).reduce((pre, cur) => {
      return {
        ...pre,
        [cur]: routeQuery[cur] || defaultSearchFormValue[cur],
      };
    }, {});
  };

  provide('getSearchFormValue', () => {
    return searchFormValue;
  });

  // 获取页面的数据
  const setPageDataMth = async (queryParams, searchFormValue) => {
    chartInfoList.value = [];
    let apiParams = {
      ...queryParams,
      orgCode: searchFormValue.orgCode,
      period: searchFormValue.period,
      ...getParams(searchFormValue, queryParams),
    };
    if (isFunction(params?.getFullParams)) {
      apiParams = params?.getFullParams(searchFormValue);
    }
    return new Promise((resolve, reject) => {
      requestMth(apiParams)
        .then(res => {
          const { data } = res;
          let list = data;
          if (data.list) {
            list = data.list;
          }
          resolve(res);
          if (isEmpty(list)) return;
          const orgCodeInfo = groupBy(formatData(list), item => item.OrgCode);
          const BUInfo = Object.keys(orgCodeInfo).reduce(
            (pre: { parent: any[]; children: any[] }, cur: string) => {
              if (cur === (searchFormValue.orgCode || routeQuery.orgCode)) {
                pre.parent = orgCodeInfo[cur];
              } else {
                pre.children.push(orgCodeInfo[cur]);
              }
              return pre;
            },
            {
              parent: [],
              children: [],
            },
          );
          console.log('BUInfo: ', BUInfo);
          // 如果没有子项 则是同一项
          if (BUInfo.children.length === 0) {
            BUInfo.children.push(BUInfo.parent);
            // 单厂特殊图表
            const singleChartQuotaInfoList = params?.getSingleChartQuotaInfoList?.(searchFormValue.orgCode) ?? params?.singleChartQuotaInfoList ?? [];
            if (!isEmpty(singleChartQuotaInfoList)) {
              chartInfoList.value = singleChartQuotaInfoList.map(item => {
                return {
                  ...item,
                  info: isSpecailSyncSign ? getSpecialSingleChartInfo({ BUInfo, item }) : getSingleChartInfo({ BUInfo, item }),
                };
              });
              console.log('chartInfoList: ', chartInfoList);
              return;
            }
          }
          const chartQuotaInfoList = params?.getChartQuotaInfoList?.(searchFormValue.orgCode) ?? params?.chartQuotaInfoList ?? [];
          chartInfoList.value = chartQuotaInfoList.map(item =>
            merge(cloneDeep(item), {
              info: getChartInfo({ BUInfo, ...item }),
            }),
          );
          if (afterMth && isFunction(afterMth)) {
            afterMth(res);
          }
        })
        .catch(error_ => {
          console.error(error_);
          reject(error_);
        });
    });
  };

  const getXAxisLable = item => {
    return item.Dimension || item.KQDimension || item.dimension || item.TimeDate;
  };

  const getSpecialSingleChartInfo = ({ BUInfo, item }) => {
    let { subTitle = '', keys = [], suffix = '%', lineKeys = [], yAxis = [] } = item;

    // 获取唯一的 X 轴标签（例如：["2025-07", "2025-08", ..., "2026-01"]）
    // 注意：这里要确保 xAxisData 是按时间顺序排好序的
    const xAxisData = [...new Set(BUInfo.parent.map(item => getXAxisLable(item)))].sort();

    const title = BUInfo.parent[0].OrgName.replace('模切', '');

    // --- 关键修改：传入 xAxisData ---
    const targetKey = lineKeys[0]?.key || 'oaZb';
    let transferData = transformData(BUInfo.children[0], xAxisData, targetKey);
    // ---------------------------

    transferData = transferData.map(seriesItem => {
      return merge(cloneDeep(commonSeriesLineDataSyle), {
        ...seriesItem,
        connectNulls: true, // 如果中间月份没数据，线段会连起来
      });
    });
    const baseInfo: EChartsOption = {
      title,
      subTitle: subTitle,
      itemTitle: `${title}-${subTitle}`,
      ...(params.pathInfo || {}),
      ...(params?.getPathUrl ? { path: params?.getPathUrl(searchFormValue) } : {}),
      options: {
        // legend: [
        //   // 线条
        //   {
        //     show: false,
        //     orient: 'horizontal',
        //     left: 0,
        //     top: 0,
        //     selected: lineKeys.reduce((pre, cur) => {
        //       return {
        //         ...pre,
        //         [cur.title]: cur?.legendSelected !== undefined ? cur.legendSelected : true,
        //       };
        //     }, {}),
        //     itemWidth: 20,
        //     itemHeight: 4,
        //     borderRadius: 0,
        //   },
        // ],
        tooltip: {
          appendTo: 'body',
          formatter: params => getCommonTooltipHtmlStr({ params, suffix: '%', showHead: false }),
        },
        xAxis: [{ data: xAxisData }],
        yAxis: isEmpty(yAxis)
          ? {
              ...commonYAxis,
              name: '',
              axisLabel: { show: true },
            }
          : yAxis,
        series: transferData,
      },
    };

    console.log('baseInfo: ', baseInfo);
    return baseInfo;
  };
  // 获取单厂合并的图表数据
  const getSingleChartInfo = ({ BUInfo, item }) => {
    const { subTitle = '', keys = [], suffix = '%', lineKeys = [], showKeysLengend = false, yAxis = [] } = item;
    const xAxisData = BUInfo.parent.map(item => getXAxisLable(item));
    const title = BUInfo.parent[0].OrgName.replace('模切', '');

    const lineLegendData = lineKeys.map(item => item.title);

    const baseInfo = {
      title,
      subTitle: subTitle,
      itemTitle: `${title}-${subTitle}`,
      ...(params.pathInfo || {}),
      ...(params?.getPathUrl ? { path: params?.getPathUrl(searchFormValue) } : {}),
      options: {
        legend: [
          // 方块
          ...(showKeysLengend
            ? [
                {
                  show: true,
                  orient: 'horizontal',
                  data: keys.map(item => ({
                    name: item.title,
                    itemStyle: {
                      color: item.color,
                    },
                  })),
                  left: 0,
                  top: 0,
                  itemWidth: 8,
                  itemHeight: 8,
                  borderRadius: 0,
                },
              ]
            : []),
          // 线条
          {
            show: true,
            orient: 'horizontal',
            data: lineLegendData.map(title => ({ name: title })),
            left: keys.reduce((pre, cur) => {
              return pre + cur.title.length * 16 + 6;
            }, 0),
            top: 0,
            selected: lineKeys.reduce((pre, cur) => {
              return {
                ...pre,
                [cur.title]: cur?.legendSelected === undefined ? true : cur.legendSelected,
              };
            }, {}),
            itemWidth: 20,
            itemHeight: 4,
            borderRadius: 0,
          },
        ],
        tooltip: {
          appendTo: 'body',
          formatter: params => getCommonTooltipHtmlStr({ params, suffix, showHead: false }),
        },
        xAxis: [
          {
            data: xAxisData,
          },
        ],
        yAxis: isEmpty(yAxis)
          ? {
              ...commonYAxis,
              name: '',
              axisLabel: { show: true },
            }
          : yAxis,
        series: [
          // 柱子
          ...keys.map(item => {
            return {
              ...commonSeriesDataSyle.normal,
              yAxisIndex: item.yAxisIndex || 0,
              name: showKeysLengend ? item.title : '',
              label: {
                show: true,
                formatter: `{c}${item.suffix || '%'}`,
              },
              data: xAxisData.map(dimension => {
                const { key } = item;
                const child = BUInfo.children[0].find(item => getXAxisLable(item) === dimension);
                if (!child) return {};
                const value = Number.parseFloat(child[key] || 0);
                const { suffix = '%' } = item;
                return {
                  value: formatValue({ value, orgCode: child.OrgCode }),
                  routeParams: getRouteParams(searchFormValue, dimension),
                  suffix: item.suffix || '%',
                  orgCode: child.OrgCode,
                  ...(item.color
                    ? {
                        itemStyle: {
                          borderRadius: value > 0 ? [50, 50, 0, 0] : [0, 0, 50, 50],
                          color: item.color, // 数据点的颜色
                        },
                      }
                    : {}),
                  label: {
                    position: value > 0 ? 'top' : 'bottom',
                    ...(suffix.includes('元') || suffix.includes('万')
                      ? {
                          formatter: ({ value }) => `${XEUtils.commafy(value * 1, { digits: 1 })}${suffix}`,
                        }
                      : { formatter: `{c}${suffix}` }),
                  },
                };
              }),
            };
          }),
          // 线条
          ...lineKeys.map(item => {
            return merge(cloneDeep(commonSeriesLineDataSyle), {
              name: item.title,
              yAxisIndex: item.yAxisIndex || 0,
              ...(item.position
                ? {
                    label: {
                      position: item.position,
                      // color: item.color,
                      formatter: `{c}${item.suffix || '%'}`,
                    },
                  }
                : {
                    label: {
                      // color: item.color,
                      formatter: `{c}${item.suffix || '%'}`,
                    },
                  }),
              ...(item.color
                ? {
                    lineStyle: {
                      color: item.color,
                    },
                    itemStyle: {
                      color: item.color, // 数据点的颜色
                    },
                  }
                : {}),
              data: xAxisData.map(dimension => {
                const { key } = item;
                const child = BUInfo.children[0].find(item => getXAxisLable(item) === dimension);
                if (!child) return {};
                return {
                  suffix: item.suffix || '%',
                  value: formatValue({ value: Number.parseFloat(child[key] || 0).toFixed(1), orgCode: child.OrgCode }),
                  orgCode: child.OrgCode,
                  routeParams: getRouteParams(searchFormValue, dimension),
                };
              }),
            });
          }),
        ],
      },
    };

    console.log('baseInfo: ', baseInfo);
    return baseInfo;
  };

  // 获取图表数据
  const getChartInfo = ({ BUInfo, quotaKey, suffix = '%', subTitle = '', type = 'normal', pathInfo = {} }) => {
    const xAxisData = BUInfo.parent.map(item => getXAxisLable(item));
    const title = BUInfo.parent[0].OrgName.replace('模切', '');
    const parentOrgCode = BUInfo.parent[0].OrgCode;
    const legendData = BUInfo.children.map(item => item[0].OrgName);
    const rateData = BUInfo.parent.map(item => ({
      value: formatValue({ value: Number.parseFloat(item[quotaKey] || 0).toFixed(1), orgCode: parentOrgCode }),
      orgCode: item.OrgCode,
    }));
    const baseInfo = {
      title,
      subTitle,
      ...(params.pathInfo || {}),
      ...pathInfo,
      ...(params?.getPathUrl ? { path: params?.getPathUrl(searchFormValue) } : {}),
      itemTitle: `${title}-${subTitle}`,
      options: {
        legend: [
          {
            show: true,
            orient: 'horizontal',
            data: [{ name: `${subTitle}` }],
            left: '0',
            top: '0',
            itemWidth: 20,
            itemHeight: 4,
            borderRadius: 0,
          },
          {
            show: true,
            orient: 'horizontal',
            data: legendData,
            left: subTitle.length * 16 + 24,
            top: '0',
            itemWidth: 8,
            itemHeight: 8,
            borderRadius: 0,
          },
        ],
        tooltip: {
          formatter: params => getCommonTooltipHtmlStr({ params, suffix, showHead: false }),
        },
        xAxis: [{ data: xAxisData }],
        yAxis: {
          name: '',
          axisLabel: { show: true },
        },
        series: [
          merge(cloneDeep(commonSeriesLineDataSyle), {
            name: `${subTitle}`,
            data: rateData,
            dimensions: legendData,
            label: {
              // formatter: `{c}${suffix}`,
              ...(suffix.includes('元') || suffix.includes('万')
                ? {
                    formatter: ({ value }) => `${XEUtils.commafy(value * 1, { digits: 1 })}${suffix}`,
                  }
                : { formatter: `{c}${suffix}` }),
            },
          }),
          ...flatten(
            BUInfo.children.map(item => {
              return [
                {
                  name: item[0].OrgName,
                  stack: item[0].OrgCode,
                  data: xAxisData.map(dimension => {
                    const child = item.find(item => getXAxisLable(item) === dimension);
                    if (!child) return {};
                    return {
                      value: formatValue({ value: Number.parseFloat(child[quotaKey] || 0).toFixed(1), orgCode: parentOrgCode }),
                      orgCode: child.OrgCode,
                      routeParams: getRouteParams(searchFormValue, dimension),
                    };
                  }),
                  ...commonSeriesDataSyle.normal,
                },
              ];
            }),
          ),
        ],
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     show: true,
        //     xAxisIndex: [0],
        //     // start: 0,
        //     // end: 100,
        //   },
        // ],
      },
    };
    if (getChartInfoMth && isFunction(getChartInfoMth)) {
      return merge(
        baseInfo,
        getChartInfoMth({
          BUInfo,
          quotaKey,
          suffix,
          subTitle,
          type,
        }),
      );
    }
    return baseInfo;
  };

  // 使用维度搜索hooks
  const { loading, searchFormValue, isRequestError, isEmptyData, getTrendQueryParams } = useSearchForm({
    defaultDate: routeEndDate,
    isTrendData: true,
    isRangePicker: true,
    showPeriodDimension: true,
    defaultSearchFormValue: {
      ...routeQuery,
      date: routeEndDate,
      period: PeriodEnum.ALL,
      timeDimension: routeTimeDimension,
      orgCode: routeQuery.orgCode as string,
      dateRange: [routeStartDate, routeEndDate],
      ...getDefaultSearchFormValue(),
    },
    searchReqMth: setPageDataMth,
  });

  // 转换逻辑
  function transformData(data, xAxisData, targetField = 'oaZb') {
    const map = {};

    // 1. 遍历所有原始数据
    data.forEach(item => {
      const groupName = item.groupName;
      const dimension = getXAxisLable(item); // 获取当前条数据的月份

      // 2. 如果 map 中没有这个组，初始化一个长度等于 x 轴、全为 null 的数组
      if (!map[groupName]) {
        map[groupName] = {
          name: groupName,
          data: new Array(xAxisData.length).fill(null),
        };
      }

      // 3. 找到当前月份在 X 轴数组中的索引位置
      const index = xAxisData.indexOf(dimension);

      // 4. 如果找到了索引，则在对应位置插入数据
      if (index !== -1) {
        const rawValue = item[targetField] || '0';
        // 处理百分数转数字
        const oaValue = typeof rawValue === 'string' ? Number.parseFloat(rawValue.replace('%', '')) : rawValue;
        map[groupName].data[index] = Math.round(oaValue * 100) / 100;
      }
    });

    // 5. 转换为数组返回
    return Object.values(map);
  }

  return { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData, getTrendQueryParams, getChartInfo };
}
