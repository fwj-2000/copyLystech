<template>
  <div class="quantity-achievement quantity-box">
    <!-- 良率/稼动率达成看板 -->
    <Panel :title="t('dict.YieldDashboard')" class="mr-[16px]" :tips="t('dict.CurrentMachineYieldTips')">
      <!-- 卡片 -->
      <div class="cards">
        <Card :title="`${t('dict.CurrentMachineYieldRate')}(%)`" :content="utilizationAchievementInfo.machineYieldRate" class="mr-12px machine-bg">
          <img src="/@/assets/images/productProgress/machine.png" class="img-icon" alt="" />
        </Card>
        <Card :title="`${t('dict.TargetYieldRate')}(%)`" :content="utilizationAchievementInfo.targetYieldRate" class="mr-12px plan-bg">
          <img src="/@/assets/images/productProgress/plan.png" class="img-icon" alt="" />
        </Card>
      </div>
      <!-- 图表 -->
      <div class="echart-box mt-[10px]">
        <LineEchart
          v-if="activeKey === '0'"
          :title="t('dict.YieldAchievementRate')"
          color1="rgba(56, 116, 255)"
          color2="rgba(94, 190, 255)"
          nodeColor="rgba(75, 123, 236)"
          :chartData="utilizationAchievementInfo.yieldRateList" />
      </div>
    </Panel>

    <!-- 稼动率看板 -->
    <Panel :title="t('dict.UtilizationRateDashboard')" class="mr-[16px]" :tips="t('dict.UtilizationTips')">
      <!-- 卡片 -->
      <div class="cards">
        <Card
          :title="`${t('dict.CurrentUtilizationRate')}(%)`"
          :content="utilizationAchievementInfo.currentUtilizationRate"
          class="w-[40%] mr-12px utilization-bg">
          <img src="/@/assets/images/productProgress/utilization.png" class="img-icon" alt="" />
        </Card>
        <Card :title="`${t('dict.TargetUtilizationRate')}(%)`" :content="utilizationAchievementInfo.targetTieldRate" class="w-[40%] mr-12px plan-bg">
          <img src="/@/assets/images/productProgress/analyze.png" class="img-icon" alt="" />
        </Card>
      </div>
      <!-- 图表 -->
      <div class="echart-box mt-[10px]">
        <LineEchart
          v-if="activeKey === '0'"
          :title="t('dict.AchievementRateOperation')"
          color1="rgba(255, 123, 0)"
          color2="rgba(255, 208, 78)"
          nodeColor="rgba(255, 123, 0)"
          :chartData="utilizationAchievementInfo.utilizationRateList" />
      </div>
    </Panel>

    <!-- 模切效率达成看板 -->
    <Panel :title="t('dict.EfficiencyAchievementDashboard')" class="mr-[16px]" :tips="t('dict.EfficiencyAchievementTips')">
      <div class="cards">
        <Card
          :title="`${t('dict.ActualProductionEfficiency')}(%)`"
          :content="utilizationAchievementInfo.currentProductionEfficiencyRate"
          class="mr-12px product-bg">
          <img src="/@/assets/images/productProgress/product.png" class="img-icon" alt="" />
        </Card>
        <Card :title="`${t('dict.PCCStandardEfficiency')}(%)`" :content="utilizationAchievementInfo.pccStandardRate" class="mr-12px plan-bg">
          <img src="/@/assets/images/productProgress/efficiency.png" class="img-icon" alt="" />
        </Card>
      </div>
      <div class="echart-box mt-[10px]">
        <LineEchart
          v-if="activeKey === '0'"
          :title="t('dict.dieCuttingEfficiency')"
          color1="rgba(56, 116, 255)"
          color2="rgba(94, 190, 255)"
          nodeColor="rgba(75, 123, 236)"
          :chartData="utilizationAchievementInfo.productionEfficiencyRateList" />
      </div>
    </Panel>
  </div>
</template>
<script lang="ts" setup>
  import Panel from './Panel.vue';
  import Card from './Card.vue';
  import LineEchart from './LineEchart.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const props = defineProps({
    utilizationAchievementInfo: {
      type: Object,
      default: () => ({}),
    },
    chartData: {
      type: Object,
      default: () => ({
        xAxisData: [],
        seriesData: [],
      }),
    },
    activeKey: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .quantity-achievement {
    display: flex;
    flex-wrap: wrap;

    .panel {
      width: calc((100% - 32px) / 3);

      &:nth-child(3n) {
        margin-right: 0;
      }
    }

    .cards {
      display: flex;

      .img-icon {
        height: 100%;
      }

      .product-bg {
        background: linear-gradient(94deg, rgb(63 186 164) 8.55%, rgb(107 215 196) 75.48%);
      }

      .plan-bg {
        background: linear-gradient(94deg, rgb(127 142 178) 8.55%, rgb(87 103 142) 75.48%);
      }

      .machine-bg {
        background: linear-gradient(94deg, rgb(17 145 232) 8.55%, rgb(94 190 255) 75.48%);
      }

      .utilization-bg {
        background: linear-gradient(94deg, rgb(144 97 252) 8.55%, rgb(122 68 248) 75.48%);
      }
    }
  }

  .quantity-box {
    display: flex;
    flex-wrap: wrap;
    @media (max-width: 1420px) {
      .panel {
        width: calc((100% - 16px) / 2); /* 小屏每行 2 个 */
        &:nth-child(2n) {
          margin-right: 0;
        }

        &:nth-child(3) {
          margin-top: 16px;
        }
      }
    }
  }
</style>
