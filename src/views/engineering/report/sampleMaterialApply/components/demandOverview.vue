<template>
  <div class="overview-Content">
    <div class="section-head">
      <subtitle :title="t('dict.sample.overview')"></subtitle>
      <div class="time">{{ t('common.updateTime') }}: {{ updateTime }}</div>
    </div>
    <div class="section-body">
      <div class="top-small-container">
        <div class="small-container color-1">
          <div class="mainContent">
            <div class="line colorline-1"></div>
            <div class="content">
              <div class="title">{{ t('dict.application.area') }}</div>
              <div class="value">{{ applyAreaSum }}</div>
            </div>
          </div>
          <img :src="applyIcon" alt="START Icon" class="icon-1" />
        </div>

        <div class="small-container color-2">
          <div class="mainContent">
            <div class="line colorline-2"></div>
            <div class="content">
              <div class="title">{{ t('dict.SampleApplyColumn.replyArea') }}</div>
              <div class="value">{{ replyAreaSum }}</div>
            </div>
          </div>
          <img :src="replayIcon" alt="DEAL Icon" class="icon-1" />
        </div>
      </div>

      <div class="bottom-small-container">
        <div class="small-container color-3">
          <div class="mainContent">
            <div class="line colorline-3"></div>
            <div class="content">
              <div class="title">{{ t('dict.SampleApplyColumn.complianceRate') }}(%)</div>
              <div class="value">{{ complianceRateSum }}</div>
            </div>
          </div>
          <img :src="rateIcon" alt="STOP Icon" class="icon-1" />
        </div>

        <div class="small-container color-4">
          <div class="mainContent">
            <div class="line colorline-4"></div>
            <div class="content">
              <div class="title">{{ t('dict.SampleApplyColumn.amount') }}(RMB)</div>
              <div class="value">/</div>
            </div>
          </div>
          <img :src="priceIcon" alt="END Icon" class="icon-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import applyIcon from '../assets/apply.svg';
  import priceIcon from '../assets/price.svg';
  import replayIcon from '../assets/replay.svg';
  import rateIcon from '../assets/rate.svg';

  defineProps<{
    applyAreaSum: number;
    replyAreaSum: number;
    complianceRateSum: number;
    updateTime: string;
  }>();

  const { t } = useI18n();
</script>

<style scoped>
  .overview-Content {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .small-container {
    display: flex;
    align-items: center;
    height: 90%;
    box-sizing: border-box;
    justify-content: center;
    border-radius: 4px;
    width: calc((100% - 24px) / 2);
    position: relative;
  }

  .color-1 {
    border: 1px solid rgb(28 183 255 / 40%);
    background: rgb(28 183 255 / 6%);
  }

  .color-2 {
    border: 1px solid rgb(24 144 255 / 40%);
    background: rgb(24 144 255 / 6%);
  }

  .color-3 {
    border: 1px solid rgb(213 77 255 / 40%);
    background: rgb(213 77 255 / 6%);
  }

  .color-4 {
    border: 1px solid rgb(50 180 55 / 40%);
    background: rgb(50 180 55 / 6%);
  }

  .line {
    width: 4px;
    border-radius: 10px 0 0 10px;
    margin-left: 0;
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .colorline-1 {
    background: rgb(28 183 255 / 100%);
  }

  .colorline-2 {
    background: rgb(24 144 255 / 100%);
  }

  .colorline-3 {
    background: rgb(213 77 255 / 100%);
  }

  .colorline-4 {
    background: rgb(82 196 26 / 100%);
  }

  .section-head {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    padding: 8px 12px;
    background: linear-gradient(180deg, rgb(255 237 229 / 100%), rgb(255 248 245 / 100%) 100%);
  }

  .subtitle {
    margin-left: 12px;
    font-weight: 700;
  }

  .time {
    font-size: 13px;
    color: #555;
    margin-right: 12px;
  }

  .section-body {
    height: calc(100% - 40px);
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    border-left: 1px solid #f0f0f0;
    border-right: 1px solid #f0f0f0;
    padding-top: 12px;
    box-sizing: border-box;
  }

  .top-small-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    height: 50%;
    align-items: center;
    margin-left: 18px;
    margin-right: 18px;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .bottom-small-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    height: 50%;
    align-items: center;
    margin-left: 18px;
    margin-right: 18px;
  }

  .mainContent {
    width: calc((100% - 30px) / 70 * 117);
    height: calc(100% - 30px);
    margin: 15px auto 15px 15px;
    display: flex;
    flex-direction: row;
  }

  .title {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;
    margin-top: 1px;
    margin-left: 20px;
  }

  .value {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    letter-spacing: 0;
    text-align: left;
    margin-left: 18px;
  }

  .icon-2 {
    position: absolute;
    right: 6px;
    bottom: 6px;
  }
</style>
