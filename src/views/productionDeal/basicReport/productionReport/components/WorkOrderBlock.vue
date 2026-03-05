<template>
  <div class="workorder-block">
    <!-- 工单未开始 -->
    <div :class="['block-item', workOrderStatus.includes('notStarted') ? 'gray-border' : '']" @click="handleClickWorkOrder('notStarted')">
      <div class="block-item-content gray-block">
        <div class="block-name">{{ t('dict.CommonCol.workOrderNotStart') }}</div>
        <div class="block-number">{{ orderQty.notStartedQty }}</div>
      </div>
      <img src="/@/assets/images/productProgress/svg/gray_arrow.svg" v-show="workOrderStatus.includes('notStarted')" class="block-arrow" alt="" />
    </div>
    <!-- 工单进行中 -->
    <div :class="['block-item', workOrderStatus.includes('inProgress') ? 'blue-border' : '']" @click="handleClickWorkOrder('inProgress')">
      <div class="block-item-content blue-block">
        <div class="block-name">{{ t('dict.CommonCol.workOrderInProgress') }}</div>
        <div class="block-number">{{ orderQty.inProgressQty }}</div>
      </div>
      <img src="/@/assets/images/productProgress/svg/blue_arrow.svg" v-show="workOrderStatus.includes('inProgress')" class="block-arrow" alt="" />
    </div>
    <!-- 工单已完成 -->
    <div :class="['block-item', workOrderStatus.includes('completed') ? 'green-border' : '']" @click="handleClickWorkOrder('completed')">
      <div class="block-item-content green-block">
        <div class="block-name">{{ t('dict.CommonCol.workOrderCompleted') }}</div>
        <div class="block-number">{{ orderQty.completedQty }}</div>
      </div>
      <img src="/@/assets/images/productProgress/svg/green_arrow.svg" v-show="workOrderStatus.includes('completed')" class="block-arrow" alt="" />
    </div>
    <!-- 工单延期数量 -->
    <div :class="['block-item', workOrderStatus.includes('delayed') ? 'orange-border' : '']" @click="handleClickWorkOrder('delayed')">
      <div class="block-item-content orange-block">
        <div class="block-name">{{ t('dict.CommonCol.workOrdersDelayedQty') }}</div>
        <div class="block-number">{{ orderQty.delayQty }}</div>
      </div>
      <img src="/@/assets/images/productProgress/svg/orange_arrow.svg" v-show="workOrderStatus.includes('delayed')" class="block-arrow" alt="" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const emit = defineEmits(['changeWorkOrderStatus']);

  const props = defineProps({
    workOrderStatus: {
      type: Array,
      default: ['notStarted'],
    },
    orderQty: {
      type: Object,
      default: () => ({}),
    },
  });

  const handleClickWorkOrder = status => {
    if (props.workOrderStatus.length == 1 && props.workOrderStatus[0] === status) {
      return;
    }
    emit('changeWorkOrderStatus', status);
  };
</script>

<style lang="less" scoped>
  .workorder-block {
    display: flex;

    .block-item {
      position: relative;
      flex: 1;
      margin-right: 16px;
      border-radius: 4px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      .block-item-content {
        height: 118px;
        padding: 0 22px;
        color: #1d2129;
        line-height: 20px;
        background-repeat: no-repeat;
        background-size: auto 100px;
        background-position: right 0 bottom 0;
        border-radius: 4px;

        .block-name {
          margin: 28px 0 6px;
          font-size: 14px;
        }

        .block-number {
          font-size: 20px;
          font-weight: 500;
        }
      }

      .orange-block {
        background-image: url('/@/assets/images/productProgress/orange_clock.png');
        border-top: 4px solid #ff7b00;
        background-color: #fff1e4;
      }

      .gray-block {
        background-image: url('/@/assets/images/productProgress/gray_clock.png');
        border-top: 4px solid #57678e;
        background-color: #dde1eb;
      }

      .blue-block {
        background-image: url('/@/assets/images/productProgress/blue_clock.png');
        border-top: 4px solid #3874ff;
        background-color: #eaf0ff;
      }

      .green-block {
        background-image: url('/@/assets/images/productProgress/green_clock.png');
        border-top: 4px solid #3fbaa4;
        background-color: #e0f2ee;
      }

      .block-arrow {
        position: absolute;
        bottom: -6px;
        left: 50%; /* 水平中心线 */
        transform: translateX(-50%); /* 向左移动自身一半，完成居中 */
        width: 20px; /* 子元素尺寸可按需调整 */
      }
    }

    .orange-border {
      border: 1px solid #ff7b00;
    }

    .gray-border {
      border: 1px solid #57678e;
    }

    .blue-border {
      border: 1px solid #3874ff;
    }

    .green-border {
      border: 1px solid #3fbaa4;
    }
  }
</style>
