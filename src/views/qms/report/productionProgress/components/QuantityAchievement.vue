<template>
  <div class="quantity-achievement">
    <!-- 数量达成看板 -->
    <Panel :title="t('dict.QuantityAchievementDashboard')" class="mr-[16px]" :tips="t('dict.QuantityAchievementTips')">
      <!-- 卡片 -->
      <div class="cards">
        <Card :title="t('dict.QuantityAchieved')" :content="thousandsFormat(quantityAchievementInfo.totalQuantityAchievement)" class="mr-12px achievement-bg">
          <img src="/@/assets/images/productProgress/achievement.png" class="img-icon" alt="" />
        </Card>
        <Card
          :title="t('dict.processRetrospectReport.PlansQuantitySum')"
          :content="thousandsFormat(quantityAchievementInfo.planQuantityAchievement)"
          class="mr-12px plan-bg">
          <img src="/@/assets/images/productProgress/plan.png" class="img-icon" alt="" />
        </Card>
      </div>
      <!-- 图表 -->
      <div class="echart-box mt-[10px]">
        <LineEchart
          v-if="activeKey === '1'"
          :title="t('dict.QuantityAchievementRate')"
          color1="rgba(56, 116, 255)"
          color2="rgba(94, 190, 255)"
          nodeColor="rgba(75, 123, 236)"
          :needPercentSign="false"
          :chartData="quantityAchievementInfo.quantityAchievedList" />
      </div>
    </Panel>

    <!-- 工时达成看板 -->
    <Panel :title="t('dict.WorkHourAchievementDashboard')" :tips="t('dict.WorkHourAchievementTips')">
      <!-- 卡片 -->
      <div class="cards">
        <Card :title="t('dict.AchievedWorkingHours')" :content="quantityAchievementInfo.totalWorkTimeAchievement" class="w-[40%] mr-12px work-time-bg">
          <img src="/@/assets/images/productProgress/workTime.png" class="img-icon" alt="" />
        </Card>
        <Card :title="t('dict.PlannedWorkingHours')" :content="quantityAchievementInfo.planWorkTimeAchievement" class="w-[40%] mr-12px plan-time-bg">
          <img src="/@/assets/images/productProgress/planTime.png" class="img-icon" alt="" />
        </Card>
      </div>
      <!-- 图表 -->
      <div class="echart-box mt-[10px]">
        <LineEchart
          v-if="activeKey === '1'"
          :title="t('dict.WorkHourAchievementRate')"
          color1="rgba(255, 123, 0)"
          color2="rgba(255, 208, 78)"
          nodeColor="rgba(255, 123, 0)"
          :needPercentSign="false"
          :chartData="quantityAchievementInfo.workTimeAchievedList" />
      </div>
    </Panel>
  </div>
</template>
<script lang="ts" setup>
  import Panel from './Panel.vue';
  import Card from './Card.vue';
  import LineEchart from './LineEchart.vue';
  import { thousandsFormat } from '/@/utils/lydc';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const props = defineProps({
    quantityAchievementInfo: {
      type: Object,
      default: () => ({}),
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

    .panel {
      width: calc((100% - 16px) / 2);
    }

    .cards {
      display: flex;

      .img-icon {
        height: 100%;
      }

      .achievement-bg {
        background: linear-gradient(94deg, #ff993a 8.55%, #ff8310 75.48%);
      }

      .plan-bg {
        background: linear-gradient(94deg, rgb(127 142 178) 8.55%, rgb(87 103 142) 75.48%);
      }

      .work-time-bg {
        background: linear-gradient(94deg, rgb(75 123 236) 8.55%, rgb(48 104 236) 75.48%);
      }

      .plan-time-bg {
        background: linear-gradient(94deg, rgb(127 142 178) 8.55%, rgb(87 103 142) 75.48%);
      }
    }
  }
</style>
