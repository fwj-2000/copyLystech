<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content page-content bg-white">
        <div class="h-[375px]">
          <Grid>
            <template #toolbar-actions>
              <a-space>
                <a-button type="primary" @click="handleExport"> {{ t('common.batchExport') }} </a-button>
              </a-space>
            </template>
          </Grid>
        </div>
        <div style="border: 1px solid #e5e5e5" class="h-[calc(100%-395px)] ml-12px mr-12px">
          <Chart :options="lineOptions" height="calc(100% - 0px)" style="height: 100%; width: 100%" />
        </div>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>
<script setup lang="ts">
  defineOptions({ name: 'productionDeal-hotPressingTemp' });
  // 第三方库
  import { ref, onMounted } from 'vue';
  import { merge } from 'lodash-es';
  import { EChartsOption } from 'echarts';

  // 项目内公共组件和工具
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getCollectSensorDataList, getMachineList, exportCollectExcel, getLineChartData } from '/@/api/productionDeal/hotPressingTemp';
  import { Chart } from '/@/components/Chart';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';

  // 当前目录下的文件
  import { getPageColumns, lineChartOptions, getFormConfig, dataMock, dates } from './config';

  const { t } = useI18n();
  const lineOptions = ref<EChartsOption>({});
  // const cacheRowAddr = ref('');

  onMounted(async () => {
    await resetRangeDate();
    init();
  });
  const [Grid, { reload, getFetchParams, updateSchema, getFromValue, resetForm, setLatestSubmissionValues }] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      submitOnChange: false,
      showCollapseButton: true,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      fieldMappingTime: [['pickerVal', ['startTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
      handleReset: async () => {
        await resetRangeDate();
        reload();
      },

      i18nConfig: {
        moduleCode: 'CollectSensorDataColumn',
        transferRange: ['placeholder'], //placeholder
      },
    },
    gridOptions: {
      id: 'productionDeal-hotPressingTemp-list',
      columns: getPageColumns(),
      showIndexColumn: true,
      height: '375px',
      api: getCollectSensorDataList,
      i18nConfig: {
        moduleCode: 'CollectSensorDataColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      rowStyle({ row }) {
        return {
          color: row.isAbnormal ? 'red' : '',
        };
      },
    },
    gridEvents: {
      // 点击单元格事件 刷新图表，加缓存检验，避免重复请求
      cellClick: ({ column, row }) => {
        getEchartConfig(row);
        // if (cacheRowAddr.value === row.addr) {
        //   return;
        // }
        // cacheRowAddr.value = row.addr;
        // // console.log(column, row, '点击了单元格');
      },
    },
  });
  const resetRangeDate = async () => {
    dates.value = undefined;
    await resetForm();
    const formValues = await getFromValue();
    setLatestSubmissionValues(formValues);
  };
  const init = async () => {
    getMachineList({}).then(res => {
      const workNoList = res.data.map(item => ({
        label: item.machineNo,
        value: item.addr,
      }));
      updateSchema([
        {
          fieldName: 'addr',
          componentProps: {
            options: workNoList,
          },
        },
      ]);
    });
  };
  // 刷新图表
  const getEchartConfig = async row => {
    const { addr, ...res } = await getFromValue();
    const { data } = await getLineChartData({ addr: row.addr ?? addr, ...res });
    // 模拟数据 - 在实际应用中，这些数据可能来自API请求
    const xAxis = data.categories;
    const temperatureData = data.temperatureData;
    // 定义温度上下限
    const upperLimit = data.upperLimit;
    // 计算y轴最大值，确保大于等于upperLimit
    const yAxisMax = Math.max(Math.max(...temperatureData) * 1.1, upperLimit);

    // 合并配置和数据
    lineOptions.value = merge({}, lineChartOptions(), {
      xAxis: {
        data: xAxis,
      },
      yAxis: {
        max: yAxisMax, // 手动设置y轴最大值
      },
      series: [
        {
          data: temperatureData,
          markLine: {
            data: [
              {
                yAxis: upperLimit,
              },
            ],
          },
        }, // 实际温度数据
      ],
    });
  };
  // 批量导出
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const handleExport = async () => {
    const exportColumns = getPageColumns();
    openExportModal(true, {
      api: exportCollectExcel,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
</script>
