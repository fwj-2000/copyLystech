<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-[20px]">
        <div class="title-date-change">
          <Subtitle :title="t('routes.qms-report-abnormalReport')" class="mr-[12px]"></Subtitle>
          <DateChange @dateChange="dateChange" />
          <a-range-picker v-model:value="time" :allowClear="false" @change="dataRangeChange" />
          <ApiSelect
            class="w-[180px] ml-20px"
            :api="ListByUserfactory"
            placeholder="请选择厂区"
            v-model:value="state.factoryArea"
            :show-search="true"
            :filter-option="
              (inputValue, path) => {
                return [path].some(option => option.label.includes(inputValue));
              }
            "
            result-field="data"
            label-field="Name"
            value-field="Code"
            key="Code"
            :not-found-content="null"
            :immediate="true"
            @change="getData">
          </ApiSelect>
        </div>

        <div class="card-box">
          <div class="card-box-title">
            <Subtitle :title="t('routes.week-abnormal-chart')"></Subtitle>
            <div class="title-view">
              <view class="view-item"
                >{{ t('dict.UnprocessedQuantity') }}：<span class="view-num">{{ dashboardData.pendingAllCount }}</span></view
              >
              <view class="view-item"
                >{{ t('dict.ProcessedQuantity') }}：<span class="view-num">{{ dashboardData.completedAllCount }}</span></view
              >
              <view class="view-item"
                >{{ t('dict.ClosureRate') }}：<span class="view-num"> {{ Decimal(dashboardData.closedPercent).times(Decimal(100)) }}%</span></view
              >
            </div>
          </div>
          <div class="echarts-box flex pt-[20px] pb-[20px]">
            <!-- 堆叠柱状图 -->
            <div class="w-[50%]">
              <div class="text-14px font-bold ml-[12px]">{{ t('dict.AnomaliesNumber') }}</div>
              <Chart :options="stackOptions" height="100%" style="height: 220px; width: 100%" />
            </div>
            <!-- 饼图 -->
            <!-- <div class="w-[50%]">
              <div class="text-14px font-bold ml-[30px]">{{ t('异常类型TOP5') }}</div>
              <Chart :options="pieOptions" height="100%" style="height: 220px; width: 100%" />
            </div> -->
            <!-- 折线图 -->
            <div class="w-[50%]">
              <div class="text-14px font-bold ml-[30px]">{{ t('dict.ClosureRate') }}</div>
              <Chart :options="lineOptions" height="100%" style="height: 220px; width: 100%" />
            </div>
          </div>
        </div>

        <Grid>
          <template #toolbar-actions>
            <a-button @click="handleExport" v-auth="'btn_download'">
              {{ t('common.batchExport') }}
            </a-button>
          </template>
          <template #Status="{ row }">
            <LydcTag v-if="row.status == 70" theme="green" :text="t('dict.SMAHandleStatus.Handled')"></LydcTag>
            <LydcTag v-if="row.status == 10" theme="gray" :text="t('dict.SMAHandleStatus.Handling')"></LydcTag>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import Decimal from 'decimal.js';
  import { cloneDeep, merge } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';

  import { exportProductLineExcel, getDashbroadsPage } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import Subtitle from './components/SubTitle.vue';
  import DateChange from './components/DateChange.vue';
  import { Chart } from '/@/components/Chart';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { columns, stackChartOptions, lineChartOptions, pieChartOptions, getExportColumn } from './components/config';

  defineOptions({ name: 'qms-report-abnormalReport' });
  const { t } = useI18n();

  const stackOptions = ref({});
  const lineOptions = ref({});
  const pieOptions = ref({});
  const state = ref({
    startTime: '',
    endTime: '',
    factoryArea: null,
  });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const time = ref<any[]>([]);
  const dashboardData = ref({
    closedPercent: 0, // 百分比
    completedAllCount: 0, //已处理数量
    pendingAllCount: 0, //处理中数量
  });
  const stackData = ref<{
    xAxisList: string[];
    pendingList: number[];
    processedList: number[];
  }>({
    xAxisList: [],
    pendingList: [],
    processedList: [],
  });
  const lineData = ref<{
    xAxisList: string[];
    closedList: number[];
  }>({
    xAxisList: [],
    closedList: [],
  });

  const timeConversion = (list: string[]) => {
    return list.map(item => {
      const date = dayjs(item);
      return date.format('MM-DD');
    });
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-report-abnormalReport-list',
      columns,
      api: getDashbroadsPage,
      // pagerConfig: {
      //   enabled: true,
      //   autoHidden: false,
      // },
      beforeFetch: params => {
        return {
          ...params,
          ...state.value,
        };
      },
      proxyConfig: {
        response: {
          result: 'data.pageList.list',
          total: 'data.pageList.pagination.Total',
        },
      },
      afterFetch: data => {
        const { closedPercent, completedAllCount, pendingAllCount, completedDailyCount, pendingDailyCount, closedDailyPersent } = data.dashboardDatas;
        dashboardData.value = { closedPercent, completedAllCount, pendingAllCount };

        const completedKeys = Object.keys(completedDailyCount || {});
        const pendingKeys = Object.keys(pendingDailyCount || {});
        const xAxisList = completedKeys.length >= pendingKeys.length ? completedKeys : pendingKeys;
        stackData.value = {
          xAxisList: timeConversion(xAxisList),
          pendingList: xAxisList.map(date => (pendingDailyCount || {})[date] || 0),
          processedList: xAxisList.map(date => (completedDailyCount || {})[date] || 0),
        };

        lineData.value = {
          xAxisList: timeConversion(Object.keys(closedDailyPersent || {})),
          closedList: (Object.values(closedDailyPersent || {}) as number[]).map(item => {
            return Number(Decimal(item).times(Decimal(100)));
          }),
        };
        // 加载图表数据
        initChart();
      },
    },
  });

  function exportAction(query) {
    exportProductLineExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  //导出
  async function handleExport() {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        isDashboardExport: true,
        ...state.value,
        ...(await gridApi.getFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
    });
  }

  const initChart = () => {
    stackOptions.value = merge(cloneDeep(stackChartOptions), {
      xAxis: {
        type: 'category',
        data: stackData.value.xAxisList,
      },

      series: [
        {
          name: t('dict.ExceptionStatus.2'),
          type: 'bar',
          barWidth: '40%',
          stack: t('dict.Total'),
          label: {
            show: false,
          },
          data: stackData.value.pendingList,
          itemStyle: {
            color: 'rgba(56, 116, 255)',
          },
        },
        {
          name: t('dict.ExceptionStatus.5'),
          type: 'bar',
          barWidth: '40%',
          stack: t('dict.Total'),
          label: {
            show: false,
          },
          data: stackData.value.processedList,
          itemStyle: {
            color: 'rgba(94, 190, 255)',
          },
        },
      ],
    });
    lineOptions.value = merge(cloneDeep(lineChartOptions), {
      xAxis: {
        type: 'category',
        data: lineData.value.xAxisList,
      },

      series: [
        {
          name: t('dict.ClosureRate'),
          type: 'line',
          data: lineData.value.closedList,
          smooth: true, // 开启平滑曲线
          symbol: 'emptyCircle', // 设置为空心圆
          symbolSize: 12, // 设置节点大小为 12
          itemStyle: {
            color: 'rgba(75, 123, 236)', // 线条颜色
            borderWidth: 2, // 设置圆点边框宽度
          },
          lineStyle: {
            width: 4,
            color: {
              type: 'linear', // 渐变类型为线性渐变
              x: 0, // 渐变起始位置 x 坐标
              y: 0, // 渐变起始位置 y 坐标
              x2: 0, // 渐变结束位置 x 坐标
              y2: 1, // 渐变起始位置 y 坐标
              colorStops: [
                {
                  offset: 0, // 渐变起始位置，从 0 开始
                  color: 'rgba(56, 116, 255)', // 渐变起始颜色
                },
                {
                  offset: 0.5, // 渐变结束位置，到 0.5 结束
                  color: 'rgba(94, 190, 255)', // 渐变结束颜色
                },
                {
                  offset: 1, // 渐变结束位置，到 1 结束
                  color: 'rgba(56, 116, 255)', // 渐变结束颜色
                },
              ],
            },
          },
        },
      ],
    });
    pieOptions.value = merge(cloneDeep(pieChartOptions), {
      // xAxis: {
      //   type: 'category',
      //   data: lineData.value.xAxisList,
      // },
      series: [
        {
          // name: '',
          name: 'Radius Mode',
          type: 'pie',
          radius: [30, 90],

          // roseType: 'area',
          label: {
            formatter: '{d}%',
            // show: false,
            position: 'inner',
            fontSize: 10,
            color: '#fff',
          },
          data: [
            { value: 30, name: '故障中', itemStyle: { color: ' #3874ff' } },
            { value: 25, name: '编程中', itemStyle: { color: '#5fbeff' } },
            { value: 20, name: '停机中', itemStyle: { color: '#ff7b00' } },
            { value: 18, name: '已完成', itemStyle: { color: '#faad14' } },
            { value: 10, name: '测量中', itemStyle: { color: '#3fbaa4' } },
          ],
        },
      ],
    });
  };

  const dateChange = val => {
    time.value = [dayjs(val.startDate), dayjs(val.endDate)];
    state.value.startTime = val.startDate;
    state.value.endTime = val.endDate;
    getData();
  };

  const dataRangeChange = () => {
    state.value.startTime = dayjs(time.value[0]).format('YYYY-MM-DD');
    state.value.endTime = dayjs(time.value[1]).format('YYYY-MM-DD');
    getData();
  };

  const getData = () => {
    // 加载表格数据
    gridApi.reload();
  };
</script>

<style scoped lang="less">
  ::v-deep(.subtitle-container) {
    padding-bottom: 0;
  }

  .title-date-change {
    display: flex;
    align-items: center;
  }

  .card-box {
    border-radius: 2px;
    border: 1px solid rgb(240 240 240);
    margin-top: 12px;

    .card-box-title {
      padding: 10px 20px;
      background: linear-gradient(180deg, #ffede5 0%, #fff8f5 100%);
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgb(240 240 240);

      .title-view {
        margin-left: 20px;
        display: flex;

        .view-item {
          padding: 0 10px;
          border-right: 1px solid rgb(217 217 217);

          &:last-child {
            border-right: none;
          }

          .view-num {
            color: #ff7b00;
          }
        }
      }
    }

    .echarts-box {
      justify-content: space-between;
    }
  }

  .lydc-content-wrapper-content {
    display: flex;
    flex-direction: column;

    .table {
      flex: 1;
    }
  }
</style>
