<!-- 底稿数据导入 -->
<template>
  <a-popover title="提示" placement="bottomLeft">
    <template #content>
      <p>1.导入平台已有数据时必须填写所有列数据，否则已有数据列会被清空</p>
      <p>2.只可导入新数据和SAP状态为【反接收/反结算】数据</p>
    </template>
    <SingleUpload
      v-bind="{
        api: '/api/report/dimension/importmanuscript',
        buttonText: '导入',
      }"></SingleUpload>
  </a-popover>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import SingleUpload from '/@/views/dataAnalysis/components/SingleUpload.vue';

  export default defineComponent({
    name: 'PapersImport',
    components: {
      SingleUpload,
    },
  });
</script>
