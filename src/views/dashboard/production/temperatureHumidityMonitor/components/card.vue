<template>
  <div class="item-wrap error flx-col-ctr" @click="goDetail">
    <div class="top-title">
      <div class="flex">
        <p class="img-wrap" v-if="props.showImg"><img :src="imgSrc" /></p>
        <p class="title">{{ props.item.Factory }}</p>
      </div>
      <p class="title detail" :class="computedClassTitleNoraml"
        >{{ t('views.dashboard.production.temperatureHumidityMonitor.detailText') }}
        <DoubleRightOutlined />
      </p>
    </div>
    <ul class="content" :class="computedClassContentNormal">
      <li v-if="props.showImg" class="bot-left">
        <p class="content-abnormal-title">{{ t('views.dashboard.production.temperatureHumidityMonitor.anomalousEquipment') }}</p>
        <p class="content-number abnormal">{{ props.item.AbnormalDevices }}</p>
      </li>
      <li class="line" v-if="props.showImg"></li>
      <div class="bot-right">
        <li>
          <p>{{ t('views.dashboard.production.temperatureHumidityMonitor.onlineEquipment') }}</p>
          <p class="content-number online">{{ props.item.OnlineDevices }}</p>
        </li>
        <li>
          <p>{{ t('views.dashboard.production.temperatureHumidityMonitor.offlineEquipment') }}</p>
          <p class="content-number offline">{{ props.item.OfflineDevices }}</p>
        </li>
      </div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, computed } from 'vue';
  import { DoubleRightOutlined } from '@ant-design/icons-vue';
  import imgSrc from '/@/assets/svg/report/alarm.svg';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const props = defineProps({
    item: { type: Object, default: () => {} },
    showImg: { type: Boolean, default: true },
    classNames: {
      type: Array as () => string[],
      default: () => [],
    },
  });
  const classTitleNoraml = 'title-normal';
  const classContentNormal = 'content-normal';
  const computedClassTitleNoraml = computed(() => {
    if (Array.isArray(props.classNames)) {
      return props.classNames.includes(classTitleNoraml) ? classTitleNoraml : '';
    }
  });
  const computedClassContentNormal = computed(() => {
    if (Array.isArray(props.classNames)) {
      return props.classNames.includes(classContentNormal) ? classContentNormal : '';
    }
  });
  const router = useRouter();
  const goDetail = () => {
    router.push({
      path: './temperatureHumidityMonitorEchartShow',
      query: {
        orgCode: props.item.Factory,
      },
    });
  };
</script>

<style lang="less" scoped>
  /* 可选的间隔样式 */
  .item-wrap {
    display: flex;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    flex: 1;
    border-radius: 8px;
    border: 1px solid rgb(0 0 0 / 6%);
    background: rgb(255 255 255 / 100%);

    &.error {
      color: #fff;
      cursor: pointer;
    }

    p {
      margin: 0;
    }

    .top-title {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .img-wrap {
        padding: 3px 2px 1px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        border-radius: 5px;
        background: rgb(255 0 0 / 17%);
        margin-right: 6px;
      }

      .title {
        font-weight: 400;
        color: #000;
        font-size: 14px;
      }

      .detail {
        // margin-left: 90px;
        opacity: 0.4;
      }

      .title-normal {
        margin-left: 120px;
      }
    }

    .content {
      // width: 221px;
      width: 100%;
      height: 44px;
      display: flex;
      font-size: 13px;
      list-style: none;
      color: #000;
      margin: 0;
      padding: 0;
      justify-content: space-evenly;

      .line {
        width: 1px;
        height: 20px;
        opacity: 0.06;
        background: #000;
        margin-top: 6px;
        // margin: 0 auto;
        margin-right: 20px;
      }

      li {
        margin: 0;

        p {
          color: #000;
          font-size: 13px;
          font-style: normal;
          font-weight: 400;
          line-height: 14px;
        }

        .content-abnormal-title {
          color: #000;
          font-size: 13px;
          font-style: normal;
          font-weight: 700;
          line-height: 14px;
          opacity: 0.85;
        }

        .content-number {
          margin-top: 12px;
          color: #000;
          font-size: 18px;
          font-style: normal;
          font-weight: 700;
          line-height: 18px;
        }

        .abnormal {
          color: #ff1f00;
        }

        .online {
          opacity: 0.85;
        }

        .offline {
          opacity: 0.4;
        }
      }

      .bot-left {
        width: 33%;
      }

      .bot-right {
        display: flex;
        justify-content: space-between;
        flex: 1;
      }
    }

    .content-normal {
      justify-content: start;

      li {
        margin-right: 45px;
      }
    }
  }
</style>
