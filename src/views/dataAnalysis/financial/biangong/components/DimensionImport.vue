<!-- 底稿数据导入 -->
<template>
  <a-popover title="提示" placement="bottomLeft">
    <template #content>
      <p>数据导入成功需等待一两分钟再次查询</p>
    </template>
    <SingleUpload
      v-bind="{
        api: $props.api,
        buttonText: $props.buttonText,
      }"></SingleUpload>
  </a-popover>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import SingleUpload from '/@/views/dataAnalysis/components/SingleUpload.vue';

  export default defineComponent({
    name: 'PapersImport',
    props: {
      api: {
        type: String,
        default: '',
      },
      buttonText: {
        type: String,
        default: '',
      },
    },
    components: {
      SingleUpload,
    },
  });
</script>
