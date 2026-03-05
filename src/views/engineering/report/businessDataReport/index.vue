<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white p-10px">
        <div class="header">
          <!-- <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" style="width: 250px" /> -->
          <a-form layout="inline">
            <a-form-item :label="`${t('dict.bisFlow')}`" :colon="false">
              <a-select
                v-model:value="flow"
                :options="flowOptions"
                style="width: 200px"
                :fieldNames="{ label: 'fullName', value: 'enCode' }"
                @change="getDataSource()"></a-select>
            </a-form-item>
            <a-form-item :label="`${t('dict.MainProcess')}`" :colon="false">
              <a-select
                v-model:value="mainProcess"
                :options="processOptions"
                style="width: 200px"
                :fieldNames="{ label: 'fullName', value: 'enCode' }"
                @change="getDataSource()"></a-select>
            </a-form-item>
            <a-form-item :colon="false">
              <a-tooltip placement="right" :overlayInnerStyle="{ width: '520px' }">
                <template #title>
                  <div>
                    <p>{{ t('dict.businessDataReport.tip1') }}</p>
                    <p>{{ t('dict.businessDataReport.tip2') }}</p>
                    <p>{{ t('dict.businessDataReport.tip3') }}</p>
                    <p>{{ t('dict.businessDataReport.tip4') }}</p>
                  </div>
                </template>
                <div>{{ t('dict.FactoryAreaColumn.description') }} <QuestionCircleOutlined /></div>
              </a-tooltip>
            </a-form-item>
          </a-form>
        </div>
        <!-- 无数据 -->
        <div class="content-height flex align-center" v-if="emptyDataFlag">
          <div class="flex column">
            <img :src="emptyDataSvg" style="width: 228px; height: 228px" />
            <p class="empty-tips">{{ t('dict.businessDataReport.emptyData') }}</p>
          </div>
        </div>
        <!-- 有数据 -->
        <div class="content-height" v-else>
          <div style="height: 200px">
            <Chart v-if="flow == '9'" :options="handleChartOptionsPCC" height="100%" style="height: 100%; width: 100%" />
            <Chart v-else :options="handleChartOptions" height="100%" style="height: 100%; width: 100%" />
          </div>
          <Grid class="table-container">
            <template #toolbar-actions>
              <a-space>
                <a-button type="primary" ghost @click="handleExport">{{ t('common.batchExport') }}</a-button>
              </a-space>
            </template>
          </Grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import { ref, reactive, watch, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Chart } from '/@/components/Chart';
  import { Schema, chartOptions, columns, chartOptionsPCC } from './config';
  import { getBisReport } from '/@/api/engineering/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { omit } from 'lodash-es';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumnsConfigList, transformTableData, filteredData } from './utils';
  import dayjs from 'dayjs';
  import { merge } from 'lodash-es';
  import emptyDataSvg from '/@/assets/svg/report/empty_data.svg';

  defineOptions({ name: 'engineering-report-businessDataReport' });

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const flow = ref('1');
  const flowOptions = ref();
  const handleChartOptions = ref();
  const handleChartOptionsPCC = ref();
  const mainProcess = ref('1');
  const processOptions = ref();
  const emptyDataFlag = ref(false);

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    labelWidth: 80,
    // baseColProps: { span: 16 },
    showActionButtonGroup: false,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: Schema,
    i18nConfig: {
      // moduleCode: 'BisReportColumn',
      // transferRange: ['placeholder'],
    },
  });

  function handleSearch() {
    // reload();
  }

  function handleReset() {
    clearValidate();
    // reload();
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-report-businessDataReport-list',
      columns: columns,
      formConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: false,
        pageSizes: [20, 50, 100, 200, 500, 1000, 2000],
      },
      api: getTableData,
      proxyConfig: {
        autoLoad: false,
        response: {
          list: 'data.list',
          total: 'data.total',
        },
      },
      toolbarConfig: {
        zoom: true,
      },
    },
    // beforeFetch: params => {
    //   params.flow = getFieldsValue().flow || '';
    // },
    gridEvents: {
      custom: () => {
        gridApi.getDataSource();
      },
    },
  });

  const tableColumns = ref<Array<any>>([]);
  const dataSource = ref<Array<any>>([]);
  /** 获取全部的列表数据 */
  async function getDataSource() {
    dataSource.value.length = 0;
    emptyDataFlag.value = false;
    gridApi.setLoading(true);
    return getBisReport({ flow: flow.value, mainProcess: mainProcess.value })
      .then(async res => {
        const originData = Array.isArray(res.data) ? res.data : [];
        if (originData.length == 0) {
          emptyDataFlag.value = true;
          return;
        } else {
          const filterData = filteredData(originData);
          const originColumns = columns;

          tableColumns.value = getColumnsConfigList({ data: filterData, columns: originColumns });
          await gridApi.reloadColumn(tableColumns.value);

          dataSource.value = transformTableData(filterData);
          handleDataForEchart(filterData);
          return;
        }
      })
      .catch(err => console.warn('🚀 ~ list:res.data.slice ~ err:', err))
      .finally(() => {
        gridApi.setLoading(false);
        gridApi.reload();
      });
  }

  /**
   * 前端实现分页，数据源来自`dataSource.value`
   * @param params
   */
  async function getTableData(params: { currentPage: number; pageSize: number }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const startIndex = (params.currentPage - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedData = dataSource.value.slice(startIndex, endIndex);

        resolve({
          data: {
            list: paginatedData,
            total: dataSource.value.length,
          },
        });
      }, 700);
    });
  }

  // 处理图表数据
  function handleDataForEchart(originalData) {
    const xAxisData = originalData.map(item => item.factory.split('/')[0]);
    let legendData = originalData[0].list[0].values.map(item => item.k.slice(-4));
    const lastTwoWeek: (string | number)[] = [];
    const lastWeek: (string | number)[] = [];
    const currentWeek: (string | number)[] = [];
    const lastTwoWeekPCC: (string | number)[] = [];
    const lastWeekPCC: (string | number)[] = [];
    const currentWeekPCC: (string | number)[] = [];
    // 遍历每个工厂
    originalData.forEach(factory => {
      // 找到最后一个流程
      const lastProcess = factory.list[factory.list.length - 1];
      if (lastProcess) {
        // 为每个周数添加对应的数据
        lastTwoWeek.push(lastProcess.values[lastProcess.values.length - 3].v);
        lastWeek.push(lastProcess.values[lastProcess.values.length - 2].v);
        currentWeek.push(lastProcess.values[lastProcess.values.length - 1].v);
      }
      // PCC处理
      const lastTwoProcess = factory.list[factory.list.length - 2];
      if (lastTwoProcess && flow.value == '9') {
        // 为每个周数添加对应的数据
        lastTwoWeekPCC.push(lastTwoProcess.values[lastTwoProcess.values.length - 3].v);
        lastWeekPCC.push(lastTwoProcess.values[lastTwoProcess.values.length - 2].v);
        currentWeekPCC.push(lastTwoProcess.values[lastTwoProcess.values.length - 1].v);
      }
    });
    // 是否PCC
    if (flow.value == '9') {
      initChartOptionPCC(xAxisData, legendData, lastTwoWeek, lastTwoWeekPCC, lastWeek, lastWeekPCC, currentWeek, currentWeekPCC);
    } else {
      initChartOption(xAxisData, legendData, lastTwoWeek, lastWeek, currentWeek);
    }
  }

  function initChartOption(xAxisData, legendData, lastTwoWeek, lastWeek, currentWeek) {
    // const barWidthPx = 12; // 柱子宽度：12px
    // const barGapPercent = 60; // 柱子间隙：60%
    // const barGapPx = barWidthPx * (barGapPercent / 100); // 实际间隙：7.2px
    handleChartOptions.value = merge({}, chartOptions, {
      xAxis: {
        data: xAxisData,
      },
      legend: {
        // data: [...legendData, '变化率'],
        data: legendData,
      },
      series: [
        {
          renderItem: (params, api) => {
            let start = api.coord([api.value(0)]);
            let width = (params.coordSys.width / xAxisData.length) * 1;
            return {
              type: 'rect',
              shape: {
                x: start[0] - width / 2,
                y: params.coordSys.y,
                width: width,
                height: params.coordSys.height,
              },
              style: api.style(),
            };
          },
          data: currentWeek,
        },
        {
          name: legendData[0],
          data: lastTwoWeek,
        },
        {
          name: legendData[1],
          data: lastWeek,
        },
        {
          name: legendData[2],
          data: currentWeek,
        },
        // {
        //   renderItem: function (params, api) {
        //     const categoryIndex = params.dataIndex;
        //     // 只处理有数据的分类
        //     if (lastTwoWeek[categoryIndex] === 0 && lastWeek[categoryIndex] === 0 && currentWeek[categoryIndex] === 0) {
        //       return;
        //     }
        //     const values = [lastTwoWeek[categoryIndex], lastWeek[categoryIndex], currentWeek[categoryIndex]];
        //     // 关键：获取像素级别的精确信息
        //     const categoryCenter = api.coord([categoryIndex, 0])[0];
        //     const categoryWidth = api.coord([1, 0])[0] - api.coord([0, 0])[0];
        //     // 计算总宽度（三个柱子 + 两个间隙）
        //     const totalBarsWidth = 3 * barWidthPx + 2 * barGapPx;
        //     // 计算起始偏移（居中显示）
        //     const startOffset = (categoryWidth - totalBarsWidth) / 2;
        //     const points: any[] = [];
        //     const groupChildren: any[] = [];
        //     for (let i = 0; i < 3; i++) {
        //       // 计算每个柱子的x坐标（像素精确计算）
        //       const x = categoryCenter - categoryWidth / 2 + startOffset + i * (barWidthPx + barGapPx) + barWidthPx / 2;
        //       const y = api.coord([0, values[i]])[1];
        //       points.push([x, y]);

        //       // 添加连接点
        //       groupChildren.push({
        //         type: 'circle',
        //         shape: { cx: x, cy: y, r: 3 },
        //         style: {
        //           fill: 'rgba(255, 123, 0, 1)',
        //           stroke: '#fff',
        //           lineWidth: 2,
        //         },
        //       });
        //     }
        //     // 添加连接线
        //     groupChildren.push({
        //       type: 'polyline',
        //       shape: { points: points },
        //       style: {
        //         stroke: 'rgba(255, 123, 0, 1)',
        //         lineWidth: 2,
        //         fill: 'none',
        //       },
        //     });
        //     return {
        //       type: 'group',
        //       children: groupChildren,
        //     };
        //   },
        //   data: xAxisData.map((_, index) => index),
        //   z: 10,
        // },
      ],
    });
  }

  function initChartOptionPCC(xAxisData, legendData, lastTwoWeek, lastTwoWeekPCC, lastWeek, lastWeekPCC, currentWeek, currentWeekPCC) {
    const suffixes = ['-PCC', '-LYPN'];
    const formatLegendData = legendData.flatMap(item => suffixes.map(suffix => item + suffix));
    handleChartOptionsPCC.value = merge({}, chartOptionsPCC, {
      xAxis: {
        data: xAxisData,
      },
      legend: {
        data: formatLegendData,
      },
      series: [
        {
          renderItem: (params, api) => {
            let start = api.coord([api.value(0)]);
            let width = (params.coordSys.width / xAxisData.length) * 1;
            return {
              type: 'rect',
              shape: {
                x: start[0] - width / 2,
                y: params.coordSys.y,
                width: width,
                height: params.coordSys.height,
              },
              style: api.style(),
            };
          },
          data: currentWeek,
        },
        {
          name: formatLegendData[0],
          data: lastTwoWeekPCC,
        },
        {
          name: formatLegendData[1],
          data: lastTwoWeek,
        },
        {
          name: formatLegendData[2],
          data: lastWeekPCC,
        },
        {
          name: formatLegendData[3],
          data: lastWeek,
        },
        {
          name: formatLegendData[4],
          data: currentWeekPCC,
        },
        {
          name: formatLegendData[5],
          data: currentWeek,
        },
      ],
    });
  }

  /** 导出 */
  function handleExport() {
    gridApi.grid.openExport({
      // isMerge: true,
      // isFooter: true,
      type: 'xlsx',
      types: ['xlsx'],
      mode: 'current',
      modes: ['current'],
      filename: () => `${t('dict.bisFlow')}_${dayjs().format('YYYY-MM-DD')}`,
    });
  }

  onMounted(() => {
    baseStore.getDictionaryData('bisFlow').then(data => {
      flowOptions.value = data;
    });
    baseStore.getDictionaryData('MainProcess').then(data => {
      processOptions.value = data;
    });
    getDataSource();
  });
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: flex-start;
    height: 40px;
  }

  .table-container {
    height: calc(100% - 200px);
  }

  .content-height {
    height: calc(100% - 40px);
  }
</style>
