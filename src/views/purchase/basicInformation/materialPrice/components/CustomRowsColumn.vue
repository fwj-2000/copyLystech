<template>
  <div class="cus-rows">
    <div v-for="(item, index) in (props.list as any)" :key="index" class="p-6px mr-10px" style="display: inline-block">
      <span class="label" v-if="item.label">{{ item.label }}: </span>
      <span class="value ml-4px" v-if="item.value">{{ item.value }}</span>
      <span class="value ml-4px" v-else>-</span>
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
    display: flex;
    flex-direction: column;

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
</style>

<!-- <template>
  <a-row :gutter="[20, 10]" class="cus-rows" v-if="props.list.length">
    <a-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" :xxl="4" v-for="(item, index) in (props.list as any)" :key="index">
     <span class="label" v-if="item.label">{{ item.label }}: </span>
     <a-tooltip placement="top">
        <template #title>
          {{ item.value }}
        </template>
        <span class="value" v-if="item.value">{{ item.value }}</span>
      </a-tooltip>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>

  const props = defineProps({
    list: {
      type: Array,
      default: () => []
    }
  })

</script>

<style lang="less" scoped>
  .cus-rows {
    overflow: hidden;
    .ant-col {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .label {
      color: #666;
      /* 中文/正文14 */
      font-family: "Microsoft YaHei UI";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }
    .value {
      color: #1A1A1A;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: "Microsoft YaHei UI";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }
  }
</style> -->
