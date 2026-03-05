<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-16px">
        <SearchForm @register="register">
          <template #right>
            <a-button type="primary" @click="init">查询</a-button>
          </template>
        </SearchForm>
        <ScrollContainer>
          <div class="charts-container">
            <div class="left-chart-box">
              <template v-for="(item, index) in singleOptions" :key="index">
                <div class="chart-box h-148px">
                  <Chart ref="leftChartRefs" :options="item" height="148px" style="height: 100%; width: 100%" />
                </div>
              </template>
            </div>
            <div class="right-chart-container">
              <div class="line-charts ml-10px">
                <template v-for="(item, index) in lineOptions" :key="index">
                  <div class="center-chart-box">
                    <div class="flex justify-start h-34px p-15px" style="background: #f3f3f3">
                      <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                      <div class="font-bold" style="line-height: 16px">{{ item.project }} </div>
                    </div>
                    <div class="h-120px">
                      <Chart :options="item.option" height="110px" style="height: 100%; width: 100%" />
                    </div>
                  </div>
                </template>
              </div>
              <div class="bar-charts">
                <template v-for="(item, index) in rightOptions">
                  <div class="right-bar-box">
                    <div class="flex justify-start h-34px p-15px" style="background: #f3f3f3">
                      <div class="w-2px h-16px mr-10px" style="background: #ff7b00"></div>
                      <div class="font-bold" style="line-height: 16px">{{ item.maxDate }} </div>
                    </div>
                    <div class="h-120px p-6px pb-4px box-border">
                      <Chart :options="item" height="110px" style="height: 100%; width: 100%" />
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </ScrollContainer>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Chart } from '/@/components/Chart';
  import { onMounted, ref, nextTick, watch } from 'vue';
  import { merge, isEmpty } from 'lodash-es';
  import ScrollContainer from '/@/components/Container/src/ScrollContainer.vue';
  import { getCenterLineOptions, getLeftSingleChart, getRightBarChart, commonOptions } from '/@/views/dashboard/vc/keyProcess/config';
  import { getProcesseparam, getProcesseTrend, getProjectParam } from '/@/api/dashbord/operate';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { dateUtil } from '/@/utils/dateUtil';
  import SearchForm from '/@/views/dashboard/commonComponents/SearchForm/index.vue';
  import { useSearchForm } from '/@/views/dashboard/commonComponents/SearchForm/useSearchForm';
  defineOptions({ name: 'dashboard-vc-keyProcess' });
  const [register, { searchFormValue, searchLoading, api }] = useSearchForm({
    formOptions: commonOptions,
  });
  const { t } = useI18n();

  const singleOptions = ref([]);

  const lineOptions = ref([{}]);

  const rightOptions = ref([]);

  const leftChartRefs = ref([]);
  onMounted(() => {
    // 工序下拉值 由是否关键工序动态变化
    watch(
      [() => searchFormValue.value.isCriticalProcess],
      () => {
        if (!searchLoading.value && !isEmpty(searchFormValue.value)) {
          getDimensionWordNoSearchparameterInfo();
        }
      },
      { deep: true },
    );

    watch(
      [() => searchLoading.value],
      () => {
        if (!searchLoading.value && !isEmpty(searchFormValue.value)) {
          init();
        }
      },
      { immediate: true, deep: true },
    );
  });
  function init() {
    getProcesseTrend(api.getFormParams()).then(async ({ code, data }) => {
      if (code === 200) {
        await nextTick();
        initLeftSingleChart(data);
        // 左边options
        singleOptions.value = initLeftSingleChart(data);
        // 中间options
        lineOptions.value = initCenterLineChart(data);
        // 右边options
        rightOptions.value = initRightBarChart(data);
      }
    });
  }

  function initLeftSingleChart(data) {
    return data.map(item => {
      return merge({}, getLeftSingleChart(), {
        title: {
          text: item.project,
        },
        yAxis: [
          {
            data: [item.project],
            axisLabel: {
              formatter: function (value, index) {
                return [(item.rate * 100).toFixed(1)][index] + '%';
              },
            },
          },
        ],
        series: [
          {
            data: [(item.rate * 100).toFixed(1)],
          },
        ],
      });
    });
  }

  function initCenterLineChart(data) {
    return data.map(item => {
      const xAxios = [];
      const values = [];
      item.tarGetChart.forEach(v => {
        xAxios.push(v.project);
        values.push((v.rate * 100).toFixed(1));
      });
      // 计算最小整十数
      const minValue = Math.min(...values);
      const minTick = Math.floor(minValue / 10) * 10;

      return {
        project: item.project,
        option: merge({}, getCenterLineOptions(), {
          xAxis: {
            data: xAxios,
            axisLabel: {
              rotate: 15, // 文字倾斜度（正数向右，负数向左）
              fontSize: 10, // 字体大小（默认12）
              margin: 10, // 标签与轴线的距离（避免重叠）
              interval: 0, // 强制显示所有标签（默认自动隐藏部分）
            },
          },
          yAxis: [
            {},
            {
              min: minValue,
              max: Math.ceil(Math.max(...data) / 10) * 10,
              axisLabel: {
                show: true,
                formatter: function (value) {
                  // 只显示最小整十数的刻度
                  if (value === minValue) {
                    return minTick;
                  }
                  return '';
                },
              },
            },
          ],
          series: [
            {
              data: values,
            },
          ],
        }),
      };
    });
  }

  function initRightBarChart(data) {
    return data.map(item => {
      const xAxisData: string[] = [];
      const barData: number[] = [];
      const lineData: number[] = [];
      item.badItemRate.forEach(v => {
        xAxisData.push(v.badItem);
        barData.push(v.number);
        lineData.push(Number.parseInt((v.rate * 100).toFixed(1)));
      });
      return merge({ maxDate: item.maxDate }, getRightBarChart(), {
        xAxis: {
          data: xAxisData,
        },
        series: [
          {
            // name: '不良数',
            data: barData,
          },
          {
            // name: '累计不良占比',
            data: lineData,
          },
        ],
      });
    });
  }
  // 获取查询参数信息
  function getDimensionWordNoSearchparameterInfo() {
    const { isCriticalProcess } = api.getFormParams();

    getProcesseparam({
      isCriticalProcess,
    }).then(({ data }) => {
      const keyIdx = commonOptions.findIndex(item => item.key === 'processe');
      if (commonOptions[keyIdx]) {
        const options = data.map(item => ({
          text: item,
          value: item,
        }));
        (commonOptions[keyIdx] as any).options = options;
      }
    });
  }
