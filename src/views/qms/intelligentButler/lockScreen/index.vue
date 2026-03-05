<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center bg-white">
      <div class="lydc-content-wrapper-search-box mb-0">
        <ApiSelect
          style="min-width: 140px; background: rgb(255 123 0 / 10%); margin-right: 12px"
          :api="ListByUserfactory"
          placeholder="厂区"
          v-model:value="state.factoryArea"
          :show-search="true"
          result-field="data"
          label-field="Name"
          value-field="Code"
          :filterOption="
            (inputValue, path) => {
              return [path].some(option => option.label.includes(inputValue));
            }
          "
          :not-found-content="null"
          :immediate="true"
          :bordered="false"
          :dropdownMatchSelectWidth="false"
          :defaultFirstOption="true"
          :allowClear="false"
          :onChange="
            e => {
              factoryAreaSelectChange(e);
            }
          ">
          <template #suffixIcon>
            <div>
              <i class="icon-ym icon-ym-unfold" style="display: inline-block; font-size: 12px; color: #999"></i>
            </div>
          </template>
        </ApiSelect>
        <Select
          style="min-width: 140px; background: rgb(255 123 0 / 10%); margin-right: 12px"
          placeholder="请选择机台号"
          v-model:value="state.machineNo"
          :options="state.machineNoData"
          :show-search="true"
          :field-names="{ value: 'machineNo', label: 'machineNo' }"
          :not-found-content="null"
          :immediate="true"
          :bordered="false"
          :dropdownMatchSelectWidth="false"
          :onChange="
            e => {
              machineNoSelectChange(e);
            }
          ">
          <template #suffixIcon>
            <div>
              <i class="icon-ym icon-ym-unfold" style="display: inline-block; font-size: 12px; color: #999"></i>
            </div>
          </template>
        </Select>
      </div>
      <!-- 稼动率看板 -->
      <div class="lydc-content-wrapper-content bg-white dashboard-content">
        <Panel :title="t('dict.UtilizationRateDashboard')" class="dashboard-item mr-[16px]">
          <utilization-rate :chartData="state.utilizationRateData" />
        </Panel>

        <!-- 效率看板 -->
        <Panel :title="t('dict.CommonCol.efficiencyDashboard')" class="dashboard-item mr-[16px]">
          <efficiency :chartData="state.efficiencyRateData" />
        </Panel>

        <!-- 良率看板 -->
        <Panel :title="t('dict.YieldDashboard')" class="dashboard-item">
          <yield :chartData="state.yieldData" />
        </Panel>

        <!-- OEE看板 -->
        <Panel :title="t('dict.OEEDashboard')" class="dashboard-item mr-[16px] mt-[12px]">
          <OEE :chartData="state.OEEData" />
        </Panel>

        <!-- 首件PASS情况 -->
        <Panel :title="t('dict.CommonCol.firstArticlePASS')" class="dashboard-item mr-[16px] mt-[12px]">
          <first-piece-pass :chartData="state.firstPassData" />
        </Panel>

        <!-- 技改看板 -->
        <Panel :title="t('dict.CommonCol.renovationSignboard')" class="dashboard-item mt-[12px]">
          <template #title-suffix>
            <a-button type="primary" v-auth="'btn_maintainTechUpgrade'" ghost @click="maintainTechUpgrade">{{ t('dict.CommonCol.maintainUpgrades') }}</a-button>
          </template>
          <tech-upgrade :chartData="state.techUpgradeData" />
        </Panel>
      </div>
    </div>
    <TechMaintenanceModal @register="registerTechMaintenance" @reload="getData"> </TechMaintenanceModal>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, onBeforeUnmount } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getLockScreenList } from '/@/api/qms/lockScreen';
  import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { Select } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import Panel from './components/Panel.vue';
  // 稼动率看板
  import UtilizationRate from './components/UtilizationRate.vue';
  // 效率看板
  import Efficiency from './components/Efficiency.vue';
  // 良率看板
  import Yield from './components/Yield.vue';
  // OEE看板
  import OEE from './components/OEE.vue';
  // 技改看板
  import TechUpgrade from './components/TechUpgrade.vue';
  // 质量客诉看板
  import FirstPiecePass from './components/FirstPiecePass.vue';
  // 技改维护弹窗
  import TechMaintenanceModal from './components/TechMaintenanceModal.vue';

  defineOptions({ name: 'qms-intelligentButler-lockScreen' });
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerTechMaintenance, { openModal: openTechMaintenance }] = useModal();
  const state = ref<any>({
    factoryArea: '',
    machineNoData: [],
    machineNo: '',
    utilizationRateData: {
      xAxisData: [],
      seriesData: [],
      targetTieldRate: 0,
      utilizationRateSum: 0,
    },
    OEEData: {
      utilizationRateSum: 0, // 机台稼动率
      currentProductionEfficiencyRate: 0, // 模切效率
      currentYieldRate: 0, // 产品合格率
      oee: 0,
      oeeUtilizationRate: 0, // oee机台稼动率占比
      oeeYieldRate: 0, // oee产品合格率（良率）占比
      oeeEfficiencyRate: 0, // oee模切效率占比
    },
    efficiencyRateData: {
      xAxisData: [],
      seriesData: [],
      efficiencyRate: 0,
      pccStandardRate: 0,
      currentProductionEfficiencyRate: 0,
      targetPccStandardRate: 0,
    },
    firstPassData: {
      tableList: [],
      firstOkCount: 0,
      firstNgCount: 0,
    },
    techUpgradeData: [],
    yieldData: {
      currentYieldRate: 0,
      targetYieldRate: 0,
      topYieldRate: 0,
      lastYieldRate: 0,
      yieldRateDetail: [],
    },
  });

  const techObj = ref({
    machineNo: '',
    techId: '',
    techItemList: [],
    innerMaterialCode: '',
    techCreatorName: '',
    techCreatorTime: '',
  });
  const timer = ref<ReturnType<typeof setTimeout>>();

  const getData = () => {
    getLockScreenList({ factoryArea: state.value.factoryArea, machineNo: state.value.machineNo }).then(({ data }) => {
      // 稼动率
      state.value.utilizationRateData.xAxisData = data.utilizationRateList.map(item => {
        return item.time + ':00';
      });
      state.value.utilizationRateData.seriesData = data.utilizationRateList.map(item => {
        return item.utilizationRate;
      });
      state.value.utilizationRateData.targetTieldRate = data.targetTieldRate;
      state.value.utilizationRateData.utilizationRateSum = data.utilizationRateSum;

      // OEE
      state.value.OEEData.utilizationRateSum = data.utilizationRateSum;
      state.value.OEEData.currentProductionEfficiencyRate = data.currentProductionEfficiencyRate;
      state.value.OEEData.currentYieldRate = data.currentYieldRate;
      state.value.OEEData.oee = data.oee;
      state.value.OEEData.oeeUtilizationRate = data.oeeUtilizationRate;
      state.value.OEEData.oeeYieldRate = data.oeeYieldRate;
      state.value.OEEData.oeeEfficiencyRate = data.oeeEfficiencyRate;

      // 效率
      state.value.efficiencyRateData.xAxisData = data.productionEfficiencyRateList.map(item => {
        return item.time + ':00';
      });
      state.value.efficiencyRateData.seriesData = data.productionEfficiencyRateList.map(item => {
        return item.productionEfficiencyRate;
      });
      state.value.efficiencyRateData.efficiencyRate = data.efficiencyRate;
      state.value.efficiencyRateData.pccStandardRate = data.pccStandardRate;
      state.value.efficiencyRateData.currentProductionEfficiencyRate = data.currentProductionEfficiencyRate;
      state.value.efficiencyRateData.targetPccStandardRate = data.targetPccStandardRate;

      // 首件pass
      state.value.firstPassData.tableList = data.firstPasslist;
      state.value.firstPassData.firstOkCount = data.firstOkCount;
      state.value.firstPassData.firstNgCount = data.firstNgCount;

      // 技改
      state.value.techUpgradeData = data.techItemList;

      // 良率
      state.value.yieldData.currentYieldRate = data.currentYieldRate || 0;
      state.value.yieldData.targetYieldRate = data.targetYieldRate || 0;
      state.value.yieldData.topYieldRate = data.topYieldRate || 0;
      state.value.yieldData.lastYieldRate = data.lastYieldRate || 0;
      state.value.yieldData.yieldRateDetail = data.yieldRateDetail;

      // 技改传值
      techObj.value.machineNo = data.machineNo || '';
      techObj.value.innerMaterialCode = data.innerMaterialCode || '';
      techObj.value.techId = data.techId || '';
      techObj.value.techCreatorName = data.techCreatorName || '';
      techObj.value.techCreatorTime = data.techCreatorTime || '';
      techObj.value.techItemList = data.techItemList || [];
    });
  };

  const factoryAreaSelectChange = async e => {
    state.value.factoryArea = e;
    const { data } = await getMachinelCodeList({ factoryArea: e });
    let firstMachineNo = '';
    const { value: storeData } = useLocalStorage('qms-report-productionProgress', { machineNo: '' });
    firstMachineNo = storeData.machineNo;
    if (data && data.length > 0 && !data.some(x => x.machineNo == firstMachineNo)) {
      firstMachineNo = data[0].machineNo;
    }
    storeData.machineNo = firstMachineNo;
    state.value.machineNo = firstMachineNo;
    state.value.machineNoData = data;
    getData();
  };

  const machineNoSelectChange = e => {
    const { value } = useLocalStorage('qms-report-productionProgress', { machineNo: e });
    value.machineNo = e;
    getData();
  };

  const maintainTechUpgrade = () => {
    if (techObj.value.innerMaterialCode == '') return createMessage.warning(t('tip.lockScreen.tip1'));
    openTechMaintenance(true, { techObj: techObj.value });
  };

  onMounted(async () => {
    // const { value: storeData } = useLocalStorage('qms-report-productionProgress', { machineNo: '' });
    // state.value.machineNo = storeData.machineNo;
    // getData();

    // 5分钟刷新一下页面
    timer.value = setInterval(() => {
      getData();
    }, 5 * 60 * 1000);
  });

  onBeforeUnmount(() => {
    clearTimeout(timer.value);
  });
</script>

<style scoped lang="less">
  .dashboard-content {
    display: flex;
    flex-flow: row wrap;
    padding: 0 12px 12px;

    .dashboard-item {
      width: calc((100% - 32px) / 3);
      height: calc((100% - 16px) / 2);
    }
  }
</style>
