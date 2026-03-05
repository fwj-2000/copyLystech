<!-- 指标说明组件 -->
<template>
  <div v-for="(item, idx) in props.infoList" :key="idx" class="item">
    <div class="title">{{ item.title }}</div>
    <div class="content">
      <p v-for="(p, pidx) in item.content" :key="pidx">{{ p }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Info {
  title: string;
  content: string[];
};
const props = defineProps<{
  infoList: Info[];
}>();
</script>

<style lang="less" scoped>
.item {
  &:first-child {
    .title {
      margin-top: 0;
    }
  }

  .title {
    color: #1A1A1A;
    font-family: "Noto Sans SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: -0.32px;
    margin: 16px 0 11px 0;
  }

  .content {
    color: #666;
    font-family: "Microsoft YaHei UI";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    padding: 12px 16px;
    background-color: #F2F2F2;
    border-radius: 4px;
  }
}
</style>