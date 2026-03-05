<!-- 出勤率趋势页 -->
<template>
  <div class="dashboard-page-container">
    <!-- 表单筛选条件 -->
    <div class="dashboard-search-compo-header">
      <SearchForm
        v-bind="{
          searchFormValue,
          isRangePicker: true,
          showPeriodDimension: true,
          showOrganizeTreeSelect: true,
        }">
      </SearchForm>
    </div>
    <!-- 内容加载封装组件 -->
    <div class="dashboard-content-container">
      <SpinContent
        v-bind="{
          loading: loading,
          isEmptyData,
          isRequestError,
          showList: false,
        }">
        <a-row :gutter="[12, 12]" class="group-container">
          <!-- 所有图表 -->
          <a-col v-for="(chart, idx) in chartInfoList" :key="idx" :xs="24" :xl="24">
            <BaseChart :info="chart.info"></BaseChart>
          </a-col>
          <!-- DL图表 -->
          <a-col :xs="24" :xl="24">
            <DLChart :info="DLInfo"></DLChart>
          </a-col>
          <!-- IDL图表 -->
          <a-col :xs="24" :xl="24">
            <IDLChart :info="IDLInfo"></IDLChart>
          </a-col>
          <!-- 在职人员 -->
          <a-col :xs="24" :xl="24">
            <IncumbentsChart :info="ZZInfo"></IncumbentsChart>
          </a-col>
        </a-row>
      </SpinContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DLChart from './DLChart/index.vue';
  import IDLChart from './IDLChart/index.vue';
  import IncumbentsChart from './IncumbentsChart/index.vue';
  import { SearchForm } from '/@/views/dashboard/operate/components/SearchForm/index';
  import { SpinContent } from '/@/views/dashboard/operate/components/styleItem/index';

  import { ref } from 'vue';
  import { getAttendanceTrenddata } from '/@/api/dashbord/operate';
  import { groupBy, isEmpty } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import BaseChart from '/@/views/dashboard/operate/components/BaseChart/index.vue';
  import { useTrendPage, ChartQuotaInfo } from '/@/views/dashboard/operate/hooks/useTrendPage';

  defineOptions({ name: 'dashboard-operate-attendanceRate-detail' });

  const { t } = useI18n();
  // 图表指标配置
  const chartQuotaInfoList: ChartQuotaInfo[] = [
    {
      quotaKey: 'AllZZNum',
      subTitle: t('views.dashboard.operate.attendanceRate.AllZZ'),
      suffix: '人',
    },
    {
      quotaKey: 'AllCQRate',
      subTitle: t('views.dashboard.operate.attendanceRate.title'),
    },
  ];

  const DLInfo = ref<any>({});
  const IDLInfo = ref<any>({});
  const ZZInfo = ref<any>({});

  const setPageDataMth = res => {
    const {
      data: { list },
    } = res;
    if (isEmpty(list)) return;
    const orgCodeInfo = groupBy(list, item => item.OrgCode);
    const BUInfo = Object.keys(orgCodeInfo).reduce(
      (pre: { parent: any[]; children: any[] }, cur: string) => {
        if (cur === searchFormValue.orgCode) {
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
    // 如果没有子项 则是同一项
    if (BUInfo.children.length === 0) {
      BUInfo.children.push(BUInfo.parent);
    }
    // 赋值
    setDLInfo(BUInfo);
    setIDLInfo(BUInfo);
    setZZInfo(BUInfo);
  };

  const getSum = child => {
    const sum = child.DLZhengshiCQNum + child.DLZhengshiQQNum + child.DLPaiqianCQNum + child.DLPaiqianQQNum + child.DLLinshiCQNum + child.DLLinshiQQNum;
    return sum;
  };

  // 设置 DL 出勤率图表数据
  const setDLInfo = BUInfo => {
    const info = {
      legendData: BUInfo.children.map(item => item[0].OrgName),
      xAxisData: BUInfo.parent.map(item => item.KQDimension),
      rateData: BUInfo.parent.map(item => parseFloat(item.DLCQRate)), // 出勤率
      seriesData: BUInfo.children.map(item => {
        return [
          {
            type: 'bar',
            name: 'DL1',
            stack: item[0].OrgCode,
            showBackground: true,
            backgroundStyle: {
              color: 'none',
              borderWidth: 1,
              borderRadius: [50, 50, 0, 0],
              borderColor: '#4bb7ff',
            },
            data: item.map(child => ({
              value: ((child.DL1CQNum / (child.DL1ZZNum + child.DL2ZZNum)) * 100).toFixed(2),
              cq: child.DL1CQNum,
              zz: child.DL1ZZNum,
              qq: child.DL1ZZNum - child.DL1CQNum,
            })),
          },
          {
            type: 'bar',
            name: 'DL2',
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: ((child.DL2CQNum / (child.DL1ZZNum + child.DL2ZZNum)) * 100).toFixed(2),
              cq: child.DL2CQNum,
              zz: child.DL2ZZNum,
              qq: child.DL2ZZNum - child.DL2CQNum,
            })),
          },
          {
            type: 'bar',
            name: '缺勤',
            stack: item[0].OrgCode,
            itemStyle: {
              color: 'none',
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.0)',
            },
            data: item.map(child => ({
              value: ((child.DLQQNum / (child.DLCQNum + child.DLQQNum)) * 100).toFixed(2),
              cq: child.DLQQNum,
            })),
          },
        ];
      }),
    };
    DLInfo.value = info;
  };
  // 设置 IDL 出勤率图表数据
  const setIDLInfo = BUInfo => {
    const info = {
      legendData: BUInfo.children.map(item => item[0].OrgName),
      xAxisData: BUInfo.parent.map(item => item.KQDimension),
      rateData: BUInfo.parent.map(item => parseFloat(item.IDLCQRate)), // 出勤率
      seriesData: BUInfo.children.map(item => {
        return [
          {
            type: 'bar',
            name: 'IDL1',
            stack: item[0].OrgCode,
            showBackground: true,
            backgroundStyle: {
              color: 'none',
              borderWidth: 1,
              borderRadius: [50, 50, 0, 0],
              borderColor: '#4bb7ff',
            },
            data: item.map(child => ({
              value: ((child.IDL1CQNum / (child.IDL1ZZNum + child.IDL2ZZNum + child.IDL3ZZNum)) * 100).toFixed(2),
              cq: child.IDL1CQNum,
              qq: child.IDL1ZZNum - child.IDL1CQNum,
            })),
          },
          {
            type: 'bar',
            name: 'IDL2',
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: ((child.IDL2CQNum / (child.IDL1ZZNum + child.IDL2ZZNum + child.IDL3ZZNum)) * 100).toFixed(2),
              cq: child.IDL2CQNum,
              qq: child.IDL2ZZNum - child.IDL2CQNum,
            })),
          },
          {
            type: 'bar',
            name: 'IDL3',
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: child.IDL3ZZNum !== 0 ? ((child.IDL3CQNum / (child.IDL1ZZNum + child.IDL2ZZNum + child.IDL3ZZNum)) * 100).toFixed(2) : 0,
              cq: child.IDL3CQNum,
              qq: child.IDL3ZZNum - child.IDL3CQNum,
            })),
          },
        ];
      }),
    };
    IDLInfo.value = info;
  };
  // 设置在职人员图表数据
  const setZZInfo = BUInfo => {
    const legendData = BUInfo.children.map(item => item[0].OrgName);
    const rateData = BUInfo.parent.map(item => parseFloat(item.DLCQRate)); // 出勤率
    const info = {
      xAxisData: BUInfo.parent.map(item => item.KQDimension),
      rateData,
      seriesData: BUInfo.children.map(item => {
        return [
          {
            type: 'bar',
            name: '正式工',
            dimensions: legendData,
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: ((child.DLZhengshiCQNum / getSum(child)) * 100).toFixed(2),
              cq: child.DLZhengshiCQNum,
              qq: child.DLZhengshiQQNum,
            })),
            label: {
              show: false, // 显示柱状图顶部的百分比标签
            },
            showBackground: true,
            backgroundStyle: {
              color: 'none',
              borderWidth: 1,
              borderColor: '#DBDBDB',
              borderRadius: [50, 50, 0, 0],
            },
            itemStyle: {
              color: '#4474e5',
            },
          },
          {
            type: 'bar',
            name: '缺勤',
            stack: item[0].OrgCode,
            data: item.map(child => ((child.DLZhengshiQQNum / getSum(child)) * 100).toFixed(2)),
            itemStyle: {
              color: '#fff',
            },
          },
          {
            type: 'bar',
            name: '派遣工',
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: ((child.DLPaiqianCQNum / getSum(child)) * 100).toFixed(2),
              cq: child.DLPaiqianCQNum,
              qq: child.DLPaiqianQQNum,
            })),
            itemStyle: {
              color: '#72ddca',
            },
          },
          {
            type: 'bar',
            name: '缺勤',
            stack: item[0].OrgCode,
            data: item.map(child => ((child.DLPaiqianQQNum / getSum(child)) * 100).toFixed(2)),
            itemStyle: {
              color: '#fff',
            },
          },
          {
            type: 'bar',
            name: '临时工',
            stack: item[0].OrgCode,
            data: item.map(child => ({
              value: ((child.DLLinshiCQNum / getSum(child)) * 100).toFixed(2),
              cq: child.DLLinshiCQNum,
              qq: child.DLLinshiQQNum,
            })),
            itemStyle: {
              color: '#f0c871',
            },
          },
          {
            type: 'bar',
            name: '缺勤',
            stack: item[0].OrgCode,
            data: item.map(child => ((child.DLLinshiQQNum / getSum(child)) * 100).toFixed(2)),
            itemStyle: {
              color: '#fff',
              borderRadius: [50, 50, 0, 0],
            },
          },
        ];
      }),
    };
    ZZInfo.value = info;
  };

  // 使用趋势页hook
  const { searchFormValue, chartInfoList, loading, isRequestError, isEmptyData } = useTrendPage({
    pathInfo: {
      path: '/dashboard/operate/attendanceRate/detail', // 趋势页路由
      infoPath: '/dashboard/operate/attendanceRate/personnelDetail', // 详情页路由
    },
    chartQuotaInfoList,
    requestMth: getAttendanceTrenddata,
    afterMth: setPageDataMth,
  });
</script>

<style lang="less" scoped>
  @import url('../../../../../design/dashboard.less');
</style>

<style lang="less">
  .uptime-tooltips {
    .content-container {
      width: 100%;
      height: 100%;

      .head-container {
        width: 100%;
        color: #1a1a1a;
      }

      .item-container {
        width: 182px;
        padding: 10px 12px;
        background: #f2f2f2;
        margin-bottom: 12px;

        &:last-child {
          margin: 0;
        }

        .item {
          &.style1 {
            color: '#1a1a1a';
          }

          &.style2 {
            color: '#666';
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
