<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content page-content bg-white p-[20px]">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('dict.CommonCol.clientOnlineReport') }}</div>
        </div>

        <div class="search-bar">
          <BasicForm class="search-form mt-10px" @register="registerForm" @submit="handleSearch" />

          <div class="search-time">
            <DateChange @dateChange="dateChange" />
            <a-range-picker v-model:value="time" :allowClear="false" @change="dataRangeChange" />
          </div>
        </div>
        <div class="scroll-content">
          <div class="data-info">
            <div class="number-box">
              <div class="panel">
                <!-- 总料件数 -->
                <ContainPanel
                  :title="t('dict.NpiShipmentOnlineColumn.TotalNumberOfParts')"
                  :number="chainData.totalNumberOfParts"
                  :analysis-number="chainData.totalNumberOfPartsDiff"
                  class="dark-blue" />
                <!-- 已出货数 -->
                <ContainPanel
                  :title="t('dict.NpiShipmentOnlineColumn.NumberofShipments')"
                  :number="chainData.numberofShipments"
                  :analysis-number="chainData.numberOfShipmentsDiff"
                  class="light-blue" />
                <!-- 已反馈数 -->
                <ContainPanel
                  :title="t('dict.NpiShipmentOnlineColumn.NumberOfFeedbacks')"
                  :number="chainData.numberOfFeedbacks"
                  :analysis-number="chainData.numberOfFeedbacksDiff"
                  class="green" />
              </div>
              <div class="panel">
                <!-- IQC OK -->
                <ContainPanel title="IQC OK" :number="chainData.okNumberOfIqc" :analysis-number="chainData.okNumberOfIqcDiff" class="yellow-green" />
                <!-- IQC NG -->
                <ContainPanel title="IQC NG" :number="chainData.ngNumberOfIqc" :analysis-number="chainData.ngNumberOfIqcDiff" class="yellow" />
                <!-- 上线OK -->
                <ContainPanel
                  :title="t('dict.CommonCol.onlineOK')"
                  :number="chainData.okNumberOfOnline"
                  :analysis-number="chainData.okNumberOfOnlineDiff"
                  class="aqua" />
                <!-- 上线NG -->
                <ContainPanel
                  :title="t('dict.CommonCol.onlineNG')"
                  :number="chainData.ngNumberOfOnline"
                  :analysis-number="chainData.ngNumberOfOnlineDiff"
                  class="orange" />
              </div>
            </div>

            <div class="number-box">
              <Chart :options="lineOptions" height="280px" width="100%" />
            </div>
          </div>

          <Grid class="h-[530px]">
            <template #iQCPassRate="{ row }">
              <div>{{ Decimal(row.iQCPassRate).times(Decimal(100)) }}%</div>
            </template>
            <template #onlinePassRate="{ row }">
              <div>{{ Decimal(row.onlinePassRate).times(Decimal(100)) }}%</div>
            </template>
            <template #toolbar-actions>
              <a-button v-auth="'btn_download'" @click="handleExport">
                {{ t('common.batchExport') }}
              </a-button>
            </template>
          </Grid>
        </div>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchemas, columns, lineChartOptions, getExportColumn } from './config';
  import DateChange from './components/DateChange.vue';
  import ContainPanel from './components/ContainPanel.vue';
  import { Chart } from '/@/components/Chart';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import dayjs from 'dayjs';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { cloneDeep, merge } from 'lodash-es';
  import Decimal from 'decimal.js';
  import { getItemChainList, dailyItemDetailStatistics, getItemDetailStatisticsList, shipmentreportExportData } from '/@/api/engineering/clientRollout';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-clientRollout-clientLaunchReport' });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const time = ref<any[]>([]);
  const state = reactive<any>({
    startDate: '',
    endDate: '',
  });
  const lineOptions = ref({});

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    schemas: formSchemas,
    i18nConfig: {
      moduleCode: 'NpiShipmentOnlineColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-clientLaunchReport-list',
      columns,
      api: getItemDetailStatisticsList,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      beforeFetch: params => {
        return {
          ...params,
          ...state,
          ...getFieldsValue(),
        };
      },
    },
  });

  const chainData = ref({
    totalNumberOfParts: '', //总料件数
    totalNumberOfPartsDiff: '',
    numberofShipments: '', //已出货数
    numberOfShipmentsDiff: '',
    numberOfFeedbacks: '', // 已反馈数
    numberOfFeedbacksDiff: '',
    okNumberOfIqc: '', // IQC OK
    okNumberOfIqcDiff: '',
    ngNumberOfIqc: '', // IQC NG
    ngNumberOfIqcDiff: '',
    okNumberOfOnline: '', //上线OK
    okNumberOfOnlineDiff: '',
    ngNumberOfOnline: '', // 上线NG
    ngNumberOfOnlineDiff: '',
  });

  // 获取环比数据
  const getItemChainListFn = async () => {
    const params = {
      ...state,
      ...getFieldsValue(),
    };
    const { data } = await getItemChainList(params);
    chainData.value = data;
  };

  const lineData = reactive<any>({
    xAxis: [],
    series: [],
  });
  // 获取各项指标详情
  const dailyItemDetailStatisticsFn = async () => {
    const params = {
      ...state,
      ...getFieldsValue(),
    };
    const { data } = await dailyItemDetailStatistics(params);
    lineData.xAxis = data.dates;
    lineData.series = data.series.map(item => {
      return {
        ...item,
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 2,
            color: item.color,
          },
        },
      };
    });
    generateChart();
  };

  const getData = () => {
    // 获取环比数据
    getItemChainListFn();
    // 获取各项指标详情
    dailyItemDetailStatisticsFn();
    // 统计报表列表查询
    reload();
  };

  const dateChange = val => {
    time.value = [dayjs(val.startDate), dayjs(val.endDate)];
    state.startDate = val.startDate;
    state.endDate = val.endDate;
    getData();
  };

  const dataRangeChange = () => {
    state.startDate = dayjs(time.value[0]).format('YYYY-MM-DD');
    state.endDate = dayjs(time.value[1]).format('YYYY-MM-DD');
    getData();
  };
  const handleSearch = () => {
    getData();
  };

  const generateChart = () => {
    lineOptions.value = merge(cloneDeep(lineChartOptions), {
      xAxis: [
        {
          type: 'category',
          data: lineData.xAxis,
        },
      ],
      series: lineData.series,
    });
  };

  // 批量导出
  const handleExport = async () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...state,
        ...(await getFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    shipmentreportExportData(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };
</script>
<style lang="less" scoped>
  .page-content {
    display: flex;
    flex-direction: column;

    .scroll-content {
      flex: 1;
      overflow: scroll;
    }
  }

  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }

  .search-bar {
    display: flex;
    align-items: center;

    .search-form {
      flex: 1;
    }

    .search-time {
      margin-left: 100px;
      display: flex;
      align-items: center;
    }
  }

  .data-info {
    margin-top: 20px;
    display: flex;

    .number-box {
      flex: 1;

      .panel {
        display: flex;
        margin-bottom: 20px;
      }
    }
  }

  .dark-blue {
    border-top: 4px solid #3874ff;
    background: #ccdbff;
  }

  .light-blue {
    border-top: 4px solid #5ebeff;
    background: #cceaff;
  }

  .green {
    border-top: 4px solid #4bbeaa;
    background: #ccffe7;
  }

  .yellow-green {
    border-top: 4px solid #72ed25;
    background: #e0ffcc;
  }

  .yellow {
    border-top: 4px solid #facc14;
    background: #fec;
  }

  .aqua {
    border-top: 4px solid #25ede3;
    background: #ccfffc;
  }

  .orange {
    border-top: 4px solid #ff7b00;
    background: #ffe5cc;
  }
</style>
