<template>
  <div class="cus-rows">
    <span class="label ml-10px">结果: </span>
    <span v-if="data.result == '1'" style="color: #52c41a" class="value ml-10px">成功</span>
    <span v-if="data.result == '2'" style="color: red" class="value ml-10px">失败</span>
    <span class="label ml-20px">竞价价格: </span>
    <span class="value ml-10px" style="color: #1890ff">{{ data?.price?.toLocaleString() }}</span>
    <span class="label ml-20px">备注: </span>
    <span class="value ml-10px">{{ data.remark }}</span>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    data: {
      type: Object,
      default: {},
    },
  });
</script>

<style lang="less" scoped>
  .cus-rows {
    .cus-rows {
      .label {
        color: #666;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }

      .value {
        color: #1a1a1a;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }
    }
  }
</style>
