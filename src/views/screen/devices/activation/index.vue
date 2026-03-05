<template>
  <div class="screen-page">
    <div class="screen">
      <div class="screen-header">设备稼动率</div>
      <div class="screen-content">
        <div class="screen-content-left">
          <div class="devices-preview-card card-style-block mb-24px">
            <div class="card-style-header">设备总览</div>
            <div class="searchBlock flex flex-start pl-24px">
              <div class="searchItem mr-12px pr-20px">
                <ApiSelect
                  class="process-select min-w-[190px] bg-[#f0f0f0]"
                  :api="getFactoryList"
                  v-model:value="factoryId"
                  :show-search="true"
                  :filter-option="factoryFilterOption"
                  result-field="data"
                  label-field="Name"
                  value-field="Id"
                  placeholder="请选择工厂"
                  key="Id"
                  :not-found-content="null"
                  :immediate="true"
                  :defaultFirstOption="false"
                  :bordered="false"
                  :dropdownMatchSelectWidth="false">
                  <template #suffixIcon>
                    <div class="pr-10px">
                      <i class="icon-ym icon-ym-unfold pr-10px color-[#999] text-[12px] inline-block"></i>
                    </div>
                  </template>
                </ApiSelect>
              </div>

              <div class="searchItem mr-12px pr-20px">
                <!-- :filter-option="factoryFilterOption" -->
                <ApiSelect
                  class="process-select min-w-[190px] bg-[#f0f0f0]"
                  :api="getEquipmentcategorylist"
                  v-model:value="category"
                  :show-search="true"
                  placeholder="请选择设备类别"
                  result-field="data"
                  label-field="Value"
                  value-field="Key"
                  key="Key"
                  :not-found-content="null"
                  :immediate="true"
                  :defaultFirstOption="false"
                  :bordered="false"
                  :dropdownMatchSelectWidth="false">
                  <template #suffixIcon>
                    <div class="pr-10px">
                      <i class="icon-ym icon-ym-unfold pr-10px color-[#999] text-[12px] inline-block"></i>
                    </div>
                  </template>
                </ApiSelect>
              </div>
            </div>
            <div class="card-style-body" ref="cardStyleBodyRef">
              <div class="card-style-body-top">
                <div>
                  <div class="label">设备总数量</div>
                  <div class="value">{{ state.equipmentOverview.totalEquipmentQuantity }}</div>
                </div>
                <div>
                  <div class="label">在线设备量</div>
                  <div class="value">{{ state.equipmentOverview.onlineEquipmentQuantity }}</div>
                </div>
                <div>
                  <div class="label">离线设备量</div>
                  <div class="value">{{ state.equipmentOverview.unknownEquipmentQuantity }}</div>
                </div>
                <div>
                  <div class="label">故障设备数量</div>
                  <div class="value">{{ state.equipmentOverview.faultEquipmentQuantity }}</div>
                </div>
                <div>
                  <div class="label">总运行时间</div>
                  <div class="value">{{ state.equipmentOverview.totalRunningTimeStr }}</div>
                </div>
                <div>
                  <div class="label">总理论时间</div>
                  <div class="value">{{ state.equipmentOverview.totalTheoreticalTimeStr }}</div>
                </div>
              </div>
              <div class="card-style-body-tips">
                <div>
                  <span>平均稼动率</span>
                  <span>{{ state.equipmentOverview.avgOperationRate }}%</span>
                </div>
                <div>
                  <span>最高稼动率</span>
                  <span>{{ state.equipmentOverview.maxOperationRate }}%</span>
                </div>
                <div>
                  <span>最低稼动率</span>
                  <span>{{ state.equipmentOverview.minOperationRate }}%</span>
                </div>
              </div>
              <div class="card-style-body-chart">
                <div class="position-relative">
                  当天平均稼动率
                  <TodayActivationChart
                    ref="todayActivationChartRef"
                    v-if="state.equipmentOverview?.currentDayAvgOperationRateList?.length"
                    class="w-full h-[200px]"
                    :data="state.equipmentOverview?.currentDayAvgOperationRateList"></TodayActivationChart>
                  <ScreenNoData v-else class="w-full h-full" />
                </div>
                <div class="position-relative">
                  7天平均稼动率
                  <WeekActivationChart
                    v-if="state.sevenDayAvgOperationRate?.length"
                    class="w-full h-[200px]"
                    :data="state.sevenDayAvgOperationRate"></WeekActivationChart>
                  <ScreenNoData v-else class="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
          <div class="time-activation-card card-style-block mb-24px">
            <div class="card-style-header">时间稼动率 </div>
            <TimeActivationChart
              ref="timeActivationChartRef"
              v-if="state.equipmentOverview?.timeOperationRateList?.length"
              class="w-full h-full"
              :data="state.equipmentOverview.timeOperationRateList"
              @onTimeActivationClick="onTimeActivationClickFn"></TimeActivationChart>
            <ScreenNoData v-else class="w-full h-full" />
          </div>
          <div class="devices-status-block">
            <div class="devices-status-preview-card card-style-block mr-10px">
              <div class="card-style-header">固资状态总览</div>
              <DeviceStatusChart
                v-if="state.equipmentOverview?.equipmentStatusOverviewList?.length"
                class="w-full h-full"
                :data="state.equipmentOverview.equipmentStatusOverviewList"></DeviceStatusChart>
              <ScreenNoData v-else class="w-full h-full" />
            </div>
            <div class="devices-error-status-card card-style-block ml-10px">
              <div class="card-style-header">设备异常故障次数排行</div>
              <DeviceErrorChart
                v-if="state.equipmentOverview?.equipmentFaultQuantityList?.length"
                class="w-full h-full"
                :data="state.equipmentOverview.equipmentFaultQuantityList"></DeviceErrorChart>
              <ScreenNoData v-else class="w-full h-full" />
            </div>
          </div>
        </div>
        <div class="screen-content-right card-style-block" v-loading="isLoading">
          <div class="card-style-header">当前稼动率</div>
          <TodayActivationList
            ref="todayActivationListRef"
            v-if="state.equipmentOverview?.operationRateList?.length"
            :data="state.equipmentOverview.operationRateList"
            :factoryAreaId="factoryId"
            :category="category"
            @onDateChange="list => (state.equipmentOverview.timeOperationRateList = list)"></TodayActivationList>
          <ScreenNoData v-else class="w-full h-full" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
  import TimeActivationChart from './components/TimeActivationChart.vue';
  import WeekActivationChart from './components/WeekActivationChart.vue';
  import TodayActivationChart from './components/TodayActivationChart.vue';
  import DeviceErrorChart from './components/DeviceErrorChart.vue';
  import DeviceStatusChart from './components/DeviceStatusChart.vue';
  import TodayActivationList from './components/TodayActivationList.vue';
  import { getEquipmentoverview, getSevendayavgoperationrate, getEquipmentcategorylist } from '/@/api/equipment/operationrate';
  import ScreenNoData from './components/screenNoData.vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getFactoryList } from '/@/api/basicData/factory';

  interface State {
    equipmentOverview: any;
    sevenDayAvgOperationRate: any;
  }
  const state: State = reactive({
    equipmentOverview: {},
    sevenDayAvgOperationRate: {},
  });
  const factoryId = ref('');
  const category = ref('20');

  const isLoading = ref(false);
  const isInitFlag = ref(false);
  const todayActivationChartRef: any = ref();
  const todayActivationListRef: any = ref();
  const timeActivationChartRef: any = ref();
  // 添加定时器引用
  let timer: NodeJS.Timeout | null = null;

  watch([() => factoryId.value, () => category.value], () => {
    isInitFlag.value = false;
    init();
    initChartStyleFn();
  });

  function initChartStyleFn() {
    timeActivationChartRef.value?.clearChartSelect();
    todayActivationListRef.value?.setEquipmentCode('');
  }
  async function init(): Promise<void> {
    isLoading.value = true;
    let promises: Promise<any>[] = [];
    let resultDataMap = {};
    if (state.sevenDayAvgOperationRate?.length && isInitFlag.value) {
      promises = [getEquipmentoverview({ category: category.value, factoryAreaId: factoryId.value })];
      resultDataMap = {
        0: 'equipmentOverview',
      };
    } else {
      promises = [
        getEquipmentoverview({ category: category.value, factoryAreaId: factoryId.value }),
        getSevendayavgoperationrate({ category: category.value, factoryAreaId: factoryId.value }),
      ];
      resultDataMap = {
        0: 'equipmentOverview',
        1: 'sevenDayAvgOperationRate',
      };
    }
    const result = await Promise.allSettled(promises);
    isInitFlag.value = true;
    result.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        state[resultDataMap[i]] = r.value?.data;
      }
    });
    isLoading.value = false;
  }

  // 设置自动刷新函数
  function setupAutoRefresh() {
    const refreshInterval = 180000; // 3分钟
    // 首次加载
    init();
    // 设置3分钟定时器 (180000ms)
    timer = setInterval(() => {
      init();
    }, refreshInterval);
  }

  const factoryFilterOption = (inputValue, path) => {
    return [path].some(option => option.label.indexOf(inputValue) > -1);
  };

  function onTimeActivationClickFn({ currentSelectedIndex, params }) {
    if (!factoryId.value) return;
    if (!currentSelectedIndex && currentSelectedIndex !== 0) {
      todayActivationListRef.value?.setEquipmentCode('');
      return todayActivationChartRef.value?.getDayvgoperationratelistFn();
    }
    todayActivationListRef.value?.setEquipmentCode(params.name);
    return todayActivationChartRef.value?.getDayvgoperationratelistFn({
      factoryAreaId: factoryId.value,
      category: category.value,
      equipmentCode: params.name,
    });
  }

  onMounted(() => {
    setupAutoRefresh();
  });

  // 组件卸载时清除定时器
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
</script>