</script>

<style scoped lang="less">
  :deep(.dashboard-common-search-header .search-form) {
    padding: 0 !important;
  }

  .charts-container {
    height: max-content;
    display: flex;
    width: 100%;
    flex-shrink: 0;

    .left-chart-box {
      border: 1px solid #e2e2e2;
      flex: 0 0 16.6%;
      padding: 10px;
      box-sizing: border-box;

      .chart-box {
        margin: 6px 0;
        padding: 15px;
        box-sizing: border-box;
        border-radius: 4px;
      }
    }
  }

  .right-chart-container {
    display: flex;
    flex-direction: row;
    flex: 0 0 83.4%;
    width: 83.4%; /* 冗余保障：明确宽度值 */
    .line-charts {
      flex: 0 0 55.34%;
      border: 1px solid #e2e2e2;
      border-right: none;
    }

    .bar-charts {
      flex: 0 0 44.66%;
    }
  }

  .chart-box {
    background: linear-gradient(90deg, #e4ecff 57.92%, rgb(228 236 255 / 6%) 99.99%);
  }

  .bar-charts {
    border: 1px solid #e2e2e2;
    box-sizing: border-box;
  }

  :deep(.ant-form-item-label) {
    padding-left: 8px !important;
    color: rgb(26 26 26) !important;
    background-color: rgb(230 230 230) !important;
  }
</style>
