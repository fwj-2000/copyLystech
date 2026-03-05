<template>
  <div class="cus-rows">
    <div v-for="(item, index) in (props.list as any)" :key="index" class="p-8px mr-20px" style="display: inline-block">
      <span class="priceTitle">{{ item.priceTitle }}: </span>
      <span class="price ml-12px">{{ item.price }}</span>
      <span class="gpTitle ml-10px">{{ item.gpTitle }}: </span>
      <span class="gp ml-10px">{{ item.gp }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });
</script>

<style lang="less" scoped>
  .cus-rows {
    .priceTitle {
      color: #666;

      /* 中文/正文14 */

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .price {
      overflow: hidden;
      color: #1890ff;
      text-overflow: ellipsis;

      /* 中文/正文14 */

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .gpTitle {
      color: #666;

      /* 中文/正文14 */

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .gp {
      overflow: hidden;
      color: #1a1a1a;
      text-overflow: ellipsis;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
  }
</style>