<style lang="less" scoped>
  .screen-page {
    width: 100%;
    height: 100%;
    background: #040763;
    position: relative;
    overflow: hidden;
  }

  .screen {
    width: 100%;
    height: 100%;
    // background: url('/@/assets/images/screen/screen-bg.png');
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    &-header {
      height: 88px;
      padding-top: 6px;
      background: url('/@/assets/images/screen/screen-header.png') no-repeat;
      background-size: 100% 100%;
      background-position: center;
      border: #fff;
      z-index: 99;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 32px;
      padding-bottom: 20px;
    }

    &-content {
      display: flex;
      flex: 1;
      color: #fff;
      padding: 12px 24px;
      //   overflow-y: auto;
      height: calc(100vh - 88px);

      &-left {
        margin: 0 12px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;

        & > div {
          flex: 1;
        }
      }

      &-right {
        margin: 0 12px;
        width: 50%;
        height: calc(100vh - 112px);
        border: 2px solid #0e5fff;
        background: rgb(2 0 77 / 60%);
      }
    }
  }

  .card-style {
    &-block {
      background: rgb(2 0 77 / 70%);
      border: 2px solid #0e5fff;
      min-height: 120px;
      display: flex;
      flex-direction: column;
    }

    &-header {
      height: 36px;
      max-height: 36px;
      background: url('/@/assets/images/screen/screen-card-bg.png') no-repeat;
      background-size: 60% 100%;
      background-position: center;
      color: #19ecff;
      font-family: 'Noto Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 36px;
      text-align: center;
      position: relative;

      &::before {
        content: '';
        border: 8px solid #0e5fff;
        border-right: 0;
        position: absolute;
        top: 0;
        left: 0;
        height: 50%;
      }

      &::after {
        content: '';
        display: inline-block;
        background: #0e5fff;
        border: 8px solid #0e5fff;
        border-left: 0;
        position: absolute;
        top: 0;
        right: 0;
        height: 5%;
      }
    }

    &-body {
      display: flex;
      flex-direction: column;
      font-size: 14px;

      & > div {
        display: flex;
        flex: 1;
        margin-top: 18px;
      }

      &-top {
        max-height: 68px;
        color: #fff;
        padding: 0 16px;

        & > div {
          width: 25%;
          border: 1px solid #19ecff;
          margin-right: 8px;
          padding: 6px 0 6px 6px;
        }

        & > div:first-child {
          border: 1px solid #19ecff;
          margin-left: 8px;
        }

        & > div:nth-of-type(odd) {
          .label {
            font-size: 16px;
          }

          .value {
            color: #fedb65;
            font-size: 24px;
          }
        }

        & > div:nth-of-type(even) {
          .label {
            font-size: 14px;
          }

          .value {
            color: #19ecff;
            font-size: 21px;
          }
        }
      }

      &-tips {
        display: flex;
        align-items: center;
        max-height: 40px;
        line-height: 40px;
        border: 1px dashed rgb(255 255 255 / 12%);
        background: rgb(255 255 255 / 9%);
        margin: 0 24px;
        padding-left: 24px;

        & > div {
          margin-right: 12px;
        }
      }

      &-chart {
        width: 100%;
        margin-top: 18px;
        padding: 18px 24px;

        & > div {
          width: 50%;
          position: relative;
          min-height: 140px;
        }
      }
    }
  }

  .devices-preview-card {
    min-height: 442px;
  }

  .time-activation-card {
    min-height: 248px;
  }

  .devices-status-block {
    min-height: 248px;
    display: flex;
    justify-content: center;

    div {
      flex: 1;
      width: 100%;
    }
  }
</style>
