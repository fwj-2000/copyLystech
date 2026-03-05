<template>
  <div class="process-box">
    <div class="flex justify-between flex-nowrap">
      <span class="sub-title text-ellipsis">{{ props.title }}</span>
      <span class="sub-rate current-rate" :class="{ 'font-red': isShowRedRate }">{{ props.value || 0 }}</span>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177 4" fill="none">
      <path
        d="M0 2C0 0.895431 0.699999 0 1.56349 0H175.437C176.3 0 177 0.895431 177 2C177 3.10457 176.3 4 175.437 4H1.56349C0.699993 4 0 3.10457 0 2Z"
        fill="#CCCCCC" />
      <path :d="processSvgPath" :fill="`url(#paint0_linear_${instanceUid})`">
        <animate
          attributeName="d"
          :from="`M0 2C0 0.895431 0.47757 0 1.06668 0H0C0.5224 0 1 0.895431 1 2C1 3.10457 0.5224 4 1 4H1.06668C0.477566 4 0 3.10457 0 2Z`"
          :to="processSvgPath"
          dur="1000ms"
          fill="freeze" />
      </path>
      <defs>
        <linearGradient :id="`paint0_linear_${instanceUid}`" x1="0" y1="2" :x2="lineLen" y2="2" gradientUnits="userSpaceOnUse">
          <stop :stop-color="linearColor.startColor" />
          <stop offset="1" :stop-color="linearColor.endColor" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script lang="ts" setup>
  import { computed, getCurrentInstance } from 'vue';
  import { propOptions } from './config';
  import { EProgressColor } from '../config';

  const props = defineProps({
    // keyWord: propOptions.keyWord,
    info: propOptions.info,
    isShowRedRate: propOptions.isShowRedRate,
    colorType: propOptions.colorType,
    title: {
      type: String,
      default: '',
      required: true,
    },
    // 真实值
    value: {
      type: Number,
      default: 0,
      required: true,
    },
    isCurrentMonth: {
      type: Boolean,
      default: false,
    },
    // 最大参考值 进度条
    referenceValue: {
      type: Number,
      default: 100,
    },
  });

  const lineLen = computed(() => {
    const value = isNaN(props.value) ? 0 : +props.value;
    const refValue = isNaN(props.referenceValue) || props.referenceValue <= 0 ? 100 : +props.referenceValue;
    return Math.min((value / refValue) * 177, 177);
  });

  // 简化的路径计算：左侧固定圆角，右侧根据 len 移动
  const processSvgPath = computed(() => {
    const len = lineLen.value;
    if (len <= 0) return '';
    return `M1.5 0 H${len - 1.5} A1.5 1.5 0 0 1 ${len} 1.5 V2.5 A1.5 1.5 0 0 1 ${len - 1.5} 4 H1.5 A1.5 1.5 0 0 1 0 2.5 V1.5 A1.5 1.5 0 0 1 1.5 0 Z`;
  });

  const linearColor = computed(() => {
    const { colorType } = props;
    const color = (EProgressColor[colorType] || '').split(',');
    return {
      startColor: color[0] || '#3969D8',
      endColor: color[1] || '#84A8FF',
    };
  });

  const instance = getCurrentInstance();
  const instanceUid = computed(() => instance && instance.uid);
</script>

<style scoped lang="less">
  .process-box {
    width: 100%;
    border-radius: 4px;
    padding: 9px 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sub-title {
    font-size: 12px;
  }

  .sub-rate {
    color: #1a1a1a;
    font-size: 14px;
    font-style: normal;
    font-weight: 550;
    line-height: normal;
  }

  .current-rate {
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }

  .font-red {
    color: #ff4d4f;
  }
</style>
